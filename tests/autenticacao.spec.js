import { test, expect } from '@playwright/test';

const CREDENCIAIS = {
  email: 'admin@ifma.edu.br',
  senha: 'admin123',
};

async function fazerLogin(page) {
  await page.goto('/login');
  await page.getByPlaceholder(/seu@ifma.edu.br/i).fill(CREDENCIAIS.email);
  await page.getByPlaceholder(/sua senha/i).fill(CREDENCIAIS.senha);
  await page.getByRole('button', { name: /entrar/i }).click();
  await page.waitForURL('**/admin', { timeout: 10000 });
}

test.describe('Tela de Login', () => {

  test('deve exibir formulario e rejeitar credenciais invalidas', async ({ page }) => {
    await page.goto('/login');

    await expect(page.getByRole('heading', { name: /acesso administrativo/i })).toBeVisible();
    await expect(page.getByPlaceholder(/seu@ifma.edu.br/i)).toBeVisible();
    await expect(page.getByPlaceholder(/sua senha/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /entrar/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /voltar ao cardápio/i })).toBeVisible();

    await page.getByPlaceholder(/seu@ifma.edu.br/i).fill('admin@ifma.edu.br');
    await page.getByPlaceholder(/sua senha/i).fill('senhaerrada');
    await page.getByRole('button', { name: /entrar/i }).click();

    await expect(page.getByText(/credenciais inválidas/i)).toBeVisible({ timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('deve alternar visibilidade da senha', async ({ page }) => {
    await page.goto('/login');
    const inputSenha = page.getByPlaceholder(/sua senha/i);
    await inputSenha.fill('minhasenha');

    await expect(inputSenha).toHaveAttribute('type', 'password');

    await page.locator('form button[type="button"]').click();
    await expect(inputSenha).toHaveAttribute('type', 'text');

    await page.locator('form button[type="button"]').click();
    await expect(inputSenha).toHaveAttribute('type', 'password');
  });
});

test.describe('Login, JWT e Cookie', () => {

  test('deve retornar accessToken JWT e cookie refresh_token HttpOnly', async ({ page }) => {
    await page.goto('/login');

    const responsePromise = page.waitForResponse(
      (res) => res.url().includes('/api/auth/login') && res.status() === 200
    );

    await page.getByPlaceholder(/seu@ifma.edu.br/i).fill(CREDENCIAIS.email);
    await page.getByPlaceholder(/sua senha/i).fill(CREDENCIAIS.senha);
    await page.getByRole('button', { name: /entrar/i }).click();

    const response = await responsePromise;
    const body = await response.json();

    expect(body.accessToken).toBeTruthy();
    expect(body.accessToken.split('.')).toHaveLength(3);
    expect(body.admin).toBeTruthy();
    expect(body.admin.email).toBe(CREDENCIAIS.email);

    await page.waitForURL('**/admin', { timeout: 10000 });

    const cookies = await page.context().cookies();
    const refreshCookie = cookies.find((c) => c.name === 'refresh_token');
    expect(refreshCookie).toBeTruthy();
    expect(refreshCookie.httpOnly).toBe(true);
    expect(refreshCookie.path).toBe('/api/auth/');
    expect(refreshCookie.sameSite).toBe('Strict');
  });
});

test.describe('Refresh e Restauracao de Sessao', () => {

  test('deve restaurar sessao apos F5 via refresh token', async ({ page }) => {
    await fazerLogin(page);

    await page.reload();
    await page.waitForURL('**/admin', { timeout: 10000 });
    await expect(page).toHaveURL(/\/admin/);
  });

  test('deve rotacionar refresh token e invalidar o antigo', async ({ page }) => {
    await fazerLogin(page);

    const cookiesAntes = await page.context().cookies();
    const refreshAntes = cookiesAntes.find((c) => c.name === 'refresh_token')?.value;
    expect(refreshAntes).toBeTruthy();

    const refreshResponse = await page.evaluate(async () => {
      const res = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      const data = await res.json();
      return { status: res.status, accessToken: data.accessToken, admin: data.admin };
    });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.accessToken).toBeTruthy();
    expect(refreshResponse.admin).toBeTruthy();

    const cookiesDepois = await page.context().cookies();
    const refreshDepois = cookiesDepois.find((c) => c.name === 'refresh_token')?.value;
    expect(refreshDepois).toBeTruthy();
    expect(refreshDepois).not.toBe(refreshAntes);

    await page.context().clearCookies();
    await page.context().addCookies([
      {
        name: 'refresh_token',
        value: refreshAntes,
        domain: 'localhost',
        path: '/api/auth/',
        httpOnly: true,
        sameSite: 'Strict',
      },
    ]);

    const reusoResponse = await page.evaluate(async () => {
      const res = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      return res.status;
    });

    expect(reusoResponse).toBe(401);
  });
});

test.describe('Logout', () => {

  test('deve fazer logout, limpar cookie e bloquear acesso', async ({ page }) => {
    await fazerLogin(page);

    await expect(page.getByRole('button', { name: /sair/i })).toBeVisible({ timeout: 5000 });

    const logoutPromise = page.waitForResponse(
      (res) => res.url().includes('/api/auth/logout')
    );

    await page.getByRole('button', { name: /sair/i }).click();

    const logoutResponse = await logoutPromise;
    expect(logoutResponse.status()).toBe(204);

    await page.waitForURL('**/login', { timeout: 10000 });

    const cookies = await page.context().cookies();
    const refreshCookie = cookies.find((c) => c.name === 'refresh_token');
    expect(refreshCookie).toBeFalsy();

    await page.goto('/admin');
    await page.waitForURL('**/login', { timeout: 10000 });
  });
});

test.describe('Alterar Senha', () => {

  test('deve invalidar sessao e permitir login com nova senha', async ({ page }) => {
    test.setTimeout(60000);

    await fazerLogin(page);

    await page.getByRole('link', { name: /alterar senha/i }).click();
    await page.waitForURL('**/alterar-senha', { timeout: 10000 });

    const inputs = page.locator('input[type="password"]');
    await inputs.first().fill(CREDENCIAIS.senha);
    await inputs.nth(1).fill('novaSenha123');
    await inputs.nth(2).fill('novaSenha123');
    await page.getByRole('button', { name: /alterar senha/i }).click();

    await page.waitForURL('**/login', { timeout: 15000 });

    await page.getByPlaceholder(/seu@ifma.edu.br/i).fill(CREDENCIAIS.email);
    await page.getByPlaceholder(/sua senha/i).fill('novaSenha123');
    await page.getByRole('button', { name: /entrar/i }).click();
    await page.waitForURL('**/admin', { timeout: 10000 });

    await page.getByRole('link', { name: /alterar senha/i }).click();
    await page.waitForURL('**/alterar-senha', { timeout: 10000 });

    const inputsRestore = page.locator('input[type="password"]');
    await inputsRestore.first().fill('novaSenha123');
    await inputsRestore.nth(1).fill(CREDENCIAIS.senha);
    await inputsRestore.nth(2).fill(CREDENCIAIS.senha);
    await page.getByRole('button', { name: /alterar senha/i }).click();

    await page.waitForURL('**/login', { timeout: 15000 });
  });
});

test.describe('Protecao de rotas', () => {

  test('deve redirecionar rotas admin para /login sem autenticacao', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL('**/login', { timeout: 10000 });

    await page.goto('/admin/cardapios');
    await page.waitForURL('**/login', { timeout: 10000 });

    await page.goto('/admin/administradores');
    await page.waitForURL('**/login', { timeout: 10000 });
  });

  test('paginas publicas devem funcionar sem autenticacao', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');

    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
  });
});

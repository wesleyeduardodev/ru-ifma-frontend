import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CardapioList from './pages/CardapioList'
import CardapioForm from './pages/CardapioForm'
import AdminList from './pages/AdminList'
import AdminForm from './pages/AdminForm'

function App() {
  const location = useLocation()
  const isLogin = location.pathname === '/login'
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isAdmin && !isLogin && <Header />}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin/cardapios" element={<PrivateRoute><CardapioList /></PrivateRoute>} />
          <Route path="/admin/cardapios/novo" element={<PrivateRoute><CardapioForm /></PrivateRoute>} />
          <Route path="/admin/cardapios/:id/editar" element={<PrivateRoute><CardapioForm /></PrivateRoute>} />
          <Route path="/admin/administradores" element={<PrivateRoute><AdminList /></PrivateRoute>} />
          <Route path="/admin/administradores/novo" element={<PrivateRoute><AdminForm /></PrivateRoute>} />
          <Route path="/admin/administradores/:id/editar" element={<PrivateRoute><AdminForm /></PrivateRoute>} />
        </Routes>
      </main>
      {!isLogin && !isAdmin && <Footer />}
    </div>
  )
}

export default App

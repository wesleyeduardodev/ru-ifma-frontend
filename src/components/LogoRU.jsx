export default function LogoRU({ className = '' }) {
  return (
    <svg
      viewBox="0 0 96 96"
      className={className}
      role="img"
      aria-label="Logo do Restaurante Universitário"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="48" cy="48" r="46" fill="#00843D" />
      <circle cx="48" cy="48" r="37" fill="#F3FAF6" />
      <path
        d="M28 58h40c0 8-7 14-20 14s-20-6-20-14Z"
        fill="#D7EFE1"
        stroke="#00843D"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <path
        d="M34 55c0-8 6.5-14 14-14s14 6 14 14"
        fill="none"
        stroke="#00843D"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <circle cx="48" cy="39" r="2.3" fill="#00843D" />
      <path d="M23 38v19" stroke="#00843D" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M20 38v10" stroke="#00843D" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M26 38v10" stroke="#00843D" strokeWidth="2.1" strokeLinecap="round" />
      <path d="M74 38v12c0 3-2 5-5 5v2" stroke="#00843D" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

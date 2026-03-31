export default function LogoRoute({ size = 24 }: { size?: number }) {
  return (
    <svg 
      width={size * 2.5} /* Más ancho porque es texto */
      height={size} 
      viewBox="0 0 160 60" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 'N' Neural (Con Flecha de Ahorro) */}
      <path d="M10 50V10L30 35H40V50" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M30 35L40 25V35" fill="white"/> {/* Punta de flecha de la 'N' */}
      
      {/* 'R' Route (Conexión al Neural Node) */}
      <path d="M55 50V25C55 15 65 10 75 10H85V25H75C70 25 65 30 65 35V50" stroke="white" strokeWidth="6" strokeLinecap="round"/>
      <circle cx="85" cy="25" r="5" fill="#3b82f6"/> {/* El Neural Node en la 'R' */}
      
      {/* Texto Secundario (Opcional) */}
      <text x="100" y="35" fill="#71717a" fontSize="24" fontWeight="black" fontStyle="italic">.io</text>
    </svg>
  );
}

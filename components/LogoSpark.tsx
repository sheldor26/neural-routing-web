export default function LogoSpark({ size = 24 }: { size?: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-[0_0_15px_#3b82f640]"
    >
      {/* Círculo central (La Decisión) */}
      <circle cx="50" cy="50" r="10" fill="white"/>
      
      {/* Conexiones Neurales (Glow Effect) */}
      <circle cx="50" cy="50" r="15" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5 5"/>
      <circle cx="50" cy="50" r="25" stroke="#3b82f6" strokeWidth="1" opacity="0.5"/>

      {/* Nodos Periféricos (Los Modelos) */}
      <circle cx="20" cy="20" r="6" fill="#3f3f46"/> {/* Economy (Gray) */}
      <circle cx="80" cy="80" r="6" fill="#3f3f46"/>
      
      <circle cx="20" cy="80" r="6" fill="#3b82f6"/> {/* Premium (Blue) */}
      <circle cx="80" cy="20" r="6" fill="#3b82f6"/>

      {/* Líneas de Conexión */}
      <path d="M26 26 L42 42" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round"/>
      <path d="M74 74 L58 58" stroke="#3f3f46" strokeWidth="2" strokeLinecap="round"/>
      <path d="M26 74 L42 58" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
      <path d="M74 26 L58 42" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round"/>
    </svg>
  );
}

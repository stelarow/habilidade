/**
 * RobloxCharacter Component
 * Personagem estilo Roblox blocado/quadrado para o simulador
 */
const RobloxCharacter = ({ isDead = false, size = 80 }) => {
  const scale = size / 80; // Escala baseada no tamanho desejado

  return (
    <svg
      width={size}
      height={size * 1.25}
      viewBox="0 0 80 100"
      style={{
        filter: isDead ? 'none' : 'drop-shadow(0 4px 8px rgba(74, 144, 226, 0.5))'
      }}
    >
      {/* Cabeça */}
      <rect
        x="20"
        y="0"
        width="40"
        height="40"
        rx="2"
        fill={isDead ? "#4A5568" : "#4A90E2"}
        stroke="#1A202C"
        strokeWidth="2.5"
      />

      {/* Rosto - Olhos */}
      {isDead ? (
        // Olhos X quando morto
        <g>
          <line x1="28" y1="15" x2="36" y2="23" stroke="#E53E3E" strokeWidth="3" strokeLinecap="round"/>
          <line x1="36" y1="15" x2="28" y2="23" stroke="#E53E3E" strokeWidth="3" strokeLinecap="round"/>
          <line x1="44" y1="15" x2="52" y2="23" stroke="#E53E3E" strokeWidth="3" strokeLinecap="round"/>
          <line x1="52" y1="15" x2="44" y2="23" stroke="#E53E3E" strokeWidth="3" strokeLinecap="round"/>
        </g>
      ) : (
        // Olhos normais
        <g>
          <circle cx="32" cy="18" r="4" fill="#FFFFFF"/>
          <circle cx="32" cy="18" r="2" fill="#1A202C"/>
          <circle cx="48" cy="18" r="4" fill="#FFFFFF"/>
          <circle cx="48" cy="18" r="2" fill="#1A202C"/>
          {/* Boca sorrindo */}
          <path
            d="M 30 28 Q 40 32 50 28"
            stroke="#1A202C"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </g>
      )}

      {/* Corpo (torso) */}
      <rect
        x="15"
        y="44"
        width="50"
        height="35"
        rx="2"
        fill={isDead ? "#718096" : "#5BA3FF"}
        stroke="#1A202C"
        strokeWidth="2.5"
      />

      {/* Braço Esquerdo */}
      <rect
        x="7"
        y="46"
        width="10"
        height="28"
        rx="1"
        fill={isDead ? "#4A5568" : "#4A90E2"}
        stroke="#1A202C"
        strokeWidth="2"
      />

      {/* Braço Direito */}
      <rect
        x="63"
        y="46"
        width="10"
        height="28"
        rx="1"
        fill={isDead ? "#4A5568" : "#4A90E2"}
        stroke="#1A202C"
        strokeWidth="2"
      />

      {/* Perna Esquerda */}
      <rect
        x="22"
        y="82"
        width="14"
        height="18"
        rx="1"
        fill={isDead ? "#2D3748" : "#3A7BC8"}
        stroke="#1A202C"
        strokeWidth="2"
      />

      {/* Perna Direita */}
      <rect
        x="44"
        y="82"
        width="14"
        height="18"
        rx="1"
        fill={isDead ? "#2D3748" : "#3A7BC8"}
        stroke="#1A202C"
        strokeWidth="2"
      />

      {/* Detalhes do corpo (linha divisória) */}
      {!isDead && (
        <line
          x1="15"
          y1="61"
          x2="65"
          y2="61"
          stroke="#4A90E2"
          strokeWidth="1.5"
          opacity="0.5"
        />
      )}
    </svg>
  );
};

export default RobloxCharacter;

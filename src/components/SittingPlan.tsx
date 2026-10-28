interface SeatingPlanProps {
  assignedTable: number;
}

const tables = [
  // Lado izquierdo
  { number: 1, x: 105, y: 165, color: "#f7e7ce" },
  { number: 2, x: 265, y: 165, color: "#f7e7ce" },
  { number: 3, x: 102, y: 265, color: "#f7e7ce" },
  { number: 4, x: 265, y: 265, color: "#f7e7ce" },
  { number: 5, x: 108, y: 372, color: "#f7e7ce" },
  { number: 6, x: 263, y: 372, color: "#f7e7ce" },
  { number: 7, x: 108, y: 480, color: "#f7e7ce" },
  { number: 8, x: 263, y: 480, color: "#f7e7ce" },

  // Lado derecho
  { number: 9, x: 900, y: 130, color: "#f7e7ce" },
  { number: 10, x: 845, y: 220, color: "#f7e7ce" },
  { number: 11, x: 1005, y: 220, color: "#f7e7ce" },
  { number: 12, x: 845, y: 310, color: "#f7e7ce" },
  { number: 13, x: 1000, y: 310, color: "#f7e7ce" },
  { number: 14, x: 842, y: 400, color: "#f7e7ce" },
  { number: 15, x: 998, y: 402, color: "#f7e7ce" },
  { number: 16, x: 842, y: 493, color: "#f7e7ce" },
  { number: 17, x: 998, y: 493, color: "#f7e7ce" },
];

export default function SeatingPlan({ assignedTable }: SeatingPlanProps) {
  return (
    <div className="mt-8 w-full text-center">
      <p className="mb-2 text-gray-600">Ubicación de la mesa:</p>

      <div className="seating-plan mx-auto mt-4 w-full max-w-[1100px]">
        <div className="w-full overflow-x-auto overscroll-x-contain rounded-lg">
          <svg
            viewBox="0 0 1100 630"
            width="100%"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label={`Plano de mesas de boda. Tu mesa asignada es la ${assignedTable}.`}
          >
            {/* Salón */}
            <rect
              x="0"
              y="0"
              width="1100"
              height="620"
              fill="#FFFFFF"
              stroke="#111111"
              strokeWidth="1"
            />

            {/* Áreas superiores */}
            {[
              { x: 2, y: 2, w: 320, h: 56, label: "WC" },
              { x: 360, y: 2, w: 350, h: 58, label: "SONIDO" },
              { x: 755, y: 0, w: 92, h: 63, label: "PRIVADO" },
              { x: 872, y: 0, w: 208, h: 63, label: "COCINA" },
            ].map((area) => (
              <g key={area.label}>
                <rect
                  x={area.x}
                  y={area.y}
                  width={area.w}
                  height={area.h}
                  fill="#A8A8A8"
                  stroke="#777777"
                  strokeWidth="0.7"
                />
                <text
                  x={area.x + area.w / 2}
                  y={area.y + area.h / 2 + 5}
                  textAnchor="middle"
                  fontSize={area.label === "PRIVADO" ? 11 : 14}
                  fontWeight="bold"
                  fontFamily="Arial, sans-serif"
                  fill="#000000"
                >
                  {area.label}
                </text>
              </g>
            ))}

            {/* Pista de baile */}
            <rect
              x="375"
              y="128"
              width="325"
              height="280"
              fill="#FFFFFF"
              stroke="#111111"
              strokeWidth="1"
            />

            <text
              x="537.5"
              y="275"
              textAnchor="middle"
              fontSize="20"
              fontWeight="bold"
              fontFamily="Arial, sans-serif"
              fill="#000000"
            >
              PISTA DE BAILE
            </text>

            {/* Mesas de invitados */}
            {tables.map((table) => {
              const selected = table.number === assignedTable;

              return (
                <g key={table.number}>
                  {selected && (
                    <circle
                      cx={table.x}
                      cy={table.y}
                      r="43"
                      fill="none"
                      stroke="#D47958"
                      strokeWidth="4"
                      strokeDasharray="5 4"
                    />
                  )}

                  <ellipse
                    cx={table.x}
                    cy={table.y}
                    rx="43"
                    ry="39"
                    fill={selected ? "#D47958" : table.color}
                    stroke={selected ? "#A64E32" : "#111111"}
                    strokeWidth={selected ? 2 : 0.8}
                  />

                  <text
                    x={table.x}
                    y={table.y + 4}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fontFamily="Arial, sans-serif"
                    fill={selected ? "#FFFFFF" : "#000000"}
                  >
                    MESA {table.number}
                  </text>

                  {selected && (
                    <text
                      x={table.x}
                      y={table.y + 56}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#A64E32"
                    >
                      TU MESA
                    </text>
                  )}
                </g>
              );
            })}

            {/* Backdrop */}
            <rect
              x="430"
              y="480"
              width="200"
              height="28"
              fill="#FFFFFF"
              stroke="#111111"
              strokeWidth="0.8"
            />

            <text
              x="530"
              y="498"
              textAnchor="middle"
              fontSize="11"
              fontFamily="Arial, sans-serif"
            >
              Mesa principal
            </text>

            {/* Entrada */}
            <rect
              x="395"
              y="542"
              width="280"
              height="56"
              fill="#FFFFFF"
              stroke="#111111"
              strokeWidth="0.8"
            />

            <text
              x="535"
              y="576"
              textAnchor="middle"
              fontSize="19"
              fontFamily="Arial, sans-serif"
            >
              ENTRADA
            </text>

            
          </svg>
        </div>
      </div>
    </div>
  );
}

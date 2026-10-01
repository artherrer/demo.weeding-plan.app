const tables = [
  { number: 1, x: 100, y: 180 },
  { number: 2, x: 270, y: 180 },

  { number: 3, x: 100, y: 330 },
  { number: 4, x: 270, y: 330 },

  { number: 5, x: 100, y: 480 },
  { number: 6, x: 270, y: 480 },

  { number: 7, x: 100, y: 630 },
  { number: 8, x: 270, y: 630 },

  { number: 9, x: 780, y: 180 },
  { number: 10, x: 950, y: 180 },

  { number: 11, x: 780, y: 330 },
  { number: 12, x: 950, y: 330 },

  { number: 13, x: 780, y: 480 },
  { number: 14, x: 950, y: 480 },

  { number: 15, x: 780, y: 630 },
  { number: 16, x: 950, y: 630 },
];

interface SeatingPlanProps {
  assignedTable: number;
}

export default function SeatingPlan({ assignedTable }: SeatingPlanProps) {
  return (
    <div className="text-center mt-12">
      <p className="text-gray-600 mb-2">Ubicación de la mesa:</p>
      <div className="seating-plan w-full max-w-[1100px] mx-auto mt-12">
        <svg
          viewBox="0 0 1100 850"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Fondo */}
          <rect x="0" y="0" width="1100" height="850" fill="white" />

          {/* Cabina DJ */}
          <rect
            x="280"
            y="0"
            width="540"
            height="70"
            fill="white"
            stroke="black"
            strokeWidth="4"
          />

          <text
            x="550"
            y="43"
            textAnchor="middle"
            fontSize="26"
            fontFamily="Arial, sans-serif"
          >
            Cabina DJ
          </text>

          {/* WC */}
          <text
            x="970"
            y="43"
            textAnchor="middle"
            fontSize="28"
            fontFamily="Arial, sans-serif"
          >
            WC
          </text>

          {/* Pista de baile */}
          <rect
            x="390"
            y="285"
            width="320"
            height="300"
            fill="white"
            stroke="black"
            strokeWidth="4"
          />

          {/* Decoración de pista */}
          <text x="550" y="390" textAnchor="middle" fontSize="55">
            ♪ ♫ ♪
          </text>

          <text x="550" y="450" textAnchor="middle" fontSize="55">
            ♫ ♪
          </text>

          <text
            x="550"
            y="535"
            textAnchor="middle"
            fontSize="23"
            fontFamily="Arial, sans-serif"
          >
            Pista de baile
          </text>

          {/* Mesas */}
          {tables.map((table) => {
            const selected = table.number === assignedTable;

            return (
              <g key={table.number}>
                <circle
                  cx={table.x}
                  cy={table.y}
                  r="52"
                  fill={selected ? "#D47958" : "white"}
                  stroke={selected ? "#D47958" : "black"}
                  strokeWidth="4"
                />

                <text
                  x={table.x}
                  y={table.y + 8}
                  textAnchor="middle"
                  fontSize="20"
                  fontFamily="Arial, sans-serif"
                  fill={selected ? "white" : "black"}
                >
                  Mesa {table.number}
                </text>
              </g>
            );
          })}

          {/* Mesa de novios */}
          <rect
            x="300"
            y="730"
            width="500"
            height="80"
            fill="white"
            stroke="black"
            strokeWidth="4"
          />

          <text
            x="550"
            y="778"
            textAnchor="middle"
            fontSize="24"
            fontFamily="Arial, sans-serif"
          >
            Mesa novios
          </text>
        </svg>
      </div>
    </div>
  );
}

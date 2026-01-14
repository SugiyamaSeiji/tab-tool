import React from 'react';

type Props = {
  fingering: string; // 例: "x32010"
  position?: number; 
};

const ChordDiagram: React.FC<Props> = ({ fingering, position = 0 }) => {
  const fingers = fingering.split('');
  const numStrings = 6; // 弦の本数を定数化

  // SVGの設定
  const width = 140;
  const height = 100;
  const marginX = 30;
  const marginY = 15;
  const stringSpacing = 12;
  const fretSpacing = 22;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ border: '1px solid #eee', borderRadius: '4px', background: 'white' }}>
      
      {/* 1. ベースのネック（背景） */}
      <g>
        {/* 弦（横線） */}
        {[...Array(numStrings)].map((_, i) => (
          <line
            key={`string-${i}`}
            x1={marginX}
            y1={marginY + i * stringSpacing}
            x2={marginX + 4 * fretSpacing}
            y2={marginY + i * stringSpacing}
            stroke="black"
            strokeWidth={1}
          />
        ))}

        {/* フレット（縦線） */}
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`fret-${i}`}
            x1={marginX + i * fretSpacing}
            y1={marginY}
            x2={marginX + i * fretSpacing}
            y2={marginY + (numStrings - 1) * stringSpacing}
            stroke="black"
            strokeWidth={i === 0 && position <= 1 ? 4 : 1}
          />
        ))}
      </g>

      {/* 2. 指の位置 */}
      <g>
        {fingers.map((f, stringIndex) => {
          // 【変更点】インデックス0(6弦)が一番下に来るようにY座標を反転
          // 0番目(6弦) -> y位置は最大 (下)
          // 5番目(1弦) -> y位置は最小 (上)
          const y = marginY + (numStrings - 1 - stringIndex) * stringSpacing;
          
          // 'x' (ミュート)
          if (f.toLowerCase() === 'x') {
            return (
              <text key={stringIndex} x={marginX - 10} y={y + 4} textAnchor="middle" fontSize="12">
                ×
              </text>
            );
          }

          // '0' (開放弦)
          if (f === '0') {
            return (
              <circle
                key={stringIndex}
                cx={marginX - 10}
                cy={y}
                r={4}
                stroke="black"
                fill="white"
                strokeWidth={1}
              />
            );
          }

          // 数字 (押弦)
          const fret = parseInt(f, 10);
          if (!isNaN(fret) && fret > 0) {
            const x = marginX + (fret - 0.5) * fretSpacing;
            return (
              <circle
                key={stringIndex}
                cx={x}
                cy={y}
                r={5.5}
                fill="black"
              />
            );
          }
          return null;
        })}
      </g>
      
      {/* ポジション番号 */}
      {position > 0 && (
         <text x={marginX + (fretSpacing / 2)} y={marginY + 5 * stringSpacing + 15} fontSize="10" textAnchor="middle">
           {position}fr
         </text>
      )}
    </svg>
  );
};

export default ChordDiagram;
import React, { useState } from 'react';

interface ChartData {
  name: string;
  value: number;
}

interface PieChartProps {
  data: ChartData[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  const [hoveredSegment, setHoveredSegment] = useState<ChartData | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    '#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6366F1'
  ];

  // Calculate angles for each segment
  const segments = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const color = colors[index % colors.length];
    return { ...item, percentage, angle, color };
  });

  // Calculate cumulative angles for positioning
  let cumulativeAngle = 0;
  const segmentsWithPositions = segments.map(segment => {
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + segment.angle;
    cumulativeAngle += segment.angle;
    return { ...segment, startAngle, endAngle };
  });

  const createPath = (startAngle: number, endAngle: number, radius: number = 80) => {
    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = 100 + radius * Math.cos(startAngleRad);
    const y1 = 100 + radius * Math.sin(startAngleRad);
    const x2 = 100 + radius * Math.cos(endAngleRad);
    const y2 = 100 + radius * Math.sin(endAngleRad);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `M 100 100 L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
  };

  const handleMouseMove = (e: React.MouseEvent, segment: ChartData) => {
    setHoveredSegment(segment);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No data to display</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        {/* SVG Pie Chart */}
        <svg width="200" height="200" viewBox="0 0 200 200" className="mb-4">
          {segmentsWithPositions.map((segment, index) => (
            <path
              key={index}
              d={createPath(segment.startAngle, segment.endAngle)}
              fill={segment.color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-200 hover:brightness-110 cursor-pointer"
              style={{
                filter: hoveredSegment?.name === segment.name ? 'brightness(1.1)' : 'none',
                transform: hoveredSegment?.name === segment.name ? 'scale(1.05)' : 'scale(1)',
                transformOrigin: '100px 100px'
              }}
              onMouseMove={(e) => handleMouseMove(e, segment)}
              onMouseLeave={handleMouseLeave}
            />
          ))}
          
          {/* Center circle for donut effect (optional) */}
          <circle
            cx="100"
            cy="100"
            r="30"
            fill="white"
            stroke="#E5E7EB"
            strokeWidth="2"
          />
          
          {/* Center text */}
          <text
            x="100"
            y="100"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-semibold fill-gray-700"
          >
            Total
          </text>
          <text
            x="100"
            y="115"
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-gray-500"
          >
            ${total.toLocaleString('en-US', { minimumFractionDigits: 0 })}
          </text>
        </svg>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
          {segmentsWithPositions.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <span className="text-xs text-gray-600 capitalize truncate">
                {segment.name}
              </span>
              <span className="text-xs text-gray-500 ml-auto">
                {segment.percentage > 0.01 ? `${(segment.percentage * 100).toFixed(1)}%` : '<1%'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredSegment && (
        <div
          className="fixed z-50 bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{
            left: mousePosition.x,
            top: mousePosition.y - 10,
          }}
        >
          <div className="text-sm font-medium capitalize">{hoveredSegment.name}</div>
          <div className="text-xs">
            ${hoveredSegment.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PieChart;
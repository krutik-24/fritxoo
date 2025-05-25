"use client"

interface ChartData {
  label: string
  value: number
  color?: string
}

interface SimpleChartProps {
  data: ChartData[]
  type: "bar" | "line"
  title?: string
  height?: number
}

export function SimpleChart({ data, type, title, height = 200 }: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value))
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4", "#84cc16", "#f97316"]

  if (type === "bar") {
    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="flex items-end justify-between gap-2" style={{ height }}>
          {data.map((item, index) => (
            <div key={item.label} className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${(item.value / maxValue) * (height - 40)}px`,
                  backgroundColor: item.color || colors[index % colors.length],
                  minHeight: item.value > 0 ? "4px" : "0px",
                }}
                title={`${item.label}: ${item.value}`}
              />
              <span className="text-xs mt-2 text-center truncate w-full" title={item.label}>
                {item.label}
              </span>
              <span className="text-xs text-gray-500">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "line") {
    const width = 400
    const chartHeight = height - 60
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * width
        const y = chartHeight - (item.value / maxValue) * chartHeight
        return `${x},${y}`
      })
      .join(" ")

    return (
      <div className="w-full">
        {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
        <div className="relative">
          <svg width={width} height={height} className="border rounded">
            <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points={points} />
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * width
              const y = chartHeight - (item.value / maxValue) * chartHeight
              return <circle key={index} cx={x} cy={y} r="4" fill="#3b82f6" title={`${item.label}: ${item.value}`} />
            })}
          </svg>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {data.map((item, index) => (
              <span key={index} className="truncate" title={item.label}>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return null
}

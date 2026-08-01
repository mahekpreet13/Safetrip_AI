import { Map, TrendingUp } from 'lucide-react'

export default function RouteRiskVisualizer() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Map className="text-blue-600" size={20} />
        <h2 className="font-semibold text-gray-800">Route & Risk Visualizer</h2>
      </div>

      {/* Placeholder for the real Leaflet map — added in a later frontend task */}
      <div className="border border-dashed border-gray-300 rounded-lg bg-gray-50 h-48 flex flex-col items-center justify-center text-gray-400 text-sm">
        <span>Interactive map (Leaflet) will render here</span>
        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" /> Start
          </span>
          —
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Safe Detour
          </span>
          —
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-800 inline-block" /> End
          </span>
        </div>
        <span className="text-xs text-gray-400 mt-1">(Avoids high-risk sector)</span>
      </div>

      <div className="flex items-center gap-2 mt-6 mb-2">
        <TrendingUp className="text-blue-600" size={18} />
        <h3 className="text-sm font-semibold text-gray-700">Crime Distribution by Time</h3>
      </div>

      {/* Placeholder for the real Chart.js chart — added in a later frontend task */}
      <div className="border border-dashed border-gray-300 rounded-lg bg-gray-50 h-32 flex items-center justify-center text-gray-400 text-sm">
        Chart: Nighttime vs Daytime Incidents
      </div>
    </div>
  )
}
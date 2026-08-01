import { Zap, ShieldCheck, ArrowRight } from 'lucide-react'

const riskColor = {
  Low: 'text-safe bg-safe/10',
  Medium: 'text-caution bg-caution/10',
  High: 'text-alert bg-alert/10',
}

function RouteStat({ label, icon: Icon, color, distance_km, risk_score, risk_level, crime_count, recommended }) {
  return (
    <div
      className={`relative rounded-xl border p-4 ${
        recommended ? 'border-safe/40 bg-safe/5' : 'border-gray-200 bg-white'
      }`}
    >
      {recommended && (
        <span className="absolute -top-2.5 left-4 bg-safe text-white text-[10px] font-mono uppercase tracking-wide px-2 py-0.5 rounded-full">
          Recommended
        </span>
      )}
      <div className="flex items-center gap-2 mb-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        <Icon size={15} className="text-gray-500" />
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>
      <p className="text-2xl font-display font-medium text-gray-800">{distance_km.toFixed(1)} km</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${riskColor[risk_level] || riskColor.Medium}`}>
          RISK {Math.round(risk_score)}
        </span>
        <span className="text-xs text-gray-400">{crime_count} incidents nearby</span>
      </div>
    </div>
  )
}

export default function RouteComparisonCard({ fastRoute, safeRoute, riskDifference }) {
  if (!fastRoute || !safeRoute) return null

  const safeIsBetter = safeRoute.risk_score < fastRoute.risk_score

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <RouteStat label="Fastest Route" icon={Zap} color="#E8A33D" {...fastRoute} recommended={!safeIsBetter} />
        <RouteStat label="Safer Route" icon={ShieldCheck} color="#3E8E6E" {...safeRoute} recommended={safeIsBetter} />
      </div>
      {safeIsBetter && riskDifference > 0 && (
        <p className="text-xs text-gray-500 mt-4 flex items-center gap-1.5">
          <ArrowRight size={12} />
          The safer route reduces risk by {riskDifference.toFixed(1)} points by avoiding higher-crime areas.
        </p>
      )}
    </div>
  )
}
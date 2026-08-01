import { FileText, Clock, AlertTriangle, Download, Moon, ShieldCheck, ShieldAlert, ShieldX, Bookmark, BookmarkCheck } from 'lucide-react'

const riskConfig = {
  Low: {
    badge: 'bg-green-100 text-green-700',
    ring: 'stroke-green-500',
    border: 'border-l-green-400',
    icon: ShieldCheck,
    iconColor: 'text-green-600',
  },
  Medium: {
    badge: 'bg-yellow-100 text-yellow-700',
    ring: 'stroke-yellow-500',
    border: 'border-l-yellow-400',
    icon: ShieldAlert,
    iconColor: 'text-yellow-600',
  },
  High: {
    badge: 'bg-red-100 text-red-700',
    ring: 'stroke-red-500',
    border: 'border-l-red-400',
    icon: ShieldX,
    iconColor: 'text-red-600',
  },
}

function RiskGauge({ score, level }) {
  const config = riskConfig[level] || riskConfig.Medium
  const radius = 30
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(Math.max(score, 0), 100) / 100
  const offset = circumference - progress * circumference
  const Icon = config.icon

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={radius} strokeWidth="6" className="stroke-gray-100" fill="none" />
        <circle
          cx="36"
          cy="36"
          r={radius}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          className={`${config.ring} transition-all duration-700`}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Icon size={16} className={config.iconColor} />
        <span className="text-xs font-bold text-gray-700 mt-0.5">{Math.round(score)}</span>
      </div>
    </div>
  )
}

export default function ItineraryDayCard({ city, summary, aiNote, loading, timeAdvisory, onExport, onSave, isSaved }) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-72 animate-pulse" />
    )
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center text-center h-72">
        <div className="bg-blue-50 text-blue-500 p-3 rounded-full mb-3">
          <FileText size={22} />
        </div>
        <p className="text-sm text-gray-500 max-w-xs">
          Search a destination above to generate a safety-aware itinerary preview.
        </p>
      </div>
    )
  }

  const riskLevel = summary.risk_level || 'Medium'
  const config = riskConfig[riskLevel] || riskConfig.Medium

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${config.border} shadow-sm p-6`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
            <FileText size={18} />
          </div>
          <h2 className="font-semibold text-gray-800">Itinerary & Safety Brief</h2>
        </div>
        <button
          onClick={onSave}
          title={isSaved ? 'Saved' : 'Save this plan'}
          className={`p-2 rounded-lg transition ${isSaved ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
        >
          {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>
      </div>

      <div className="flex items-start gap-4">
        <RiskGauge score={summary.risk_score} level={riskLevel} />

        <div className="flex-1">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Day 1</p>
          <div className="flex items-center justify-between mt-0.5">
            <h3 className="text-lg font-bold text-gray-800">{city}</h3>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.badge}`}>
              {riskLevel} Risk
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
            <Clock size={12} />
            Full day itinerary
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        <div className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-100 text-amber-800 rounded-lg p-3">
          <AlertTriangle size={14} className="mt-0.5 shrink-0" />
          <span>
            {aiNote || `Overall risk score is ${summary.risk_score}/100. Most common reported incident: ${summary.most_common_crime || 'N/A'}.`}
          </span>
        </div>

        {timeAdvisory && (
          <div className="flex items-start gap-2 text-xs bg-slate-50 border border-slate-100 text-slate-600 rounded-lg p-3">
            <Moon size={14} className="mt-0.5 shrink-0" />
            <span>{timeAdvisory}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={onExport}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3 rounded-xl shadow-sm transition"
        >
          <Download size={16} />
          Export PDF
        </button>
        <button
          onClick={onSave}
          className={`flex items-center justify-center gap-2 text-sm font-semibold py-3 px-4 rounded-xl border transition ${
            isSaved
              ? 'border-blue-200 bg-blue-50 text-blue-600'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
        </button>
      </div>
    </div>
  )
}
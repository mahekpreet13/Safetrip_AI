import { ShieldAlert, ListOrdered, Clock, AlertCircle } from 'lucide-react'

const riskStyles = {
  Low: { bg: 'bg-green-50', text: 'text-green-600', ring: 'ring-green-100' },
  Medium: { bg: 'bg-yellow-50', text: 'text-yellow-600', ring: 'ring-yellow-100' },
  High: { bg: 'bg-red-50', text: 'text-red-600', ring: 'ring-red-100' },
}

function Card({ icon, label, value, accentBg, accentText, ring }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ring-4 ${accentBg} ${accentText} ${ring || 'ring-blue-50'}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-800 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

export default function DashboardCards({ data }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-20 animate-pulse" />
        ))}
      </div>
    )
  }

  const peakHourDisplay =
    data.peak_hour === null || data.peak_hour === undefined ? 'N/A' : `${data.peak_hour}:00`

  const risk = riskStyles[data.risk_level] || riskStyles.Medium

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card
        icon={<ShieldAlert size={20} />}
        label="Risk Score"
        value={`${data.risk_score} (${data.risk_level})`}
        accentBg={risk.bg}
        accentText={risk.text}
        ring={risk.ring}
      />
      <Card
        icon={<ListOrdered size={20} />}
        label="Crime Count"
        value={data.crime_count}
        accentBg="bg-blue-50"
        accentText="text-blue-600"
        ring="ring-blue-50"
      />
      <Card
        icon={<Clock size={20} />}
        label="Peak Time"
        value={peakHourDisplay}
        accentBg="bg-purple-50"
        accentText="text-purple-600"
        ring="ring-purple-50"
      />
      <Card
        icon={<AlertCircle size={20} />}
        label="Most Common Crime"
        value={data.most_common_crime || 'N/A'}
        accentBg="bg-orange-50"
        accentText="text-orange-600"
        ring="ring-orange-50"
      />
    </div>
  )
}
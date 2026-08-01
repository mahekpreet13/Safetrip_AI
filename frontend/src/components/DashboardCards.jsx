import { ShieldAlert, ListOrdered, Clock, AlertCircle } from 'lucide-react'

const riskStyles = {
  Low: { bg: 'bg-safe/10', text: 'text-safe' },
  Medium: { bg: 'bg-caution/10', text: 'text-caution' },
  High: { bg: 'bg-alert/10', text: 'text-alert' },
}

function Card({ icon, label, value, accentBg, accentText }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`p-3 rounded-xl ${accentBg} ${accentText}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-gray-400 font-mono uppercase tracking-widest">{label}</p>
        <p className="text-lg font-display font-medium text-gray-800 mt-0.5">{value}</p>
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
      />
      <Card
        icon={<ListOrdered size={20} />}
        label="Crime Count"
        value={data.crime_count}
        accentBg="bg-ink/5"
        accentText="text-ink"
      />
      <Card
        icon={<Clock size={20} />}
        label="Peak Time"
        value={peakHourDisplay}
        accentBg="bg-signal/10"
        accentText="text-signal-dark"
      />
      <Card
        icon={<AlertCircle size={20} />}
        label="Most Common Crime"
        value={data.most_common_crime || 'N/A'}
        accentBg="bg-ink/5"
        accentText="text-ink"
      />
    </div>
  )
}
import { ShieldHalf, Navigation2 } from 'lucide-react'

export default function PoliceStationList({ stations, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 h-16 animate-pulse" />
        ))}
      </div>
    )
  }

  if (!stations || stations.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
        <div className="bg-ink/5 text-ink/40 p-3 rounded-full inline-flex mb-3">
          <ShieldHalf size={20} />
        </div>
        <p className="text-sm text-gray-500">
          No police station data available for this area yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {stations.map((station, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <div className="bg-ink/5 text-ink p-2.5 rounded-lg">
              <ShieldHalf size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{station.name}</p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                {station.latitude.toFixed(4)}°N {station.longitude.toFixed(4)}°E
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-signal-dark font-mono text-sm font-medium shrink-0">
            <Navigation2 size={13} />
            {station.distance_km.toFixed(1)} km
          </div>
        </div>
      ))}
    </div>
  )
}
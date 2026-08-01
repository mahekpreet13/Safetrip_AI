import { useNavigate } from 'react-router-dom'
import { Bookmark, Trash2, ArrowRight, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'
import { useSavedPlans } from '../hooks/useSavedPlans.js'

const riskConfig = {
  Low: { badge: 'bg-green-100 text-green-700', icon: ShieldCheck, iconColor: 'text-green-600' },
  Medium: { badge: 'bg-yellow-100 text-yellow-700', icon: ShieldAlert, iconColor: 'text-yellow-600' },
  High: { badge: 'bg-red-100 text-red-700', icon: ShieldX, iconColor: 'text-red-600' },
}

export default function SavedPlans() {
  const { savedPlans, removePlan } = useSavedPlans()
  const navigate = useNavigate()

  return (
    <div className="min-h-full">
      <div className="bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-700 text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-14">
          <div className="flex items-center gap-2 text-violet-100 text-xs font-medium mb-3 uppercase tracking-wide">
            <Bookmark size={14} />
            Your Trips
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Saved Plans</h1>
          <p className="text-violet-100 mt-2 text-sm md:text-base max-w-xl">
            Itineraries you've saved for later — revisit their safety brief anytime.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-8 pb-10">
        {savedPlans.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 flex flex-col items-center text-center">
            <div className="bg-violet-50 text-violet-500 p-4 rounded-full mb-4">
              <Bookmark size={24} />
            </div>
            <h3 className="font-semibold text-gray-800">No saved plans yet</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              Search a destination on the Itineraries page and tap the bookmark icon to save it here.
            </p>
            <button
              onClick={() => navigate('/', { state: { focusSearch: true } })}
              className="mt-5 flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition"
            >
              Plan a Trip
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {savedPlans.map((plan) => {
              const config = riskConfig[plan.riskLevel] || riskConfig.Medium
              const Icon = config.icon
              return (
                <div
                  key={plan.city}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg bg-gray-50 ${config.iconColor}`}>
                        <Icon size={16} />
                      </div>
                      <h3 className="font-bold text-gray-800">{plan.city}</h3>
                    </div>
                    <button
                      onClick={() => removePlan(plan.city)}
                      className="text-gray-300 hover:text-red-500 transition p-1"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${config.badge}`}>
                      {plan.riskLevel} Risk ({plan.riskScore})
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    {plan.crimeCount} reported crimes · Most common: {plan.mostCommonCrime || 'N/A'}
                  </p>

                  <p className="text-xs text-gray-300 mt-2">
                    Saved {new Date(plan.savedAt).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => navigate(`/?city=${encodeURIComponent(plan.city)}`)}
                    className="mt-4 w-full flex items-center justify-center gap-1.5 text-sm font-medium text-violet-600 hover:bg-violet-50 py-2 rounded-lg transition"
                  >
                    View Full Brief
                    <ArrowRight size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
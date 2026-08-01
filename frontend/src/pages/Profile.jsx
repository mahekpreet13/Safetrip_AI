import { User, Shield, Database, Info } from 'lucide-react'
import { useSavedPlans } from '../hooks/useSavedPlans.js'
import { useRecentSearches } from '../hooks/useRecentSearches.js'

export default function Profile() {
  const { savedPlans } = useSavedPlans()
  const { recentSearches } = useRecentSearches()

  return (
    <div className="min-h-full">
      <div className="bg-gradient-to-br from-rose-700 via-pink-600 to-orange-600 text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-14">
          <div className="flex items-center gap-2 text-rose-100 text-xs font-medium mb-3 uppercase tracking-wide">
            <User size={14} />
            Your Account
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Profile</h1>
          <p className="text-rose-100 mt-2 text-sm md:text-base max-w-xl">
            SafeTrip AI is currently open-access — no account required to plan safer trips.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-8 pb-10 space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Saved Plans</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{savedPlans.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Recent Searches</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{recentSearches.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-rose-50 text-rose-600 p-2 rounded-lg">
              <Database size={18} />
            </div>
            <h2 className="font-semibold text-gray-800">About Your Data</h2>
          </div>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-rose-400 mt-0.5">•</span>
              Saved plans and recent searches are stored locally in your browser only — not sent to any server or account.
            </li>
            <li className="flex gap-2">
              <span className="text-rose-400 mt-0.5">•</span>
              Location searches use OpenStreetMap's free geocoding service.
            </li>
            <li className="flex gap-2">
              <span className="text-rose-400 mt-0.5">•</span>
              Some cities show real, government-sourced crime data; others use sample/demo data for illustration. This is labeled in each API response.
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-rose-50 text-rose-600 p-2 rounded-lg">
              <Info size={18} />
            </div>
            <h2 className="font-semibold text-gray-800">About SafeTrip AI</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            SafeTrip AI combines AI-generated travel itineraries with real crime data, interactive
            heatmaps, and safety scoring — built to help travelers make more informed decisions
            about where and when to explore.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <Shield size={13} />
            Built with React, FastAPI, PostgreSQL & OpenStreetMap
          </div>
        </div>
      </div>
    </div>
  )
}
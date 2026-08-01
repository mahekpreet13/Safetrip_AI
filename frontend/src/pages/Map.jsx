import { useState } from 'react'
import { Search, Compass } from 'lucide-react'
import CrimeMap from '../components/CrimeMap.jsx'
import { searchLocation, fetchHeatmap } from '../services/api.js'

export default function MapPage() {
  const [query, setQuery] = useState('')
  const [center, setCenter] = useState(null)
  const [markers, setMarkers] = useState([])
  const [heatmapPoints, setHeatmapPoints] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)

    try {
      const result = await searchLocation(trimmed)
      setCenter([result.latitude, result.longitude])

      const crimeMarkers = (result.nearby_crimes || []).map((crime) => ({
        lat: result.latitude,
        lng: result.longitude,
        crime_type: crime.crime_type,
        description: `${crime.severity} severity — ${crime.date}`,
      }))
      setMarkers(crimeMarkers)

      try {
        const heatData = await fetchHeatmap(result.matched_city || trimmed)
        setHeatmapPoints(heatData)
      } catch {
        setHeatmapPoints([])
      }
    } catch (err) {
      setError(err.message || 'Could not find that location.')
      setMarkers([])
      setHeatmapPoints([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full">
      <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-black text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-14">
          <div className="flex items-center gap-2 text-slate-300 text-xs font-medium mb-3 uppercase tracking-wide">
            <Compass size={14} />
            Live Crime Density
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Map Explorer</h1>
          <p className="text-slate-300 mt-2 text-sm md:text-base max-w-xl">
            Explore real crime hotspots and location markers on an interactive heatmap.
          </p>

          <form onSubmit={handleSearch} className="flex gap-3 mt-6 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a location to view on the map"
                className="w-full pl-11 pr-4 py-3.5 rounded-full text-sm text-gray-800 shadow-lg focus:outline-none focus:ring-4 focus:ring-slate-400/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-800 text-sm font-semibold px-7 py-3.5 rounded-full shadow-lg transition"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-8 pb-10 space-y-6">
        {error && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            {error}
          </p>
        )}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <CrimeMap center={center} markers={markers} heatmapPoints={heatmapPoints} />
        </div>
      </div>
    </div>
  )
}
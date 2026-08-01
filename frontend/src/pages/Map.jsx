import { useState } from 'react'
import { Search, Compass, Navigation, Route as RouteIcon, ShieldHalf } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import CrimeMap from '../components/CrimeMap.jsx'
import RouteComparisonCard from '../components/RouteComparisonCard.jsx'
import PoliceStationList from '../components/PoliceStationList.jsx'
import { searchLocation, fetchHeatmap, fetchSafeRoute, fetchPoliceStations } from '../services/api.js'

export default function MapPage() {
  const [mode, setMode] = useState('explore') // 'explore' | 'route' | 'nearby'

  // Explore mode state
  const [query, setQuery] = useState('')
  const [center, setCenter] = useState(null)
  const [markers, setMarkers] = useState([])
  const [heatmapPoints, setHeatmapPoints] = useState([])

  // Route mode state
  const [startInput, setStartInput] = useState('')
  const [destinationInput, setDestinationInput] = useState('')
  const [routeData, setRouteData] = useState(null)
  const [routeLines, setRouteLines] = useState([])

  // Nearby (police stations) mode state
  const [nearbyQuery, setNearbyQuery] = useState('')
  const [nearbyCenter, setNearbyCenter] = useState(null)
  const [stations, setStations] = useState([])
  const [stationMarkers, setStationMarkers] = useState([])

  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleExploreSearch = async (e) => {
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

  const handleRouteSearch = async (e) => {
    e.preventDefault()
    const start = startInput.trim()
    const destination = destinationInput.trim()
    if (!start || !destination) return

    setLoading(true)
    setError(null)
    setRouteData(null)
    setRouteLines([])

    try {
      const result = await fetchSafeRoute(start, destination)
      setRouteData(result)
      setRouteLines([
        { points: result.fast_route.points, color: '#E8A33D' },
        { points: result.safe_route.points, color: '#3E8E6E' },
      ])
    } catch (err) {
      setError(err.message || 'Could not calculate a route between these locations.')
    } finally {
      setLoading(false)
    }
  }

  const handleNearbySearch = async (e) => {
    e.preventDefault()
    const trimmed = nearbyQuery.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setStations([])
    setStationMarkers([])

    try {
      const result = await searchLocation(trimmed)
      setNearbyCenter([result.latitude, result.longitude])

      const stationData = await fetchPoliceStations(result.latitude, result.longitude)
      setStations(stationData)
      setStationMarkers(
        stationData.map((s) => ({
          lat: s.latitude,
          lng: s.longitude,
          label: s.name,
          description: `${s.distance_km.toFixed(1)} km away`,
        }))
      )
    } catch (err) {
      setError(err.message || 'Could not find that location.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-full">
      <PageHero
        eyebrow="Live Crime Density & Routing"
        eyebrowIcon={Compass}
        title="Map Explorer."
        description="Explore crime hotspots, compare a fast route against a safer one, or find nearby police stations."
      >
        <div className="flex gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setMode('explore')}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition ${
              mode === 'explore' ? 'bg-signal text-ink' : 'bg-white/10 text-paper/80 hover:bg-white/15'
            }`}
          >
            <Compass size={15} />
            Explore
          </button>
          <button
            onClick={() => setMode('route')}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition ${
              mode === 'route' ? 'bg-signal text-ink' : 'bg-white/10 text-paper/80 hover:bg-white/15'
            }`}
          >
            <RouteIcon size={15} />
            Safe Route
          </button>
          <button
            onClick={() => setMode('nearby')}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition ${
              mode === 'nearby' ? 'bg-signal text-ink' : 'bg-white/10 text-paper/80 hover:bg-white/15'
            }`}
          >
            <ShieldHalf size={15} />
            Nearby Police
          </button>
        </div>

        {mode === 'explore' && (
          <form onSubmit={handleExploreSearch} className="flex gap-3 mt-4 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a location to view on the map"
                className="w-full pl-11 pr-4 py-3.5 rounded-lg text-sm bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-4 focus:ring-signal/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-signal hover:bg-signal-dark disabled:opacity-60 text-ink text-sm font-semibold px-7 py-3.5 rounded-lg transition"
            >
              {loading ? 'Loading...' : 'Search'}
            </button>
          </form>
        )}

        {mode === 'route' && (
          <form onSubmit={handleRouteSearch} className="flex flex-col sm:flex-row gap-3 mt-4 max-w-3xl">
            <div className="flex-1 relative">
              <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={startInput}
                onChange={(e) => setStartInput(e.target.value)}
                placeholder="Start location"
                className="w-full pl-11 pr-4 py-3.5 rounded-lg text-sm bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-4 focus:ring-signal/30"
              />
            </div>
            <div className="flex-1 relative">
              <RouteIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder="Destination"
                className="w-full pl-11 pr-4 py-3.5 rounded-lg text-sm bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-4 focus:ring-signal/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-signal hover:bg-signal-dark disabled:opacity-60 text-ink text-sm font-semibold px-7 py-3.5 rounded-lg transition whitespace-nowrap"
            >
              {loading ? 'Calculating...' : 'Find Safe Route'}
            </button>
          </form>
        )}

        {mode === 'nearby' && (
          <form onSubmit={handleNearbySearch} className="flex gap-3 mt-4 max-w-2xl">
            <div className="flex-1 relative">
              <ShieldHalf className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                value={nearbyQuery}
                onChange={(e) => setNearbyQuery(e.target.value)}
                placeholder="Find police stations near a location"
                className="w-full pl-11 pr-4 py-3.5 rounded-lg text-sm bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-4 focus:ring-signal/30"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-signal hover:bg-signal-dark disabled:opacity-60 text-ink text-sm font-semibold px-7 py-3.5 rounded-lg transition whitespace-nowrap"
            >
              {loading ? 'Searching...' : 'Find Nearby'}
            </button>
          </form>
        )}
      </PageHero>

      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-8 pb-10 space-y-6">
        {error && (
          <p className="text-sm text-alert bg-alert/5 border border-alert/20 rounded-xl p-4">
            {error}
          </p>
        )}

        {mode === 'route' && routeData && (
          <RouteComparisonCard
            fastRoute={routeData.fast_route}
            safeRoute={routeData.safe_route}
            riskDifference={routeData.risk_difference}
          />
        )}

        <div className={mode === 'nearby' ? 'grid md:grid-cols-3 gap-6' : ''}>
          <div className={mode === 'nearby' ? 'md:col-span-2' : ''}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <CrimeMap
                center={mode === 'nearby' ? nearbyCenter : center}
                markers={mode === 'explore' ? markers : mode === 'nearby' ? stationMarkers : []}
                heatmapPoints={mode === 'explore' ? heatmapPoints : []}
                routes={mode === 'route' ? routeLines : []}
              />
            </div>
          </div>

          {mode === 'nearby' && (
            <div>
              <PoliceStationList stations={stations} loading={loading} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
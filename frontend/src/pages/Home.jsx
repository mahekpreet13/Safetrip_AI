import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { Search, Map as MapIcon, TrendingUp, Link as LinkIcon, Check, Sparkles } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
import CrimeMap from '../components/CrimeMap.jsx'
import ItineraryDayCard from '../components/ItineraryDayCard.jsx'
import NightDayChart from '../components/NightDayChart.jsx'
import { searchLocation, fetchCrimeSummary, fetchCrimeTrends, fetchAiSummary } from '../services/api.js'
import { getTimeAdvisory } from '../utils/timeAdvisory.js'
import { exportSafetyPlan } from '../utils/exportPdf.js'
import { useSavedPlans } from '../hooks/useSavedPlans.js'

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const searchInputRef = useRef(null)

  const [query, setQuery] = useState(searchParams.get('city') || '')
  const [city, setCity] = useState(null)
  const [center, setCenter] = useState(null)
  const [markers, setMarkers] = useState([])
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [aiNote, setAiNote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)
  const [highlightSearch, setHighlightSearch] = useState(false)

  const { savePlan, isPlanSaved } = useSavedPlans()

  const runSearch = async (searchQuery) => {
    const trimmed = searchQuery.trim()
    if (!trimmed) return

    setLoading(true)
    setError(null)
    setAiNote(null)

    try {
      const result = await searchLocation(trimmed)
      const matchedCity = result.matched_city || trimmed
      setCity(matchedCity)
      setCenter([result.latitude, result.longitude])
      setMarkers(
        (result.nearby_crimes || []).map((c) => ({
          lat: result.latitude,
          lng: result.longitude,
          crime_type: c.crime_type,
          description: `${c.severity} severity — ${c.date}`,
        }))
      )

      // Update the URL so this result can be shared with a direct link
      setSearchParams({ city: matchedCity })

      const [summaryData, trendsData] = await Promise.all([
        fetchCrimeSummary(matchedCity).catch(() => null),
        fetchCrimeTrends(matchedCity).catch(() => null),
      ])
      setSummary(summaryData)
      setTrends(trendsData)

      try {
        const ai = await fetchAiSummary(matchedCity)
        setAiNote(ai.summary || ai.note || null)
      } catch {
        setAiNote(null)
      }
    } catch (err) {
      setError(err.message || 'Could not find that destination.')
      setSummary(null)
      setTrends(null)
    } finally {
      setLoading(false)
    }
  }

  // On first load, if the URL already has ?city=..., run that search
  // automatically — this is what makes a shared link actually work
  useEffect(() => {
    const cityParam = searchParams.get('city')
    if (cityParam) {
      runSearch(cityParam)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // If we arrived here via the "Plan a Trip" button from Saved Plans,
  // focus the search bar and briefly highlight it so it's obvious
  // something happened, instead of landing on a page that looks inert.
  useEffect(() => {
    if (location.state?.focusSearch) {
      searchInputRef.current?.focus()
      setHighlightSearch(true)
      const timer = setTimeout(() => setHighlightSearch(false), 1500)
      window.history.replaceState({}, document.title)
      return () => clearTimeout(timer)
    }
  }, [location.state])

  const handleSubmit = (e) => {
    e.preventDefault()
    runSearch(query)
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can fail in some browsers/contexts — fail silently,
      // the URL itself is still shareable by copying from the address bar
    }
  }

  const timeAdvisory = getTimeAdvisory(trends)

  const handleExport = () => {
    exportSafetyPlan({ city, summary, aiNote, timeAdvisory })
  }

  const handleSave = () => {
    if (!city || !summary) return
    savePlan({
      city,
      center,
      riskScore: summary.risk_score,
      riskLevel: summary.risk_level,
      crimeCount: summary.crime_count,
      mostCommonCrime: summary.most_common_crime,
      aiNote,
    })
  }

  return (
    <div className="min-h-full">
      <PageHero
        eyebrow="AI-Powered Trip Safety"
        eyebrowIcon={Sparkles}
        title="Plan your trip, safely."
        description="Search any destination for a real-time safety breakdown, risk-aware itinerary notes, and an interactive crime map — before you go."
        coords={center ? `${center[0].toFixed(4)}°N ${center[1].toFixed(4)}°E — LIVE` : '— SEARCH TO LOCK COORDINATES —'}
      >
        <form onSubmit={handleSubmit} className="flex gap-3 mt-6 max-w-2xl">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={18} />
            <input
              ref={searchInputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where are you headed? (e.g. Delhi, Chicago)"
              className={`w-full pl-11 pr-4 py-3.5 rounded-lg text-sm bg-paper text-ink placeholder-ink/40 focus:outline-none focus:ring-4 focus:ring-signal/30 transition-all ${
                highlightSearch ? 'ring-4 ring-signal' : ''
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-signal hover:bg-signal-dark disabled:opacity-60 text-ink text-sm font-semibold px-7 py-3.5 rounded-lg transition"
          >
            {loading ? 'Searching...' : 'Plan Trip'}
          </button>
        </form>
      </PageHero>

      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-8 pb-10 space-y-6">
        {error && (
          <p className="text-sm text-alert bg-alert/5 border border-alert/20 rounded-xl p-4">
            {error}
          </p>
        )}

        {city && (
          <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3">
            <h2 className="text-base font-semibold text-gray-700 font-display">
              Results for <span className="text-ink">{city}</span>
            </h2>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-ink border border-gray-300 rounded-full px-3 py-1.5 transition font-mono"
            >
              {copied ? <Check size={13} className="text-safe" /> : <LinkIcon size={13} />}
              {copied ? 'LINK COPIED' : 'SHARE REPORT'}
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <ItineraryDayCard
            city={city}
            summary={summary}
            aiNote={aiNote}
            loading={loading}
            timeAdvisory={timeAdvisory}
            onExport={handleExport}
            onSave={handleSave}
            isSaved={isPlanSaved(city)}
          />

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-ink/5 text-ink p-2 rounded-lg">
                <MapIcon size={18} />
              </div>
              <h2 className="font-semibold text-gray-800 font-display">Route & Risk Visualizer</h2>
            </div>
            <CrimeMap center={center} markers={markers} />

            <div className="flex items-center gap-2 mt-6 mb-3">
              <div className="bg-ink/5 text-ink p-2 rounded-lg">
                <TrendingUp size={16} />
              </div>
              <h3 className="text-sm font-semibold text-gray-700 font-display">Crime Distribution by Time</h3>
            </div>
            <NightDayChart trends={trends} />
          </div>
        </div>
      </div>
    </div>
  )
}
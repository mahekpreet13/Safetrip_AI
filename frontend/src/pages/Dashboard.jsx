import { useState } from 'react'
import { ShieldCheck, Sparkles } from 'lucide-react'
import SearchBar from '../components/SearchBar.jsx'
import DashboardCards from '../components/DashboardCards.jsx'
import CrimeCharts from '../components/CrimeCharts.jsx'
import { fetchCrimeSummary, fetchCrimeTrends } from '../services/api.js'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [trends, setTrends] = useState(null)
  const [city, setCity] = useState(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [summaryError, setSummaryError] = useState(null)

  const handleSearchResult = async (searchResult) => {
    const matchedCity = searchResult.matched_city || searchResult.query
    setCity(matchedCity)
    setSummaryError(null)
    setLoadingSummary(true)
    setTrends(null)

    try {
      const data = await fetchCrimeSummary(matchedCity)
      setSummary(data)
    } catch (err) {
      setSummaryError(err.message || 'Could not load crime summary for this location.')
      setSummary(null)
    } finally {
      setLoadingSummary(false)
    }

    try {
      const trendData = await fetchCrimeTrends(matchedCity)
      setTrends(trendData)
    } catch {
      setTrends(null)
    }
  }

  return (
    <div className="min-h-full">
      <div className="bg-gradient-to-br from-emerald-700 via-teal-600 to-cyan-700 text-white">
        <div className="max-w-6xl mx-auto px-6 md:px-8 pt-10 pb-14">
          <div className="flex items-center gap-2 text-emerald-100 text-xs font-medium mb-3 uppercase tracking-wide">
            <ShieldCheck size={14} />
            Real-Time Crime Analytics
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">Safety Index</h1>
          <p className="text-emerald-50 mt-2 text-sm md:text-base max-w-xl">
            Search any location for its live risk score, crime breakdown, and trend analysis.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 -mt-8 pb-10 space-y-6">
        <SearchBar onSearchResult={handleSearchResult} accent="emerald" />

        {city && (
          <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3">
            <Sparkles size={15} className="text-emerald-500" />
            <h2 className="text-base font-semibold text-gray-700">
              Results for <span className="text-emerald-600">{city}</span>
            </h2>
          </div>
        )}

        {summaryError && (
          <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
            {summaryError}
          </p>
        )}

        {(loadingSummary || summary) && (
          <>
            <DashboardCards data={loadingSummary ? null : summary} />
            <CrimeCharts trends={loadingSummary ? null : trends} />
          </>
        )}
      </div>
    </div>
  )
}
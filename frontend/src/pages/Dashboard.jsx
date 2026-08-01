import { useState } from 'react'
import { ShieldCheck, Sparkles } from 'lucide-react'
import PageHero from '../components/PageHero.jsx'
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
      <PageHero
        eyebrow="Real-Time Crime Analytics"
        eyebrowIcon={ShieldCheck}
        title="Safety Index."
        description="Search any location for its live risk score, crime breakdown, and trend analysis."
        coords={summary ? `RISK ${Math.round(summary.risk_score)} · ${summary.risk_level?.toUpperCase()}` : '— SEARCH A LOCATION —'}
      >
        <div className="mt-6 max-w-2xl">
          <SearchBar onSearchResult={handleSearchResult} accent="signal" />
        </div>
      </PageHero>

      <div className="max-w-6xl mx-auto px-6 md:px-8 pt-8 pb-10 space-y-6">
        {city && (
          <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-3">
            <Sparkles size={15} className="text-signal-dark" />
            <h2 className="text-base font-semibold text-gray-700 font-display">
              Results for <span className="text-ink">{city}</span>
            </h2>
          </div>
        )}

        {summaryError && (
          <p className="text-sm text-alert bg-alert/5 border border-alert/20 rounded-xl p-4">
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
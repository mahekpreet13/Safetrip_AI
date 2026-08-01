import { FileText, Clock, AlertTriangle, Download } from 'lucide-react'

// Placeholder data — will later be replaced by data fetched from the backend
// (e.g. GET /crime-summary, GET /search) once Task 4/5 connect the frontend to real data.
const itineraryStops = [
  {
    time: '10:00 AM',
    place: 'Jama Masjid',
    safety: 'High',
    note: null,
  },
  {
    time: '02:00 PM',
    place: 'Chandni Chowk',
    safety: 'Moderate',
    note: 'Beware of pickpockets in crowded lanes.',
  },
]

const safetyStyles = {
  High: 'bg-green-100 text-green-700',
  Moderate: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-red-100 text-red-700',
}

export default function SafetyBriefCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="text-blue-600" size={20} />
        <h2 className="font-semibold text-gray-800">Itinerary & Safety Brief</h2>
      </div>

      <h3 className="text-sm font-semibold text-gray-500 mb-3">
        Day 1: Old Delhi Cultural Walk
      </h3>

      <div className="space-y-4">
        {itineraryStops.map((stop, i) => (
          <div key={i} className="border-l-2 border-blue-200 pl-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock size={14} />
              {stop.time}
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-medium text-gray-800">{stop.place}</span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${safetyStyles[stop.safety]}`}
              >
                {stop.safety}
              </span>
            </div>
            {stop.note && (
              <div className="flex items-start gap-1.5 mt-1.5 text-xs text-amber-700">
                <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                <span>AI Note: {stop.note}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="mt-6 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition">
        <Download size={16} />
        Export Safe PDF Plan
      </button>
    </div>
  )
}
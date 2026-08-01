import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
)

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#f1f5f9' } },
    x: { grid: { display: false } },
  },
}

function ChartCard({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 font-display">{title}</h3>
      <div className="h-56">{children}</div>
    </div>
  )
}

export default function CrimeCharts({ trends }) {
  if (!trends) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-64 animate-pulse" />
        ))}
      </div>
    )
  }

  const hourEntries = Object.entries(trends.by_hour || {}).sort(
    (a, b) => Number(a[0]) - Number(b[0])
  )

  const monthData = {
    labels: Object.keys(trends.by_month || {}),
    datasets: [
      {
        label: 'Crimes',
        data: Object.values(trends.by_month || {}),
        backgroundColor: '#3E8E6E',
        borderRadius: 6,
      },
    ],
  }

  const hourData = {
    labels: hourEntries.map(([hour]) => `${hour}:00`),
    datasets: [
      {
        label: 'Crimes',
        data: hourEntries.map(([, count]) => count),
        borderColor: '#B24B3C',
        backgroundColor: 'rgba(178, 75, 60, 0.1)',
        tension: 0.35,
        fill: true,
        pointRadius: 2,
        pointBackgroundColor: '#B24B3C',
      },
    ],
  }

  const categoryEntries = Object.entries(trends.by_category || {}).sort((a, b) => b[1] - a[1])

  const categoryData = {
    labels: categoryEntries.map(([type]) => type),
    datasets: [
      {
        label: 'Crimes',
        data: categoryEntries.map(([, count]) => count),
        backgroundColor: '#E8A33D',
        borderRadius: 6,
      },
    ],
  }

  const hasData = Object.keys(trends.by_month || {}).length > 0

  if (!hasData) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-sm text-gray-500">
        No trend data available for this location yet.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ChartCard title="Crime by Month">
        <Bar data={monthData} options={commonOptions} />
      </ChartCard>
      <ChartCard title="Crime by Hour">
        <Line data={hourData} options={commonOptions} />
      </ChartCard>
      <ChartCard title="Crime by Category">
        <Bar data={categoryData} options={{ ...commonOptions, indexAxis: 'y' }} />
      </ChartCard>
    </div>
  )
}
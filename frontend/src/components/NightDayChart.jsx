import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

export default function NightDayChart({ trends }) {
  if (!trends || !trends.by_hour) {
    return (
      <div className="border border-dashed border-gray-200 rounded-xl bg-gray-50 h-32 flex items-center justify-center text-gray-400 text-sm">
        Search a destination to see incident timing.
      </div>
    )
  }

  let day = 0
  let night = 0
  Object.entries(trends.by_hour).forEach(([hour, count]) => {
    const h = Number(hour)
    if (h >= 6 && h < 18) {
      day += count
    } else {
      night += count
    }
  })

  const data = {
    labels: ['Daytime (6am–6pm)', 'Nighttime (6pm–6am)'],
    datasets: [
      {
        data: [day, night],
        backgroundColor: ['#3b82f6', '#4338ca'],
        borderRadius: 8,
        barThickness: 28,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: '#f1f5f9' } },
      y: { grid: { display: false } },
    },
  }

  return (
    <div className="h-32">
      <Bar data={data} options={options} />
    </div>
  )
}
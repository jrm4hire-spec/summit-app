import { peaks } from '../../data'

const difficultyColor: Record<string, string> = {
  'Moderate': 'text-green-300',
  'Hard': 'text-yellow-300',
  'Very Hard': 'text-red-400',
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function estimateClimbers(val: number, maxVal: number, peakName: string): number {
  const popularPeaks = ['Mount Whitney', 'Pikes Peak', 'Mount Rainier', 'Mount Hood', 'Longs Peak', 'Mount Elbert', 'Quandary Peak', 'Mount Bierstadt', 'Grays Peak', 'Torreys Peak', 'Mount Evans', 'Mount Saint Helens', 'South Sister']
  const isPopular = popularPeaks.includes(peakName)
  const maxClimbers = isPopular ? 3000 : 300
  return Math.round((val / maxVal) * maxClimbers)
}

export default async function PeakPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const peak = peaks.find(p =>
    p.name.toLowerCase().replace(/\s+/g, '-') === slug
  )

  if (!peak) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <p className="text-gray-400">Peak not found</p>
      </div>
    )
  }

  const maxPop = Math.max(...peak.popularity)

  return (
    <div className="min-h-screen bg-gray-950 px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1">{peak.name}</h1>
        <p className="text-gray-400 text-sm">{peak.state} · {peak.region}</p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="bg-gray-900 rounded-xl px-4 py-3 flex-1 border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">Elevation</p>
          <p className="text-emerald-400 font-semibold">{peak.elevation.toLocaleString()} ft</p>
        </div>
        <div className="bg-gray-900 rounded-xl px-4 py-3 flex-1 border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">Difficulty</p>
          <p className={`font-semibold ${difficultyColor[peak.difficulty]}`}>{peak.difficulty}</p>
        </div>
        <div className="bg-gray-900 rounded-xl px-4 py-3 flex-1 border border-gray-800">
          <p className="text-gray-400 text-xs mb-1">Best Season</p>
          <p className="text-white font-semibold text-xs">{peak.season}</p>
        </div>
      </div>

      {/* Weather */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Current Weather</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-3xl font-bold">--°F</p>
            <p className="text-gray-400 text-sm">Loading forecast...</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Wind: -- mph</p>
            <p className="text-gray-500 text-xs mt-1">Coming soon</p>
          </div>
        </div>
      </div>

      {/* Popularity chart */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">Popularity by Month</p>
        <div className="flex items-end gap-1.5" style={{ height: '120px' }}>
          {peak.popularity.map((val, i) => {
            const heightPct = Math.max((val / maxPop) * 100, 2)
            const isPeak = val >= maxPop * 0.6
            const climbers = estimateClimbers(val, maxPop, peak.name)
            return (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1" style={{ height: '100%' }}>
                <span className="text-emerald-400 text-xs font-medium" style={{ fontSize: '9px' }}>
                  ~{climbers >= 1000 ? `${(climbers / 1000).toFixed(1)}k` : climbers}
                </span>
                <div
                  className={`w-full rounded-t transition-all ${isPeak ? 'bg-emerald-400' : 'bg-emerald-800'}`}
                  style={{ height: `${heightPct}%` }}
                />
              </div>
            )
          })}
        </div>
        <div className="flex mt-2">
          {months.map((m, i) => (
            <span key={i} className="text-gray-500 text-xs flex-1 text-center">{m}</span>
          ))}
        </div>
        <p className="text-gray-600 text-xs mt-2 text-center">Estimated climbers per month</p>
      </div>

      {/* Routes */}
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Routes</p>
        {peak.routes.map(route => (
          <div key={route} className="flex justify-between items-center py-3 border-b border-gray-800 last:border-0">
            <div>
              <p className="text-white font-medium">{route}</p>
              <p className="text-gray-500 text-xs mt-0.5">GPX available</p>
            </div>
            <span className="text-emerald-400 text-sm">→</span>
          </div>
        ))}
      </div>

      <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-4 rounded-2xl transition-colors mb-6">
        Log This Climb
      </button>
    </div>
  )
}
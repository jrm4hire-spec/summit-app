const peaks = [
  { name: 'Mount Rainier', state: 'Washington', country: 'USA', elevation: 14411, difficulty: 'Hard', season: 'Jun – Sep', routes: ['Disappointment Cleaver', 'Liberty Ridge', 'Emmons Glacier'], popularity: [5, 3, 8, 15, 35, 90, 100, 95, 60, 20, 8, 4] },
  { name: 'Denali', state: 'Alaska', country: 'USA', elevation: 20310, difficulty: 'Very Hard', season: 'Apr – Jul', routes: ['West Buttress', 'Cassin Ridge', 'West Rib'], popularity: [5, 10, 40, 80, 100, 90, 60, 20, 5, 2, 1, 1] },
  { name: 'Mount Whitney', state: 'California', country: 'USA', elevation: 14505, difficulty: 'Moderate', season: 'Jul – Sep', routes: ['Main Trail', "Mountaineer's Route", 'East Face'], popularity: [2, 2, 5, 10, 30, 70, 100, 95, 60, 15, 3, 1] },
  { name: 'Longs Peak', state: 'Colorado', country: 'USA', elevation: 14259, difficulty: 'Hard', season: 'Jul – Sep', routes: ['Keyhole Route', 'Loft Route', 'Diamond Face'], popularity: [2, 2, 4, 8, 25, 65, 100, 90, 50, 12, 3, 1] },
  { name: 'Mount Shasta', state: 'California', country: 'USA', elevation: 14179, difficulty: 'Hard', season: 'Apr – Jun', routes: ['Avalanche Gulch', 'Casaval Ridge', 'Hotlum Glacier'], popularity: [5, 8, 20, 60, 100, 90, 50, 30, 15, 8, 4, 3] },
  { name: 'Mount Baker', state: 'Washington', country: 'USA', elevation: 10781, difficulty: 'Moderate', season: 'May – Sep', routes: ['Coleman-Deming', 'Easton Glacier', 'Thunder Glacier'], popularity: [2, 2, 5, 15, 50, 85, 100, 90, 55, 15, 3, 1] },
  { name: 'Aconcagua', state: 'Mendoza', country: 'Argentina', elevation: 22838, difficulty: 'Very Hard', season: 'Nov – Feb', routes: ['Normal Route', 'Polish Glacier', 'South Face'], popularity: [80, 100, 60, 10, 3, 1, 1, 1, 5, 15, 50, 75] },
  { name: 'Cotopaxi', state: 'Cotopaxi Province', country: 'Ecuador', elevation: 19347, difficulty: 'Hard', season: 'Nov – Apr', routes: ['Normal Route', 'North Face'], popularity: [70, 60, 50, 30, 15, 5, 5, 10, 20, 40, 65, 80] },
  { name: 'Huascaran', state: 'Ancash', country: 'Peru', elevation: 22205, difficulty: 'Very Hard', season: 'May – Sep', routes: ['Southwest Face', 'North Summit'], popularity: [2, 2, 4, 10, 70, 100, 90, 80, 40, 8, 2, 1] },
  { name: 'Illimani', state: 'La Paz', country: 'Bolivia', elevation: 21122, difficulty: 'Very Hard', season: 'May – Sep', routes: ['Normal Route', 'South Ridge'], popularity: [2, 2, 4, 10, 65, 95, 100, 85, 45, 8, 2, 1] },
]

const difficultyColor: Record<string, string> = {
  'Moderate': 'text-green-300',
  'Hard': 'text-yellow-300',
  'Very Hard': 'text-red-400',
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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
        <p className="text-gray-400 text-sm">{peak.state} · {peak.country}</p>
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

      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Current Weather</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white text-3xl font-bold">--°F</p>
            <p className="text-gray-400 text-sm">Loading forecast...</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Wind: -- mph</p>
            <p className="text-gray-500 text-xs mt-1">Weather coming soon</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Popularity by Month</p>
        <div className="flex items-end gap-1 h-16">
          {peak.popularity.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t bg-emerald-600 opacity-80"
                style={{ height: `${(val / maxPop) * 100}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {months.map((m, i) => (
            <span key={i} className="text-gray-600 text-xs flex-1 text-center">{m}</span>
          ))}
        </div>
      </div>

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
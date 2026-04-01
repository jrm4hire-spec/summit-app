import Link from 'next/link'
import WeatherCard from '../../components/WeatherCard'
import { peaks } from '../../data'

const difficultyColor: Record<string, string> = {
  'Moderate': 'text-green-300',
  'Hard': 'text-yellow-300',
  'Very Hard': 'text-red-400',
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function estimateClimbers(val: number, maxVal: number, peakName: string): number {
  const popularPeaks = ['Mount Whitney', 'Pikes Peak', 'Mount Rainier', 'Mount Hood', 'Longs Peak', 'Mount Elbert', 'Quandary Peak', 'Mount Bierstadt', 'Grays Peak', 'Torreys Peak', 'Mount Evans', 'Mount Saint Helens', 'South Sister', 'Cotopaxi', 'Chimborazo', 'Huayna Potosi', 'Aconcagua']
  const isPopular = popularPeaks.includes(peakName)
  const maxClimbers = isPopular ? 3000 : 300
  return Math.round((val / maxVal) * maxClimbers)
}

const photoMap: Record<string, string> = {
  'Denali': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Mount Saint Elias': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Mount Foraker': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'Mount Bona': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Mount Blackburn': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Mount Sanford': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Mount Vancouver': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Mount Churchill': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Mount Fairweather': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Mount Hubbard': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'Mount Whitney': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'White Mountain Peak': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'North Palisade': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Mount Williamson': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Mount Shasta': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Mount Russell': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Mount Sill': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Mount Langley': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Mount Tyndall': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Mount Muir': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Middle Palisade': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Mount Humphreys': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Mount Darwin': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'Mount Tom': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Mount Elbert': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Mount Massive': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Mount Harvard': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Blanca Peak': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'La Plata Peak': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Uncompahgre Peak': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Crestone Peak': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Mount Lincoln': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Grays Peak': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Mount Antero': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Torreys Peak': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Castle Peak': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Quandary Peak': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Mount Evans': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Longs Peak': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Mount Wilson': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Mount Shavano': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Mount Princeton': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Mount Belford': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Mount Yale': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Mount Bross': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Mount Sneffels': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Kit Carson Peak': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Maroon Peak': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Tabeguache Peak': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Mount Oxford': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Mount Democrat': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Capitol Peak': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Pikes Peak': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Snowmass Mountain': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Windom Peak': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Mount Eolus': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Challenger Point': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Mount Columbia': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Missouri Mountain': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Humboldt Peak': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Mount Bierstadt': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Sunlight Peak': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Handies Peak': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Culebra Peak': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Redcloud Peak': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Mount of the Holy Cross': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'San Luis Peak': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'El Diente Peak': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Mount Rainier': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'Mount Adams': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Mount Baker': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Glacier Peak': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Mount Saint Helens': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Mount Olympus': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Mount Hood': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Mount Jefferson': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'South Sister': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Gannett Peak': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Grand Teton': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Fremont Peak': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Mount Moran': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Middle Teton': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'South Teton': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Cloud Peak': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Kings Peak': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Granite Peak': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Borah Peak': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Wheeler Peak': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Boundary Peak': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Mount Washington': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Mount Katahdin': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Mount Marcy': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Aconcagua': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Huascaran': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Illimani': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Cotopaxi': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Chimborazo': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Cayambe': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'Antisana': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Iliniza Norte': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Iliniza Sur': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'El Altar': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Sangay': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Tungurahua': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Sincholagua': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Corazon': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Rumiñahui': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Alpamayo': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'Artesonraju': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
  'Huandoy': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
  'Chopicalqui': 'https://images.unsplash.com/photo-1531176175280-9c1f23ff4b81?w=800&q=80',
  'Tocllaraju': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  'Huayna Potosi': 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  'Chearoco': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&q=80',
  'Chacaltaya': 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  'Ojos del Salado': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  'Pissis': 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80',
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
  const photoUrl = (peak.photo && peak.photo.length > 0) ? peak.photo : (photoMap[peak.name] || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80')

  return (
    <div className="min-h-screen bg-gray-950">

      {/* Hero photo */}
      <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
        <img
          src={photoUrl}
          alt={peak.name}
          className="w-full h-full object-contain bg-gray-900"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />

        {/* Back button */}
        <Link
          href="/"
          className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white rounded-full w-10 h-10 flex items-center justify-center text-lg"
        >
          ←
        </Link>

        {/* Peak name overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-5">
          <h1 className="text-4xl font-bold text-white mb-1">{peak.name}</h1>
          <p className="text-gray-300 text-sm">{peak.state} · {peak.region} · {peak.country}</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* Stats row */}
        <div className="flex gap-3 mb-4">
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
        <WeatherCard
        lat={peak.coords.lat}
        lon={peak.coords.lon}
        elevation={peak.elevation}
        peakName={peak.name}
        />

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
                  <span className="text-emerald-400 font-medium" style={{ fontSize: '9px' }}>
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
    </div>
  )
}
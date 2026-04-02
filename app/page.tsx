'use client'

import Link from 'next/link'
import { useState } from 'react'
import { peaks } from './data'
import WorldMap from './components/WorldMap'

const difficulties = ['Moderate', 'Hard', 'Very Hard']
const countries = [...new Set(peaks.map(p => p.country))].sort()
const allStates = [...new Set(peaks.map(p => p.state))].sort()

const difficultyColor: Record<string, string> = {
  'Moderate': 'bg-green-900 text-green-300',
  'Hard': 'bg-yellow-900 text-yellow-300',
  'Very Hard': 'bg-red-900 text-red-300',
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

const fallbackPhoto = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'

function getInitialState<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const stored = sessionStorage.getItem(key)
    return stored ? JSON.parse(stored) : defaultValue
  } catch { return defaultValue }
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(() => getInitialState('showMap', false))
  const [sortBy, setSortBy] = useState<'elevation-desc' | 'elevation-asc' | 'alpha-asc' | 'alpha-desc'>(() => getInitialState('sortBy', 'elevation-desc'))
  const [usMetric, setUsMetric] = useState(() => getInitialState('usMetric', false))

  const [appliedCountries, setAppliedCountries] = useState<string[]>(() => getInitialState('appliedCountries', []))
  const [appliedStates, setAppliedStates] = useState<string[]>(() => getInitialState('appliedStates', []))
  const [appliedDifficulties, setAppliedDifficulties] = useState<string[]>(() => getInitialState('appliedDifficulties', []))

  const [draftCountries, setDraftCountries] = useState<string[]>([])
  const [draftStates, setDraftStates] = useState<string[]>([])
  const [draftDifficulties, setDraftDifficulties] = useState<string[]>([])

  const activeFilterCount = appliedCountries.length + appliedStates.length + appliedDifficulties.length

  const saveToSession = (key: string, value: unknown) => {
    try { sessionStorage.setItem(key, JSON.stringify(value)) } catch {}
  }

  const toggle = (value: string, list: string[], setList: (v: string[]) => void) => {
    setList(list.includes(value) ? list.filter(i => i !== value) : [...list, value])
  }

  const openFilters = () => {
    setDraftCountries([...appliedCountries])
    setDraftStates([...appliedStates])
    setDraftDifficulties([...appliedDifficulties])
    setShowFilters(true)
  }

  const applyFilters = () => {
    setAppliedCountries([...draftCountries])
    setAppliedStates([...draftStates])
    setAppliedDifficulties([...draftDifficulties])
    saveToSession('appliedCountries', draftCountries)
    saveToSession('appliedStates', draftStates)
    saveToSession('appliedDifficulties', draftDifficulties)
    setShowFilters(false)
  }

  const cancelFilters = () => {
    setDraftCountries([...appliedCountries])
    setDraftStates([...appliedStates])
    setDraftDifficulties([...appliedDifficulties])
    setShowFilters(false)
  }

  const clearFilters = () => {
    setDraftCountries([])
    setDraftStates([])
    setDraftDifficulties([])
  }

  const handleSortChange = (newSort: typeof sortBy) => {
    setSortBy(newSort)
    saveToSession('sortBy', newSort)
  }

  const availableStates = draftCountries.length > 0
    ? [...new Set(peaks.filter(p => draftCountries.includes(p.country)).map(p => p.state))].sort()
    : allStates

  const previewFiltered = peaks.filter(peak => {
    const matchesCountry = draftCountries.length === 0 || draftCountries.includes(peak.country)
    const matchesState = draftStates.length === 0 || draftStates.includes(peak.state)
    const matchesDifficulty = draftDifficulties.length === 0 || draftDifficulties.includes(peak.difficulty)
    return matchesCountry && matchesState && matchesDifficulty
  })

  const formatElevation = (ft: number) => {
    if (usMetric) return `${Math.round(ft * 0.3048).toLocaleString()} m`
    return `${ft.toLocaleString()} ft`
  }

  const sortOptions: { value: typeof sortBy; label: string }[] = [
    { value: 'elevation-desc', label: 'Height: High → Low' },
    { value: 'elevation-asc', label: 'Height: Low → High' },
    { value: 'alpha-asc', label: 'Name: A → Z' },
    { value: 'alpha-desc', label: 'Name: Z → A' },
  ]

  const filtered = peaks
    .filter(peak => {
      const matchesSearch = peak.name.toLowerCase().includes(search.toLowerCase())
      const matchesCountry = appliedCountries.length === 0 || appliedCountries.includes(peak.country)
      const matchesState = appliedStates.length === 0 || appliedStates.includes(peak.state)
      const matchesDifficulty = appliedDifficulties.length === 0 || appliedDifficulties.includes(peak.difficulty)
      return matchesSearch && matchesCountry && matchesState && matchesDifficulty
    })
    .sort((a, b) => {
      if (sortBy === 'elevation-desc') return b.elevation - a.elevation
      if (sortBy === 'elevation-asc') return a.elevation - b.elevation
      if (sortBy === 'alpha-asc') return a.name.localeCompare(b.name)
      return b.name.localeCompare(a.name)
    })

  return (
    <div className="min-h-screen bg-gray-950 px-4 pt-6">
      <h1 className="text-2xl font-bold text-white mb-1">Explore Peaks</h1>
      <p className="text-emerald-400 text-sm mb-4">Let's find your next climb!</p>

      {/* Search */}
      <input
        type="text"
        placeholder="Search peaks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-emerald-500"
      />

      {/* Controls row */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={openFilters}
          className="flex items-center gap-2 bg-gray-800 text-gray-300 rounded-xl px-3 py-2.5 flex-1 justify-between"
        >
          <span className="flex items-center gap-2">
            <span>🎚</span>
            <span className="text-sm">Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-emerald-700 text-emerald-200 text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </span>
          <span className="text-gray-500 text-xs">{filtered.length} peaks</span>
        </button>

        <select
          value={sortBy}
          onChange={e => handleSortChange(e.target.value as typeof sortBy)}
          className="bg-gray-800 text-gray-300 rounded-xl px-3 py-2.5 text-sm outline-none"
        >
          {sortOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Feet/Meters + Map toggle row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center bg-gray-800 rounded-xl p-1 gap-1">
          <button
            onClick={() => { setUsMetric(false); saveToSession('usMetric', false) }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !usMetric ? 'bg-emerald-600 text-white' : 'text-gray-400'
            }`}
          >
            Feet
          </button>
          <button
            onClick={() => { setUsMetric(true); saveToSession('usMetric', true) }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              usMetric ? 'bg-emerald-600 text-white' : 'text-gray-400'
            }`}
          >
            Meters
          </button>
        </div>

        <button
          onClick={() => { setShowMap(!showMap); saveToSession('showMap', !showMap) }}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm transition-colors ${
            showMap ? 'bg-emerald-700 text-emerald-200' : 'bg-gray-800 text-gray-400'
          }`}
        >
          <span>🗺</span>
          <span>{showMap ? 'Hide map' : 'Show map'}</span>
        </button>
      </div>

      {/* World map */}
      {showMap && (
        <WorldMap
          selectedCountries={appliedCountries}
          selectedStates={appliedStates}
          onCountryClick={(country) => {
            const newCountries = appliedCountries.includes(country)
              ? appliedCountries.filter(c => c !== country)
              : [...appliedCountries, country]
            setAppliedCountries(newCountries)
            saveToSession('appliedCountries', newCountries)
          }}
          onStateClick={(state) => {
            const newStates = appliedStates.includes(state)
              ? appliedStates.filter(s => s !== state)
              : [...appliedStates, state]
            setAppliedStates(newStates)
            saveToSession('appliedStates', newStates)
          }}
        />
      )}

      {/* Peak cards */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center mt-8 col-span-2">No peaks match your filters</p>
        ) : (
          filtered.map(peak => {
            const photo = (peak.photo && peak.photo.length > 0) ? peak.photo : (photoMap[peak.name] || fallbackPhoto)
            return (
              <Link
                key={peak.name}
                href={`/peaks/${peak.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="relative rounded-2xl overflow-hidden block"
                style={{ aspectRatio: '4/3' }}
              >
                <img
                  src={photo}
                  alt={peak.name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h2 className="text-white font-semibold text-sm leading-tight">{peak.name}</h2>
                  <p className="text-gray-300 text-xs mt-0.5">{peak.state}</p>
                  <p className="text-gray-400 text-xs">{peak.region}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-emerald-400 text-xs">{formatElevation(peak.elevation)}</p>
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${difficultyColor[peak.difficulty]}`}>
                      {peak.difficulty}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })
        )}
      </div>

      {/* Filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={cancelFilters} />
          <div className="relative bg-gray-900 rounded-t-3xl p-6 z-10 max-h-[80vh] overflow-y-auto pb-24">
            <div className="flex justify-between items-center mb-6">
              <button onClick={cancelFilters} className="text-gray-400 text-sm">Cancel</button>
              <h2 className="text-white text-lg font-semibold">Filter Peaks</h2>
              <button onClick={clearFilters} className="text-emerald-400 text-sm">Clear all</button>
            </div>

            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Country</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {countries.map(c => (
                <button
                  key={c}
                  onClick={() => toggle(c, draftCountries, setDraftCountries)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    draftCountries.includes(c)
                      ? 'bg-emerald-700 text-emerald-200'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">State / Province</p>
            <div className="flex flex-wrap gap-2 mb-5">
              {availableStates.map(s => (
                <button
                  key={s}
                  onClick={() => toggle(s, draftStates, setDraftStates)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    draftStates.includes(s)
                      ? 'bg-emerald-700 text-emerald-200'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Difficulty</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {difficulties.map(d => (
                <button
                  key={d}
                  onClick={() => toggle(d, draftDifficulties, setDraftDifficulties)}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    draftDifficulties.includes(d)
                      ? 'bg-emerald-700 text-emerald-200'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <button
              onClick={applyFilters}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Show {previewFiltered.length} peaks
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import Link from 'next/link'
import { useState } from 'react'

const peaks = [
  { name: 'Mount Rainier', state: 'Washington', country: 'USA', elevation: 14411, difficulty: 'Hard', region: 'Pacific Northwest' },
  { name: 'Denali', state: 'Alaska', country: 'USA', elevation: 20310, difficulty: 'Very Hard', region: 'Alaska' },
  { name: 'Mount Whitney', state: 'California', country: 'USA', elevation: 14505, difficulty: 'Moderate', region: 'Sierra Nevada' },
  { name: 'Longs Peak', state: 'Colorado', country: 'USA', elevation: 14259, difficulty: 'Hard', region: 'Rockies' },
  { name: 'Mount Shasta', state: 'California', country: 'USA', elevation: 14179, difficulty: 'Hard', region: 'Cascades' },
  { name: 'Mount Baker', state: 'Washington', country: 'USA', elevation: 10781, difficulty: 'Moderate', region: 'Pacific Northwest' },
  { name: 'Aconcagua', state: 'Mendoza', country: 'Argentina', elevation: 22838, difficulty: 'Very Hard', region: 'South America' },
  { name: 'Cotopaxi', state: 'Cotopaxi Province', country: 'Ecuador', elevation: 19347, difficulty: 'Hard', region: 'South America' },
  { name: 'Huascaran', state: 'Ancash', country: 'Peru', elevation: 22205, difficulty: 'Very Hard', region: 'South America' },
  { name: 'Illimani', state: 'La Paz', country: 'Bolivia', elevation: 21122, difficulty: 'Very Hard', region: 'South America' },
]

const difficulties = ['Moderate', 'Hard', 'Very Hard']
const countries = ['USA', 'Argentina', 'Ecuador', 'Peru', 'Bolivia']
const statesByCountry: Record<string, string[]> = {
  USA: ['Alaska', 'California', 'Colorado', 'Washington'],
  Argentina: ['Mendoza'],
  Ecuador: ['Cotopaxi Province'],
  Peru: ['Ancash'],
  Bolivia: ['La Paz'],
}

const difficultyColor: Record<string, string> = {
  'Moderate': 'bg-green-900 text-green-300',
  'Hard': 'bg-yellow-900 text-yellow-300',
  'Very Hard': 'bg-red-900 text-red-300',
}

export default function Home() {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const [appliedCountries, setAppliedCountries] = useState<string[]>([])
  const [appliedStates, setAppliedStates] = useState<string[]>([])
  const [appliedDifficulties, setAppliedDifficulties] = useState<string[]>([])

  const [draftCountries, setDraftCountries] = useState<string[]>([])
  const [draftStates, setDraftStates] = useState<string[]>([])
  const [draftDifficulties, setDraftDifficulties] = useState<string[]>([])

  const activeFilterCount = appliedCountries.length + appliedStates.length + appliedDifficulties.length

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

  const availableStates = draftCountries.length > 0
    ? draftCountries.flatMap(c => statesByCountry[c] || [])
    : Object.values(statesByCountry).flat()

  const previewFiltered = peaks.filter(peak => {
    const matchesCountry = draftCountries.length === 0 || draftCountries.includes(peak.country)
    const matchesState = draftStates.length === 0 || draftStates.includes(peak.state)
    const matchesDifficulty = draftDifficulties.length === 0 || draftDifficulties.includes(peak.difficulty)
    return matchesCountry && matchesState && matchesDifficulty
  })

  const filtered = peaks.filter(peak => {
    const matchesSearch = peak.name.toLowerCase().includes(search.toLowerCase())
    const matchesCountry = appliedCountries.length === 0 || appliedCountries.includes(peak.country)
    const matchesState = appliedStates.length === 0 || appliedStates.includes(peak.state)
    const matchesDifficulty = appliedDifficulties.length === 0 || appliedDifficulties.includes(peak.difficulty)
    return matchesSearch && matchesCountry && matchesState && matchesDifficulty
  })

  return (
    <div className="min-h-screen bg-gray-950 px-4 pt-6">
      <h1 className="text-2xl font-bold text-white mb-1">Explore Peaks</h1>
      <p className="text-gray-400 text-sm mb-4">United States & South America</p>

      <input
        type="text"
        placeholder="Search peaks..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-gray-800 text-white placeholder-gray-500 rounded-xl px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-emerald-500"
      />

      <button
        onClick={openFilters}
        className="flex items-center gap-2 bg-gray-800 text-gray-300 rounded-xl px-4 py-3 mb-4 w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <span>🎚</span>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-emerald-700 text-emerald-200 text-xs px-2 py-0.5 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </span>
        <span className="text-gray-500 text-sm">{filtered.length} peaks</span>
      </button>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center mt-8">No peaks match your filters</p>
        ) : (
          filtered.map(peak => (
            <Link
              key={peak.name}
              href={`/peaks/${peak.name.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-gray-900 rounded-2xl p-4 border border-gray-800 active:scale-95 transition-transform block"
            >
              <div className="flex justify-between items-start mb-1">
                <h2 className="text-white font-semibold text-lg">{peak.name}</h2>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${difficultyColor[peak.difficulty]}`}>
                  {peak.difficulty}
                </span>
              </div>
              <p className="text-gray-400 text-sm">{peak.state} · {peak.country}</p>
              <p className="text-emerald-400 text-sm mt-1">{peak.elevation.toLocaleString()} ft</p>
            </Link>
          ))
        )}
      </div>

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
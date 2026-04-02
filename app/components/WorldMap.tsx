'use client'

import { useState, useEffect } from 'react'
import { geoNaturalEarth1, geoMercator, geoPath } from 'd3-geo'
import { peaks } from '../data'

const COUNTRY_CONFIG: Record<string, {
  name: string
  center: [number, number]
  scale: number
}> = {
  '840': { name: 'USA', center: [-98, 40], scale: 280 },
  '032': { name: 'Argentina', center: [-65, -35], scale: 320 },
  '604': { name: 'Peru', center: [-75, -10], scale: 600 },
  '068': { name: 'Bolivia', center: [-65, -17], scale: 700 },
  '218': { name: 'Ecuador', center: [-78, -2], scale: 1000 },
  '152': { name: 'Chile', center: [-71, -35], scale: 380 },
}

const peaksByState = peaks.reduce((acc, p) => {
  if (!acc[p.state]) acc[p.state] = 0
  acc[p.state]++
  return acc
}, {} as Record<string, number>)

const STATE_CENTERS: Record<string, [number, number]> = {
  'Alaska': [-153, 64],
  'Washington': [-120.5, 47.5],
  'Oregon': [-120.5, 44],
  'California': [-119.5, 37],
  'Nevada': [-116.5, 39],
  'Idaho': [-114.5, 44.5],
  'Montana': [-110, 47],
  'Wyoming': [-107.5, 43],
  'Utah': [-111.5, 39.5],
  'Colorado': [-105.5, 39],
  'New Mexico': [-106, 34.5],
  'New Hampshire': [-71.5, 44],
  'Maine': [-69, 45.5],
  'New York': [-75, 43],
  'South Dakota': [-100, 44.5],
  'Mendoza': [-69, -33],
  'Ancash': [-77.5, -9],
  'La Paz': [-68, -16],
  'Cotopaxi Province': [-78.5, -0.7],
  'Pichincha': [-78.5, -0.2],
  'Chimborazo': [-78.8, -1.5],
  'Tungurahua': [-78.5, -1.5],
  'Napo': [-77.8, -0.5],
  'Morona Santiago': [-77.5, -2.5],
  'Catamarca': [-67, -27],
  'Atacama': [-69, -27],
}

const US_STATE_NAMES: Record<string, string> = {
  '02': 'Alaska', '06': 'California', '08': 'Colorado', '16': 'Idaho',
  '23': 'Maine', '30': 'Montana', '32': 'Nevada', '33': 'New Hampshire',
  '35': 'New Mexico', '36': 'New York', '41': 'Oregon',
  '46': 'South Dakota', '49': 'Utah', '53': 'Washington', '56': 'Wyoming',
}

interface WorldMapProps {
  selectedCountries: string[]
  selectedStates: string[]
  onCountryClick: (country: string) => void
  onStateClick: (state: string) => void
}

export default function WorldMap({ selectedCountries, selectedStates, onCountryClick, onStateClick }: WorldMapProps) {
  const [worldFeatures, setWorldFeatures] = useState<any[]>([])
  const [usStateFeatures, setUsStateFeatures] = useState<any[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [zoomedCountryId, setZoomedCountryId] = useState<string | null>(null)

  const width = 600
  const height = 260

  useEffect(() => {
    Promise.all([
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json()),
      fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json()),
      import('topojson-client'),
    ]).then(([worldData, usData, topo]) => {
      setWorldFeatures((topo as any).feature(worldData, worldData.objects.countries).features)
      setUsStateFeatures((topo as any).feature(usData, usData.objects.states).features)
    }).catch(console.error)
  }, [])

  const isAvailable = (id: string) => !!COUNTRY_CONFIG[String(id).padStart(3, '0')]
  const getCountryName = (id: string) => COUNTRY_CONFIG[String(id).padStart(3, '0')]?.name
  const isCountrySelected = (id: string) => {
    const name = getCountryName(id)
    return name ? selectedCountries.includes(name) : false
  }

  // World projection
  const worldProjection = geoNaturalEarth1()
    .scale(95)
    .translate([width / 2, height / 2])
  const worldPath = geoPath(worldProjection)

  // Zoomed projection
  const zoomedConfig = zoomedCountryId ? COUNTRY_CONFIG[zoomedCountryId] : null
  const zoomedProjection = zoomedConfig
    ? geoMercator().scale(zoomedConfig.scale).center(zoomedConfig.center).translate([width / 2, height / 2])
    : null
  const zoomedPath = zoomedProjection ? geoPath(zoomedProjection) : null

  const getStatesForCountry = (countryName: string) =>
    Object.keys(peaksByState).filter(state => peaks.find(p => p.state === state)?.country === countryName)

  if (!worldFeatures.length) {
    return (
      <div className="w-full bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center mb-4" style={{ height }}>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-4">
      <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 relative">

        {/* Back button when zoomed */}
        {zoomedCountryId && (
          <button
            onClick={() => setZoomedCountryId(null)}
            className="absolute top-2 left-2 z-10 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5"
          >
            ← World view
          </button>
        )}

        {/* Zoomed country name */}
        {zoomedCountryId && (
          <div className="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-sm text-emerald-400 text-xs px-3 py-1.5 rounded-full">
            {zoomedConfig?.name}
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full"
          style={{ background: '#0f172a' }}
        >
          {!zoomedCountryId ? (
            /* World view */
            worldFeatures.map((f: any, i: number) => {
              const id = String(f.id).padStart(3, '0')
              const available = isAvailable(f.id)
              const selected = isCountrySelected(f.id)
              const hovered = hoveredId === id
              let fill = '#1e293b'
              if (selected) fill = '#065f46'
              else if (hovered && available) fill = '#134e4a'
              else if (available) fill = '#0f4c3a'
              const d = worldPath(f)
              if (!d) return null
              return (
                <path
                  key={i}
                  d={d}
                  fill={fill}
                  stroke="#334155"
                  strokeWidth={0.4}
                  className={available ? 'cursor-pointer' : ''}
                  onClick={() => {
                    if (!available) return
                    const paddedId = String(f.id).padStart(3, '0')
                    setZoomedCountryId(paddedId)
                    onCountryClick(COUNTRY_CONFIG[paddedId].name)
                  }}
                  onMouseEnter={() => available && setHoveredId(id)}
                  onMouseLeave={() => setHoveredId(null)}
                />
              )
            })
          ) : (
            /* Zoomed country view */
            <>
              {/* Base world layer */}
              {worldFeatures.map((f: any, i: number) => {
                const d = zoomedPath!(f)
                if (!d) return null
                const id = String(f.id).padStart(3, '0')
                const isActive = id === zoomedCountryId
                return (
                  <path
                    key={i}
                    d={d}
                    fill={isActive ? '#0f2d1e' : '#111827'}
                    stroke="#1e293b"
                    strokeWidth={0.3}
                  />
                )
              })}

              {/* US state boundaries and clickable states */}
              {zoomedConfig?.name === 'USA' && usStateFeatures.map((f: any, i: number) => {
                const stateName = US_STATE_NAMES[String(f.id).padStart(2, '0')] || ''
                const hasPeaks = !!peaksByState[stateName]
                const selected = selectedStates.includes(stateName)
                const hovered = hoveredId === `state-${stateName}`
                const d = zoomedPath!(f)
                if (!d) return null
                let fill = '#0f2d1e'
                if (!hasPeaks) fill = '#111827'
                else if (selected) fill = '#065f46'
                else if (hovered) fill = '#134e4a'
                else fill = '#0f4c3a'
                return (
                  <path
                    key={i}
                    d={d}
                    fill={fill}
                    stroke="#334155"
                    strokeWidth={0.8}
                    className={hasPeaks ? 'cursor-pointer' : ''}
                    onClick={() => hasPeaks && stateName && onStateClick(stateName)}
                    onMouseEnter={() => hasPeaks && setHoveredId(`state-${stateName}`)}
                    onMouseLeave={() => setHoveredId(null)}
                  />
                )
              })}

              {/* South American province dots */}
              {zoomedConfig?.name !== 'USA' && zoomedProjection &&
                getStatesForCountry(zoomedConfig!.name).map((stateName, i) => {
                  const center = STATE_CENTERS[stateName]
                  if (!center) return null
                  const pos = zoomedProjection(center as any)
                  if (!pos) return null
                  const selected = selectedStates.includes(stateName)
                  const hovered = hoveredId === `state-${stateName}`
                  const count = peaksByState[stateName] || 0
                  return (
                    <g
                      key={i}
                      className="cursor-pointer"
                      onClick={() => onStateClick(stateName)}
                      onMouseEnter={() => setHoveredId(`state-${stateName}`)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <circle
                        cx={pos[0]} cy={pos[1]} r={14}
                        fill={selected ? '#065f46' : hovered ? '#134e4a' : '#0f4c3a'}
                        stroke={selected ? '#34d399' : '#1d9e75'}
                        strokeWidth={1.5}
                      />
                      <text
                        x={pos[0]} y={pos[1] + 1}
                        textAnchor="middle" dominantBaseline="middle"
                        fill="#34d399" fontSize={9} fontWeight={600}
                      >
                        {count}
                      </text>
                    </g>
                  )
                })
              }

              {/* Hover label */}
              {hoveredId?.startsWith('state-') && (
                <text x={width / 2} y={height - 8} textAnchor="middle" fill="#34d399" fontSize={10}>
                  {hoveredId.replace('state-', '')} · {peaksByState[hoveredId.replace('state-', '')] || 0} peaks — click to filter
                </text>
              )}
            </>
          )}
        </svg>
      </div>

      {/* Country chips */}
      <div className="flex flex-wrap gap-2 mt-3">
        {Object.values(COUNTRY_CONFIG).map(({ name }) => {
          const id = Object.entries(COUNTRY_CONFIG).find(([, v]) => v.name === name)?.[0]
          const selected = selectedCountries.includes(name)
          return (
            <button
              key={name}
              onClick={() => {
                if (id) setZoomedCountryId(id)
                onCountryClick(name)
              }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selected ? 'bg-emerald-700 text-emerald-200' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
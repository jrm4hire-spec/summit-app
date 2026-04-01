'use client'

import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

type ElevationTab = 'base' | 'mid' | 'summit'

interface WeatherCardProps {
  lat: number
  lon: number
  elevation: number
  peakName: string
}

const windColor = (speed: number) => {
  if (speed >= 60) return 'bg-red-600 text-white'
  if (speed >= 40) return 'bg-orange-500 text-white'
  if (speed >= 25) return 'bg-yellow-500 text-gray-900'
  if (speed >= 15) return 'bg-blue-500 text-white'
  return 'bg-gray-600 text-white'
}

const tempColor = (temp: number) => {
  if (temp <= -20) return 'bg-purple-900 text-purple-200'
  if (temp <= -10) return 'bg-blue-900 text-blue-200'
  if (temp <= 0) return 'bg-blue-700 text-white'
  if (temp <= 15) return 'bg-cyan-700 text-white'
  if (temp <= 25) return 'bg-green-700 text-white'
  if (temp <= 35) return 'bg-yellow-600 text-white'
  return 'bg-orange-600 text-white'
}

const getConditionIcon = (code: number) => {
  if (code === 0) return '☀️'
  if (code <= 2) return '⛅'
  if (code === 3) return '☁️'
  if (code <= 49) return '🌫️'
  if (code <= 59) return '🌦️'
  if (code <= 69) return '🌧️'
  if (code <= 79) return '🌨️'
  if (code <= 84) return '❄️'
  if (code <= 94) return '🌩️'
  return '⛈️'
}

const getConditionLabel = (code: number) => {
  if (code === 0) return 'Clear'
  if (code <= 2) return 'Pt. cloudy'
  if (code === 3) return 'Overcast'
  if (code <= 49) return 'Foggy'
  if (code <= 59) return 'Drizzle'
  if (code <= 69) return 'Rain'
  if (code <= 79) return 'Snow'
  if (code <= 84) return 'Snow shwrs'
  if (code <= 94) return 'Hail'
  return 'Thunderstorm'
}

const riskColor = {
  'Low': { bar: 'bg-emerald-500', text: 'text-emerald-400' },
  'Moderate': { bar: 'bg-yellow-500', text: 'text-yellow-400' },
  'High': { bar: 'bg-orange-500', text: 'text-orange-400' },
  'Extreme': { bar: 'bg-red-500', text: 'text-red-400' },
}

const riskWidth = { 'Low': '25%', 'Moderate': '50%', 'High': '75%', 'Extreme': '100%' }

export default function WeatherCard({ lat, lon, elevation, peakName }: WeatherCardProps) {
  const [tab, setTab] = useState<ElevationTab>('summit')

  const { data, error, isLoading } = useSWR(
    `/api/weather?lat=${lat}&lon=${lon}&elevation=${elevation}`,
    fetcher,
    { refreshInterval: 900000 }
  )

  const baseElevation = Math.round(elevation * 0.3)
  const midElevation = Math.round(elevation * 0.65)

  if (isLoading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Mountain Weather</p>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Fetching mountain conditions...</p>
        </div>
      </div>
    )
  }

  if (error || !data || data.error) {
    return (
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800 mb-4">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Mountain Weather</p>
        <p className="text-gray-500 text-sm">Weather data unavailable</p>
      </div>
    )
  }

  const risk = data?.risk?.level as keyof typeof riskColor | undefined
  const forecast = data.forecast ?? []

  const elevationLabel = tab === 'base'
    ? `${baseElevation.toLocaleString()} ft`
    : tab === 'mid'
    ? `${midElevation.toLocaleString()} ft`
    : `${elevation.toLocaleString()} ft`

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 mb-4 overflow-hidden">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-800">
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-300 text-sm font-medium">Mountain Weather</p>
          <p className="text-gray-600 text-xs">Updates every 15 min</p>
        </div>

        {/* Elevation tabs */}
        <div className="flex gap-2">
          {(['base', 'mid', 'summit'] as ElevationTab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                tab === t ? 'bg-emerald-700 text-emerald-100' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
              <br />
              <span className="opacity-70 text-xs">
                {t === 'base' ? baseElevation.toLocaleString()
                  : t === 'mid' ? midElevation.toLocaleString()
                  : elevation.toLocaleString()} ft
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Current conditions */}
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Now · {elevationLabel}</p>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{data.current.condition.icon}</span>
          <div>
            <p className="text-white text-3xl font-bold">
              {tab === 'summit' ? data.current.temp
                : tab === 'mid' ? (data.levels.mid.temp ?? '--')
                : (data.levels.low.temp ?? '--')}°F
            </p>
            <p className="text-gray-400 text-sm">{data.current.condition.label}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-gray-400 text-xs">Feels like</p>
            <p className="text-white text-lg font-semibold">{data.current.feelsLike}°F</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-gray-500 text-xs mb-1">Wind</p>
            <div className={`rounded-full w-10 h-10 flex items-center justify-center mx-auto text-xs font-bold ${windColor(tab === 'summit' ? data.current.windSpeed : tab === 'mid' ? (data.levels.mid.wind ?? 0) : (data.levels.low.wind ?? 0))}`}>
              {tab === 'summit' ? data.current.windSpeed
                : tab === 'mid' ? (data.levels.mid.wind ?? '--')
                : (data.levels.low.wind ?? '--')}
            </div>
            <p className="text-gray-500 text-xs mt-1">mph · {data.current.windDir}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-gray-500 text-xs mb-1">Gusts</p>
            <div className={`rounded-full w-10 h-10 flex items-center justify-center mx-auto text-xs font-bold ${windColor(data.current.windGust)}`}>
              {data.current.windGust}
            </div>
            <p className="text-gray-500 text-xs mt-1">mph max</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-2 text-center">
            <p className="text-gray-500 text-xs mb-1">Visibility</p>
            <p className="text-white text-sm font-bold mt-2">
              {data.current.visibility ? `${(data.current.visibility / 1609).toFixed(1)}` : '--'}
            </p>
            <p className="text-gray-500 text-xs mt-1">miles</p>
          </div>
        </div>
      </div>

      {/* Cloud & freezing levels */}
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Cloud & Freezing Levels</p>
        <div className="grid grid-cols-2 gap-2 mb-2">
          <div className="bg-gray-800 rounded-lg p-2">
            <p className="text-gray-500 text-xs mb-1">Cloud base</p>
            <p className="text-blue-300 font-semibold text-sm">
              {data.clouds.baseFt ? `~${data.clouds.baseFt.toLocaleString()} ft` : 'Clear'}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-2">
            <p className="text-gray-500 text-xs mb-1">Freezing level</p>
            <p className="text-cyan-300 font-semibold text-sm">
              {data.current.temp <= 32
                ? `Below ${elevation.toLocaleString()} ft`
                : `Above summit`}
            </p>
          </div>
        </div>

        {/* Cloud layer bars */}
        <div className="space-y-1.5 mb-2">
          {[
            { label: 'High cloud', value: data.clouds.high, color: 'bg-blue-400' },
            { label: 'Mid cloud', value: data.clouds.mid, color: 'bg-blue-300' },
            { label: 'Low cloud', value: data.clouds.low, color: 'bg-blue-200' },
          ].map(layer => (
            <div key={layer.label} className="flex items-center gap-2">
              <span className="text-gray-500 text-xs w-16">{layer.label}</span>
              <div className="flex-1 bg-gray-700 rounded h-1.5">
                <div className={`${layer.color} h-1.5 rounded opacity-70`} style={{ width: `${layer.value}%` }} />
              </div>
              <span className="text-gray-400 text-xs w-8 text-right">{layer.value}%</span>
            </div>
          ))}
        </div>

        {data.inversion && (
          <div className="bg-orange-900/40 rounded-lg px-3 py-2 flex items-center gap-2">
            <span>⚠️</span>
            <p className="text-orange-300 text-xs font-medium">Inversion likely — cloud base below summit</p>
          </div>
        )}
      </div>

      {/* 7-day forecast table */}
      <div className="px-4 py-3 border-b border-gray-800">
        <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">7-Day Forecast · {elevationLabel}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-max">
            <thead>
              <tr>
                <td className="text-gray-600 pb-2 pr-2 w-12"></td>
                {forecast.map((day: any, i: number) => (
                  <td key={i} className="text-gray-400 pb-2 text-center font-medium px-1 min-w-[48px]">
                    {i === 0 ? 'Today' : day.day}
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Condition icons */}
              <tr>
                <td className="text-gray-600 py-1 pr-2">Sky</td>
                {forecast.map((day: any, i: number) => (
                  <td key={i} className="text-center py-1 px-1 text-base">{day.condition.icon}</td>
                ))}
              </tr>
              {/* Wind */}
              <tr>
                <td className="text-gray-600 py-1 pr-2">Wind</td>
                {forecast.map((day: any, i: number) => (
                  <td key={i} className="text-center py-1 px-1">
                    <div className={`rounded-full w-8 h-8 flex items-center justify-center mx-auto text-xs font-bold ${windColor(day.windMax)}`}>
                      {day.windMax}
                    </div>
                  </td>
                ))}
              </tr>
              {/* Snow */}
              <tr>
                <td className="text-gray-600 py-1 pr-2">Snow</td>
                {forecast.map((day: any, i: number) => (
                  <td key={i} className={`text-center py-1 px-1 font-medium ${day.precip > 0 ? 'text-blue-300' : 'text-gray-600'}`}>
                    {day.precip > 0 ? `${day.precip}"` : '—'}
                  </td>
                ))}
              </tr>
              {/* High temp */}
              <tr>
                <td className="text-gray-600 py-1 pr-2">High</td>
                {forecast.map((day: any, i: number) => (
                  <td key={i} className="py-1 px-1">
                    <div className={`rounded text-center text-xs font-bold py-0.5 ${tempColor(day.high)}`}>
                      {day.high}°
                    </div>
                  </td>
                ))}
              </tr>
              {/* Low temp */}
              <tr>
                <td className="text-gray-600 py-1 pr-2">Low</td>
                {forecast.map((day: any, i: number) => (
                  <td key={i} className="py-1 px-1">
                    <div className={`rounded text-center text-xs font-bold py-0.5 ${tempColor(day.low)}`}>
                      {day.low}°
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Climbing risk */}
      {risk && (
        <div className="px-4 py-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-500 text-xs uppercase tracking-wider">Climbing Risk</p>
            <p className={`text-sm font-semibold ${riskColor[risk].text}`}>{risk}</p>
          </div>
          <div className="bg-gray-800 rounded-full h-2">
            <div
              className={`${riskColor[risk].bar} h-2 rounded-full transition-all`}
              style={{ width: riskWidth[risk] }}
            />
          </div>
          <p className="text-gray-600 text-xs mt-2">
            Based on wind, temperature, precipitation and cloud conditions
          </p>
        </div>
      )}
    </div>
  )
}
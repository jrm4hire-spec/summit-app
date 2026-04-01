import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')
  const elevation = searchParams.get('elevation')

  if (!lat || !lon || !elevation) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
  }

  const elevationM = Math.round(Number(elevation) * 0.3048)

  // Pressure levels to fetch (hPa) — approximates to different altitudes
  // 850hPa ≈ 5,000ft, 700hPa ≈ 10,000ft, 500hPa ≈ 18,000ft, 300hPa ≈ 30,000ft
  const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&elevation=${elevationM}&current=temperature_2m,apparent_temperature,wind_speed_10m,wind_direction_10m,wind_gusts_10m,weather_code,cloud_cover,visibility,precipitation&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch&timezone=auto&forecast_days=7&hourly=cloud_cover_low,cloud_cover_mid,cloud_cover_high,temperature_1000hPa,temperature_850hPa,temperature_700hPa,temperature_500hPa,wind_speed_1000hPa,wind_speed_850hPa,wind_speed_700hPa,wind_speed_500hPa&forecast_hours=24`

  try {
    const response = await fetch(openMeteoUrl)
    const data = await response.json()

    if (!data.current) {
      return NextResponse.json({ error: 'No weather data available' }, { status: 500 })
    }

    // Get current hour index for hourly data
    const now = new Date()
    const hourIndex = now.getHours()

    // Extract multi-level data
    const levels = {
      low: {
        temp: data.hourly?.temperature_1000hPa?.[hourIndex] ?? null,
        wind: data.hourly?.wind_speed_1000hPa?.[hourIndex] ?? null,
      },
      mid: {
        temp: data.hourly?.temperature_850hPa?.[hourIndex] ?? null,
        wind: data.hourly?.wind_speed_850hPa?.[hourIndex] ?? null,
      },
      high: {
        temp: data.hourly?.temperature_700hPa?.[hourIndex] ?? null,
        wind: data.hourly?.wind_speed_700hPa?.[hourIndex] ?? null,
      },
      summit: {
        temp: data.hourly?.temperature_500hPa?.[hourIndex] ?? null,
        wind: data.hourly?.wind_speed_500hPa?.[hourIndex] ?? null,
      },
    }

    // Cloud layers
    const cloudLow = data.hourly?.cloud_cover_low?.[hourIndex] ?? 0
    const cloudMid = data.hourly?.cloud_cover_mid?.[hourIndex] ?? 0
    const cloudHigh = data.hourly?.cloud_cover_high?.[hourIndex] ?? 0

    // Estimate cloud base height in feet
    // Low clouds: surface to ~6,500ft, Mid: 6,500-20,000ft, High: above 20,000ft
    const cloudBaseFt = cloudLow > 30 ? 2000 + (Math.random() * 3000) :
                        cloudMid > 30 ? 8000 + (Math.random() * 4000) :
                        cloudHigh > 30 ? 20000 + (Math.random() * 5000) : null

    // Inversion detection — if cloud base is below summit elevation
    const summitFt = Number(elevation)
    const inversionLikely = cloudBaseFt !== null && cloudBaseFt < summitFt && cloudLow > 40

    // Calculate climbing risk score (0-100)
    const windSpeed = data.current.wind_gusts_10m || data.current.wind_speed_10m
    const temp = data.current.temperature_2m
    const weatherCode = data.current.weather_code
    const isStorm = weatherCode >= 51 // drizzle and above
    const isSnow = weatherCode >= 71
    const isThunder = weatherCode >= 95

    let riskScore = 0
    if (windSpeed > 60) riskScore += 40
    else if (windSpeed > 40) riskScore += 25
    else if (windSpeed > 25) riskScore += 15
    if (temp < 0) riskScore += 20
    else if (temp < 20) riskScore += 10
    if (isThunder) riskScore += 40
    else if (isSnow) riskScore += 20
    else if (isStorm) riskScore += 10
    if (inversionLikely) riskScore += 15
    riskScore = Math.min(riskScore, 100)

    const riskLevel = riskScore >= 70 ? 'Extreme' :
                      riskScore >= 50 ? 'High' :
                      riskScore >= 30 ? 'Moderate' : 'Low'

    // Map weather codes to conditions
    const getCondition = (code: number) => {
      if (code === 0) return { label: 'Clear', icon: '☀️' }
      if (code <= 2) return { label: 'Partly cloudy', icon: '⛅' }
      if (code === 3) return { label: 'Overcast', icon: '☁️' }
      if (code <= 49) return { label: 'Foggy', icon: '🌫️' }
      if (code <= 59) return { label: 'Drizzle', icon: '🌦️' }
      if (code <= 69) return { label: 'Rain', icon: '🌧️' }
      if (code <= 79) return { label: 'Snow', icon: '🌨️' }
      if (code <= 84) return { label: 'Snow showers', icon: '❄️' }
      if (code <= 94) return { label: 'Hail', icon: '🌩️' }
      return { label: 'Thunderstorm', icon: '⛈️' }
    }

    const windDirection = (deg: number) => {
      const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
      return dirs[Math.round(deg / 45) % 8]
    }

    const forecast = data.daily?.time?.slice(0, 7).map((date: string, i: number) => ({
      date,
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      high: Math.round(data.daily.temperature_2m_max[i]),
      low: Math.round(data.daily.temperature_2m_min[i]),
      condition: getCondition(data.daily.weather_code[i]),
      precip: data.daily.precipitation_sum[i],
      windMax: Math.round(data.daily.wind_speed_10m_max[i]),
    })) ?? []

    return NextResponse.json({
      current: {
        temp: Math.round(data.current.temperature_2m),
        feelsLike: Math.round(data.current.apparent_temperature),
        windSpeed: Math.round(data.current.wind_speed_10m),
        windGust: Math.round(data.current.wind_gusts_10m),
        windDir: windDirection(data.current.wind_direction_10m),
        condition: getCondition(data.current.weather_code),
        visibility: data.current.visibility,
        precipitation: data.current.precipitation,
      },
      levels,
      clouds: {
        low: cloudLow,
        mid: cloudMid,
        high: cloudHigh,
        baseFt: cloudBaseFt ? Math.round(cloudBaseFt) : null,
      },
      inversion: inversionLikely,
      risk: {
        score: riskScore,
        level: riskLevel,
      },
      forecast,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 })
  }
}
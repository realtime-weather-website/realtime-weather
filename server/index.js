const express = require('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Weather API credentials from environment variables
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

// Check if API credentials are provided
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('❌ 錯誤：請在 .env 檔案中設定 CLIENT_ID 和 CLIENT_SECRET')
  console.error('請參考 .env.example 檔案並到 https://tdx.transportdata.tw/ 申請API金鑰')
  process.exit(1)
}

// Function to get access token
async function getAccessToken() {
  try {
    const response = await axios.post(
      'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    )
    return response.data.access_token
  } catch (error) {
    console.error('Error getting access token:', error)
    throw new Error('Failed to get access token')
  }
}

// Function to fetch weather data
async function fetchWeatherData(city) {
  try {
    const token = await getAccessToken()
    const graphqlEndpoint = 'https://tdx.transportdata.tw/api/cwa/graphql?Authorization=TDX-2A1E325A-C117-4EDB-B4B6-822AACF5088E'

    const query = `
      query forecast {
        forecast(LocationName: "${city}") {
          Locations {
            LocationName
            Temperature {
              Time {
                StartTime
                Temperature
              }
            }
            Weather {
              Time {
                StartTime
                Weather
              }
            }
          }
        }
      }
    `

    const response = await axios.post(
      graphqlEndpoint,
      { query },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )

    const location = response.data?.data?.forecast?.Locations?.[0]
    if (!location) {
      throw new Error('No weather data found for this location')
    }

    const tempData = location?.Temperature?.Time || []
    const weatherData = location?.Weather?.Time || []

    // Process data by date
    const forecastMap = new Map()

    for (let i = 0; i < tempData.length; i++) {
      const date = tempData[i].StartTime.split('T')[0]
      const temp = parseFloat(tempData[i].Temperature)
      const weather = weatherData[i]?.Weather || '無資料'

      if (!forecastMap.has(date)) {
        forecastMap.set(date, { temps: [], weather })
      }
      forecastMap.get(date).temps.push(temp)
    }

    // Convert to array and get 7 days forecast
    const forecast = Array.from(forecastMap.entries())
      .slice(0, 7)
      .map(([date, { temps, weather }]) => {
        const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length)
        return {
          date,
          weather,
          avgTemp
        }
      })

    return forecast
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Weather API Server is running' })
})

app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params
    const weatherData = await fetchWeatherData(city)
    res.json(weatherData)
  } catch (error) {
    console.error('Weather API error:', error)
    res.status(500).json({ 
      error: 'Failed to fetch weather data',
      message: error.message 
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🌤️ Weather API Server is running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
  console.log(`✅ API credentials loaded successfully`)
})

import React, { useState, useEffect } from 'react'
import axios from 'axios'

// 台灣縣市列表
const cities = [
  '連江縣', '金門縣', '宜蘭縣', '新竹縣', '苗栗縣', '彰化縣', '南投縣', '雲林縣',
  '嘉義縣', '屏東縣', '臺東縣', '花蓮縣', '澎湖縣', '基隆市', '新竹市', '嘉義市',
  '臺北市', '高雄市', '新北市', '臺中市', '臺南市', '桃園市'
]

function App() {
  // 狀態管理
  const [selectedCity, setSelectedCity] = useState('臺北市') // 選擇的城市
  const [weatherData, setWeatherData] = useState(null)       // 天氣資料
  const [loading, setLoading] = useState(false)              // 載入狀態
  const [error, setError] = useState(null)                   // 錯誤狀態
  const [darkMode, setDarkMode] = useState(false)            // 深色模式

  // 獲取天氣資料的函數
  const fetchWeather = async (city) => {
    setLoading(true)  // 開始載入
    setError(null)    // 清除錯誤
    
    try {
      // 呼叫後端API獲取天氣資料
      const response = await axios.get(`/api/weather/${encodeURIComponent(city)}`)
      setWeatherData(response.data) // 設定天氣資料
    } catch (err) {
      setError('無法獲取天氣資料，請稍後再試') // 設定錯誤訊息
      console.error('Weather fetch error:', err)
    } finally {
      setLoading(false) // 載入完成
    }
  }

  // 當選擇的城市改變時，重新獲取天氣資料
  useEffect(() => {
    fetchWeather(selectedCity)
  }, [selectedCity])

  // 處理城市選擇變更
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value)
  }

  // 切換深色/淺色模式
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode)
  }

  // 根據天氣狀況動態產生背景漸層
  const getDynamicBackground = () => {
    // 如果沒有天氣資料，返回預設背景
    if (!weatherData || !weatherData[0]) {
      return darkMode 
        ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'          // 深色模式預設
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'          // 淺色模式預設
    }

    const weather = weatherData[0].weather // 取得當前天氣狀況

    if (darkMode) {
      // 深色模式下的背景漸層
      if (weather.includes('晴')) return 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 50%, #581c87 100%)'  // 深藍紫色
      if (weather.includes('雨')) return 'linear-gradient(135deg, #1e293b 0%, #475569 50%, #334155 100%)'  // 深灰藍色
      if (weather.includes('雲')) return 'linear-gradient(135deg, #374151 0%, #4b5563 50%, #6b7280 100%)'  // 深灰色
      if (weather.includes('雪')) return 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)'  // 深灰藍色
      return 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
    } else {
      // 淺色模式下的背景漸層
      if (weather.includes('晴')) return 'linear-gradient(135deg, #fef3c7 0%, #fbbf24 50%, #f59e0b 100%)' // 金黃色
      if (weather.includes('雨')) return 'linear-gradient(135deg, #e0f2fe 0%, #0ea5e9 50%, #0284c7 100%)' // 藍色
      if (weather.includes('雲')) return 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 50%, #94a3b8 100%)' // 灰色
      if (weather.includes('雪')) return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)' // 淺灰色
      return 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
    }
  }

  // 動畫天氣圖示組件
  const AnimatedWeatherIcon = ({ weather, size = '96px' }) => {
    const isLarge = size === '96px'              // 判斷是否為大圖示
    const containerSize = parseInt(size)         // 容器大小
    const iconFontSize = isLarge ? 64 : 32      // emoji大小

    // 根據天氣狀況返回對應的動畫圖示
    const getAnimatedIcon = (weather) => {
      // 晴天 - 旋轉的太陽和光線
      if (weather.includes('晴')) {
        return (
          <div style={{
            position: 'relative',
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            {/* 太陽emoji和光線一起旋轉的容器 */}
            <div style={{
              position: 'relative',
              animation: 'rotate 8s linear infinite',  // 8秒旋轉一圈
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%'
            }}>
              {/* 8條放射狀光線 */}
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{
                  position: 'absolute',
                  width: '2px',                                       // 光線寬度
                  height: isLarge ? '16px' : '12px',                 // 光線長度
                  backgroundColor: '#fbbf24',                        // 金黃色
                  borderRadius: '1px',                               // 圓角
                  top: isLarge ? '6px' : '4px',                      // 距離頂部位置
                  left: '50%',                                       // 水平置中
                  marginLeft: '-1px',                                // 修正置中
                  transformOrigin: `1px ${containerSize * 0.44}px`, // 旋轉中心點
                  transform: `rotate(${i * 45}deg)`,                // 每條光線間隔45度
                  opacity: 0.6,                                      // 透明度
                  boxShadow: '0 0 6px rgba(251, 191, 36, 0.3)'     // 發光效果
                }} />
              ))}
              
              {/* 中心的太陽emoji */}
              <div style={{
                color: '#fbbf24',                                    // 金黃色
                filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))', // 發光效果
                fontSize: `${iconFontSize}px`,                      // 字體大小
                lineHeight: '1',                                     // 行高
                zIndex: 2,                                          // 圖層順序
                position: 'relative'
              }}>☀️</div>
            </div>
          </div>
        )
      }
      
      // 雨天 - 雲朵和下落的雨滴
      if (weather.includes('雨')) {
        return (
          <div style={{
            position: 'relative',
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            {/* 雲朵emoji */}
            <div style={{ 
              color: '#6b7280',                                      // 灰色
              filter: 'drop-shadow(0 0 15px rgba(107, 114, 128, 0.4))', // 陰影效果
              fontSize: `${iconFontSize}px`,
              lineHeight: '1',
              zIndex: 2                                              // 在雨滴之上
            }}>☁️</div>
            
            {/* 動畫雨滴 */}
            {[...Array(isLarge ? 8 : 6)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                width: '2px',                                        // 雨滴寬度
                height: isLarge ? '10px' : '8px',                   // 雨滴長度
                backgroundColor: '#3b82f6',                          // 藍色
                borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',  // 雨滴形狀
                left: `${20 + i * (60 / (isLarge ? 8 : 6))}%`,     // 水平分佈
                top: isLarge ? '80%' : '75%',                       // 垂直位置
                animation: `rain ${0.6 + (i % 3) * 0.2}s linear infinite`, // 下落動畫
                animationDelay: `${i * 0.1}s`,                     // 延遲時間
                opacity: 0.9,                                        // 透明度
                boxShadow: '0 0 4px rgba(59, 130, 246, 0.4)',      // 發光效果
                zIndex: 1                                            // 在雲朵之下
              }} />
            ))}
          </div>
        )
      }
      
      // 多雲 - 浮動的雲朵
      if (weather.includes('雲')) {
        return (
          <div style={{
            position: 'relative',
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            <div style={{
              animation: 'float 4s ease-in-out infinite',           // 上下浮動動畫
              color: '#9ca3af',                                      // 淺灰色
              filter: 'drop-shadow(0 0 15px rgba(156, 163, 175, 0.4))',
              fontSize: `${iconFontSize}px`,
              lineHeight: '1'
            }}>☁️</div>
          </div>
        )
      }
      
      // 雷雨 - 閃爍的雲朵和閃電
      if (weather.includes('雷')) {
        return (
          <div style={{
            position: 'relative',
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            {/* 雷雨雲 */}
            <div style={{
              animation: 'thunder 2s ease-in-out infinite',         // 閃爍動畫
              color: '#374151',                                      // 深灰色
              filter: 'drop-shadow(0 0 20px rgba(55, 65, 81, 0.6))',
              fontSize: `${iconFontSize}px`,
              lineHeight: '1',
              zIndex: 2
            }}>⛈️</div>
            
            {/* 閃電效果 */}
            <div style={{
              position: 'absolute',
              width: '4px',
              height: isLarge ? '24px' : '16px',                    // 閃電高度
              backgroundColor: '#fbbf24',                            // 金黃色
              left: '58%',                                           // 水平位置
              top: isLarge ? '70%' : '65%',                         // 垂直位置
              animation: 'lightning 2s ease-in-out infinite',       // 閃電動畫
              clipPath: 'polygon(20% 0%, 40% 0%, 30% 60%, 70% 60%, 10% 100%, 0% 100%, 20% 40%, 10% 40%)', // 閃電形狀
              opacity: 0,                                            // 預設透明
              boxShadow: '0 0 12px rgba(251, 191, 36, 0.8)',       // 發光效果
              zIndex: 1
            }} />
          </div>
        )
      }
      
      // 雪天 - 雪花和飄落的雪片
      if (weather.includes('雪')) {
        return (
          <div style={{
            position: 'relative',
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto'
          }}>
            {/* 雪雲 */}
            <div style={{ 
              color: '#e5e7eb',                                      // 淺灰色
              filter: 'drop-shadow(0 0 15px rgba(229, 231, 235, 0.6))',
              fontSize: `${iconFontSize}px`,
              lineHeight: '1',
              zIndex: 2
            }}>❄️</div>
            
            {/* 飄落的雪花 */}
            {[...Array(isLarge ? 6 : 4)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                color: '#e5e7eb',                                    // 淺灰色
                fontSize: isLarge ? '14px' : '10px',                // 雪花大小
                left: `${15 + i * (70 / (isLarge ? 6 : 4))}%`,     // 水平分佈
                top: '10%',                                          // 頂部位置
                animation: `snow ${2 + (i % 3) * 0.5}s linear infinite`, // 飄落動畫
                animationDelay: `${i * 0.4}s`,                     // 延遲時間
                filter: 'drop-shadow(0 0 4px rgba(229, 231, 235, 0.6))',
                zIndex: 1
              }}>❄</div>
            ))}
          </div>
        )
      }
      
      // 預設 - 部分多雲
      return (
        <div style={{
          position: 'relative',
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto'
        }}>
          <div style={{
            animation: 'float 4s ease-in-out infinite',             // 浮動動畫
            color: '#fbbf24',                                        // 金黃色
            filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.4))',
            fontSize: `${iconFontSize}px`,
            lineHeight: '1'
          }}>🌤️</div>
        </div>
      )
    }

    return getAnimatedIcon(weather)
  }

  // 格式化日期顯示
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // 判斷是今天、明天還是其他日期
    if (date.toDateString() === today.toDateString()) {
      return '今天'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return '明天'
    } else {
      return date.toLocaleDateString('zh-TW', { weekday: 'short' }) // 顯示星期幾
    }
  }

  // 玻璃擬態卡片樣式
  const getCardStyle = () => ({
    background: darkMode 
      ? 'rgba(30, 41, 59, 0.7)'      // 深色模式背景
      : 'rgba(255, 255, 255, 0.8)',  // 淺色模式背景
    backdropFilter: 'blur(20px)',                    // 背景模糊效果
    WebkitBackdropFilter: 'blur(20px)',              // Safari支援
    borderRadius: '16px',                            // 圓角
    border: darkMode 
      ? '1px solid rgba(148, 163, 184, 0.2)'        // 深色模式邊框
      : '1px solid rgba(255, 255, 255, 0.3)',       // 淺色模式邊框
    boxShadow: darkMode
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'            // 深色模式陰影
      : '0 8px 32px rgba(31, 38, 135, 0.1)',       // 淺色模式陰影
    transition: 'all 0.3s ease'                      // 過渡動畫
  })

  // 文字顏色變數
  const textColor = darkMode ? '#f8fafc' : '#1f2937'           // 主要文字顏色
  const secondaryTextColor = darkMode ? '#cbd5e1' : '#6b7280'  // 次要文字顏色
  const mutedTextColor = darkMode ? '#94a3b8' : '#9ca3af'      // 淡化文字顏色

  return (
    <div style={{
      minHeight: '100vh',                            // 最小高度為螢幕高度
      background: getDynamicBackground(),            // 動態背景
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', // 字體
      transition: 'background 0.5s ease'            // 背景變化動畫
    }}>
      <div style={{
        maxWidth: '1200px',                          // 最大寬度
        margin: '0 auto',                            // 水平置中
        padding: '0 20px'                            // 左右內距
      }}>
        
        {/* 頁面標題和控制項 */}
        <header style={{ padding: '32px 0' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',                        // 響應式換行
            gap: '20px'
          }}>
            {/* 應用標題 */}
            <h1 style={{
              fontSize: 'clamp(28px, 5vw, 36px)',   // 響應式字體大小
              fontWeight: '700',
              color: textColor,
              margin: '0',
              transition: 'color 0.3s ease'
            }}>天氣</h1>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '16px'
            }}>
              {/* 深色模式切換按鈕 */}
              <button
                onClick={toggleDarkMode}
                className="dark-mode-toggle"
                style={{
                  ...getCardStyle(),
                  padding: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              
              {/* 城市選擇下拉選單 */}
              <div style={{ position: 'relative' }}>
                <select
                  value={selectedCity}
                  onChange={handleCityChange}
                  style={{
                    ...getCardStyle(),
                    appearance: 'none',              // 移除預設樣式
                    padding: '14px 45px 14px 18px',
                    color: textColor,
                    cursor: 'pointer',
                    fontSize: '16px',
                    outline: 'none',
                    minWidth: '150px',
                    border: 'none'
                  }}
                >
                  {cities.map((city) => (
                    <option key={city} value={city} style={{
                      backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                      color: darkMode ? '#f8fafc' : '#1f2937'
                    }}>
                      {city}
                    </option>
                  ))}
                </select>
                {/* 下拉箭頭 */}
                <div style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',            // 不接收滑鼠事件
                  color: mutedTextColor,
                  transition: 'color 0.3s ease'
                }}>
                  ▼
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 載入狀態 */}
        {loading && (
          <div style={{
            ...getCardStyle(),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px 40px',
            color: secondaryTextColor,
            margin: '20px 0',
            textAlign: 'center'
          }}>
            {/* 載入動畫 */}
            <div style={{
              width: '40px',
              height: '40px',
              border: `3px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
              borderTop: `3px solid #3b82f6`,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <p style={{ fontSize: '18px', fontWeight: '500', margin: '0' }}>載入天氣資料...</p>
          </div>
        )}

        {/* 錯誤狀態 */}
        {error && (
          <div style={{ margin: '20px 0' }}>
            <div style={{
              ...getCardStyle(),
              padding: '40px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>⚠️</div>
              <h3 style={{
                color: '#ef4444',                  // 紅色
                fontWeight: '600',
                marginBottom: '16px',
                fontSize: '22px',
                margin: '0 0 16px 0'
              }}>載入失敗</h3>
              <p style={{
                color: secondaryTextColor,
                fontSize: '16px',
                marginBottom: '24px',
                margin: '0 0 24px 0'
              }}>{error}</p>
              {/* 重試按鈕 */}
              <button
                onClick={() => fetchWeather(selectedCity)}
                className="retry-button"
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '14px 36px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                }}
              >
                重新載入
              </button>
            </div>
          </div>
        )}

        {/* 主要天氣內容 */}
        {weatherData && !loading && !error && (
          <div style={{ animation: 'fadeIn 0.5s ease-in' }}>
            
            {/* 當前天氣卡片 */}
            {weatherData[0] && (
              <div 
                className="main-weather-card"
                style={{
                  ...getCardStyle(),
                  padding: 'clamp(32px, 6vw, 48px)',  // 響應式內距
                  marginBottom: '32px',
                  textAlign: 'center'
                }}>
                {/* 城市名稱 */}
                <h2 style={{
                  fontSize: 'clamp(22px, 4vw, 30px)',
                  fontWeight: '700',
                  color: textColor,
                  marginBottom: '40px',
                  transition: 'color 0.3s ease',
                  margin: '0 0 40px 0'
                }}>{selectedCity}</h2>
                
                {/* 天氣圖示 */}
                <div style={{ marginBottom: '32px' }}>
                  <AnimatedWeatherIcon weather={weatherData[0].weather} size="96px" />
                </div>
                
                {/* 溫度顯示 */}
                <div style={{
                  fontSize: 'clamp(60px, 15vw, 96px)', // 響應式超大字體
                  fontWeight: '200',                    // 細字體
                  color: textColor,
                  marginBottom: '20px',
                  transition: 'color 0.3s ease',
                  lineHeight: '1',
                  margin: '0 0 20px 0'
                }}>{weatherData[0].avgTemp}°</div>
                
                {/* 天氣描述 */}
                <p style={{
                  fontSize: 'clamp(18px, 4vw, 24px)',
                  color: secondaryTextColor,
                  marginBottom: '16px',
                  fontWeight: '500',
                  transition: 'color 0.3s ease',
                  margin: '0 0 16px 0'
                }}>{weatherData[0].weather}</p>
                
                {/* 日期 */}
                <p style={{
                  fontSize: '16px',
                  color: mutedTextColor,
                  transition: 'color 0.3s ease',
                  margin: '0'
                }}>
                  {new Date().toLocaleDateString('zh-TW', {
                    month: 'long',    // 完整月份名稱
                    day: 'numeric',   // 日期數字
                    weekday: 'long'   // 完整星期名稱
                  })}
                </p>
              </div>
            )}

            {/* 7日預報卡片 */}
            <div 
              className="forecast-card"
              style={{
                ...getCardStyle(),
                marginBottom: '32px',
                overflow: 'hidden'
              }}>
              {/* 預報標題 */}
              <div style={{
                padding: '28px',
                borderBottom: darkMode ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(229, 231, 235, 0.5)'
              }}>
                <h3 style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: textColor,
                  margin: '0',
                  transition: 'color 0.3s ease'
                }}>7日預報</h3>
              </div>
              
              {/* 預報清單 - 修正對齊問題 */}
              <div style={{ padding: '20px' }}>
                {weatherData.map((day, index) => (
                  <div 
                    key={index} 
                    className="forecast-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',              // 垂直置中對齊
                      justifyContent: 'space-between',
                      padding: '18px 16px',
                      borderBottom: index < weatherData.length - 1 ? (darkMode ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(243, 244, 246, 0.8)') : 'none',
                      borderRadius: '12px',
                      margin: '6px 0',
                      transition: 'all 0.3s ease',
                      minHeight: '70px'                  // 設定最小高度確保對齊
                    }}>
                    {/* 左側內容區域 */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',              // 確保所有元素垂直置中
                      flex: '1', 
                      gap: '20px' 
                    }}>
                      {/* 日期 - 固定寬度確保對齊 */}
                      <div style={{
                        width: '60px',                   // 固定寬度
                        color: textColor,
                        fontWeight: '600',
                        fontSize: '15px',
                        transition: 'color 0.3s ease',
                        textAlign: 'center',             // 文字置中
                        display: 'flex',                 // 使用flex確保垂直置中
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {formatDate(day.date)}
                      </div>
                      
                      {/* 天氣圖示 - 置中對齊 */}
                      <div style={{ 
                        width: '50px',                   // 固定寬度
                        display: 'flex', 
                        alignItems: 'center',            // 垂直置中
                        justifyContent: 'center'         // 水平置中
                      }}>
                        <AnimatedWeatherIcon weather={day.weather} size="48px" />
                      </div>
                      
                      {/* 天氣描述 */}
                      <div style={{
                        flex: '1',
                        color: secondaryTextColor,
                        fontSize: '16px',
                        transition: 'color 0.3s ease',
                        display: 'flex',                 // 使用flex確保垂直置中
                        alignItems: 'center'
                      }}>
                        {day.weather}
                      </div>
                    </div>
                    
                    {/* 溫度 - 右側對齊 */}
                    <div style={{
                      fontSize: '22px',
                      fontWeight: '600',
                      color: textColor,
                      transition: 'color 0.3s ease',
                      width: '60px',                     // 固定寬度
                      textAlign: 'center',               // 文字置中
                      display: 'flex',                   // 使用flex確保垂直置中
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {day.avgTemp}°
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 溫度統計卡片 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', // 響應式網格
              gap: '24px',
              marginBottom: '40px'
            }}>
              {/* 最高溫度卡片 */}
              <div 
                className="temp-card"
                style={{
                  ...getCardStyle(),
                  padding: '36px',
                  textAlign: 'center'
                }}>
                <div style={{
                  fontSize: 'clamp(44px, 10vw, 64px)',
                  fontWeight: '200',
                  color: '#ef4444',                   // 紅色表示高溫
                  marginBottom: '16px',
                  lineHeight: '1',
                  margin: '0 0 16px 0'
                }}>
                  {Math.max(...weatherData.map(d => d.avgTemp))}°
                </div>
                <p style={{ 
                  color: textColor, 
                  fontWeight: '600',
                  fontSize: '18px',
                  transition: 'color 0.3s ease',
                  margin: '0 0 8px 0'
                }}>最高溫度</p>
                <p style={{ 
                  color: mutedTextColor, 
                  fontSize: '14px', 
                  margin: '0',
                  transition: 'color 0.3s ease'
                }}>本週最高</p>
              </div>
              
              {/* 最低溫度卡片 */}
              <div 
                className="temp-card"
                style={{
                  ...getCardStyle(),
                  padding: '36px',
                  textAlign: 'center'
                }}>
                <div style={{
                  fontSize: 'clamp(44px, 10vw, 64px)',
                  fontWeight: '200',
                  color: '#3b82f6',                   // 藍色表示低溫
                  marginBottom: '16px',
                  lineHeight: '1',
                  margin: '0 0 16px 0'
                }}>
                  {Math.min(...weatherData.map(d => d.avgTemp))}°
                </div>
                <p style={{ 
                  color: textColor, 
                  fontWeight: '600',
                  fontSize: '18px',
                  transition: 'color 0.3s ease',
                  margin: '0 0 8px 0'
                }}>最低溫度</p>
                <p style={{ 
                  color: mutedTextColor, 
                  fontSize: '14px', 
                  margin: '0',
                  transition: 'color 0.3s ease'
                }}>本週最低</p>
              </div>
            </div>

            {/* 頁面底部資訊 */}
            <div style={{
              textAlign: 'center',
              paddingBottom: '48px'
            }}>
              <div style={{
                ...getCardStyle(),
                padding: '24px',
                display: 'inline-block'
              }}>
                {/* 資料來源 */}
                <p style={{
                  color: mutedTextColor,
                  fontSize: '13px',
                  margin: '0 0 8px 0',
                  transition: 'color 0.3s ease'
                }}>
                  資料來源：中央氣象署
                </p>
                {/* 更新時間 */}
                <p style={{
                  color: mutedTextColor,
                  fontSize: '13px',
                  margin: '0',
                  transition: 'color 0.3s ease'
                }}>
                  最後更新：{new Date().toLocaleString('zh-TW')}
                </p>
              </div>
            </div>
            
          </div>
        )}
      </div>

      {/* CSS動畫和樣式 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          /* 基本動畫定義 */
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-6px); }
          }
          
          @keyframes rain {
            0% { 
              transform: translateY(-15px); 
              opacity: 0.8; 
            }
            50% { 
              opacity: 1; 
            }
            100% { 
              transform: translateY(40px); 
              opacity: 0; 
            }
          }
          
          @keyframes snow {
            0% { 
              transform: translateY(-20px) rotate(0deg); 
              opacity: 0.8; 
            }
            50% { 
              opacity: 1; 
            }
            100% { 
              transform: translateY(80px) rotate(360deg); 
              opacity: 0; 
            }
          }
          
          @keyframes thunder {
            0%, 90%, 100% { 
              transform: scale(1); 
              filter: drop-shadow(0 0 20px rgba(55, 65, 81, 0.6));
            }
            95% { 
              transform: scale(1.08); 
              filter: drop-shadow(0 0 30px rgba(55, 65, 81, 0.9));
            }
          }
          
          @keyframes lightning {
            0%, 85%, 100% { 
              opacity: 0; 
            }
            90%, 95% { 
              opacity: 1; 
            }
          }
          
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          
          /* 滑鼠懸停效果 */
          .dark-mode-toggle:hover {
            transform: scale(1.05) !important;
          }
          
          .retry-button:hover {
            background-color: #dc2626 !important;
            transform: translateY(-2px) !important;
          }
          
          .main-weather-card:hover {
            transform: translateY(-4px) !important;
          }
          
          .forecast-card:hover {
            transform: translateY(-2px) !important;
          }
          
          .forecast-item:hover {
            background-color: ${darkMode ? 'rgba(51, 65, 85, 0.4)' : 'rgba(248, 250, 252, 0.7)'} !important;
            transform: scale(1.01) !important;
          }
          
          .temp-card:hover {
            transform: translateY(-4px) scale(1.02) !important;
          }
          
          /* 手機版響應式設計 */
          @media (max-width: 768px) {
            * {
              touch-action: manipulation; /* 改善觸控體驗 */
            }
          }
          
          /* 平滑滾動 */
          html {
            scroll-behavior: smooth;
          }
          
          /* 無障礙設計 - 焦點樣式 */
          button:focus,
          select:focus {
            outline: 2px solid #3b82f6;
            outline-offset: 2px;
          }
        `
      }} />
    </div>
  )
}

export default App

# 台灣即時天氣 Taiwan Real-time Weather

一個現代化的台灣天氣查詢應用程式，使用 React、Node.js、Express 和 Tailwind CSS 構建。

## 功能特色

- 🌤️ 即時天氣資料
- 📱 響應式設計，支援手機和桌面
- 🎨 現代化 UI 設計（使用 Tailwind CSS）
- 🌧️ 7 天天氣預報
- 🏙️ 支援台灣所有縣市
- ⚡ 快速載入和更新

## 技術棧

- **前端**: React 19, Vite, Tailwind CSS
- **後端**: Node.js, Express
- **HTTP 客戶端**: Axios
- **資料來源**: 交通部中央氣象署 API

## 安裝與設定

### 前置需求

- Node.js 16 或更高版本
- npm 或 yarn

### 安裝步驟

1. 克隆專案
```bash
git clone <your-repo-url>
cd realtime-weather
```

2. 安裝依賴
```bash
npm install
```

3. 環境變數設定
專案已包含 `.env` 檔案與預設的 API 憑證

4. 啟動開發伺服器
```bash
# 同時啟動前端和後端
npm start

# 或分別啟動
npm run server  # 後端伺服器 (port 5000)
npm run dev     # 前端開發伺服器 (port 3000)
```

5. 開啟瀏覽器
訪問 http://localhost:3000

## 可用指令

- `npm start` - 同時啟動前端和後端開發伺服器
- `npm run dev` - 啟動前端開發伺服器
- `npm run server` - 啟動後端伺服器
- `npm run build` - 建構生產版本
- `npm run preview` - 預覽建構後的應用

## API 端點

### 後端 API (Port 5000)

- `GET /api/health` - 健康檢查
- `GET /api/weather/:city` - 獲取指定城市的天氣資料

### 前端 (Port 3000)

Vite 開發伺服器會自動代理 `/api` 請求到後端伺服器。

## 專案結構

```
realtime-weather/
├── src/                  # React 前端源碼
│   ├── App.jsx          # 主要 React 組件
│   ├── main.jsx         # React 入口點
│   └── index.css        # 全域樣式和 Tailwind
├── server/              # Node.js 後端
│   └── index.js         # Express 伺服器
├── public/              # 靜態資源
├── index.html           # HTML 模板
├── package.json         # 專案依賴和腳本
├── vite.config.js       # Vite 配置
├── tailwind.config.js   # Tailwind CSS 配置
└── .env                 # 環境變數
```

## 支援的縣市

- 直轄市：臺北市、新北市、桃園市、臺中市、臺南市、高雄市
- 省轄市：基隆市、新竹市、嘉義市
- 縣：新竹縣、苗栗縣、彰化縣、南投縣、雲林縣、嘉義縣、屏東縣、宜蘭縣、花蓮縣、臺東縣、澎湖縣、金門縣、連江縣

## 開發說明

### 添加新功能

1. 前端組件位於 `src/` 目錄
2. 後端 API 路由位於 `server/index.js`
3. 使用 Tailwind CSS 進行樣式設計

### 部署

1. 建構前端：`npm run build`
2. 部署 `dist/` 目錄和 `server/` 目錄
3. 設定環境變數
4. 啟動伺服器：`npm run server`

## 授權

MIT License

## 資料來源

本應用使用交通部中央氣象署提供的天氣資料。

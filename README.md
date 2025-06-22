# 🌤️ 即時氣象查詢系統

一個精美的即時天氣預報應用，提供台灣各縣市的7日天氣預報。

![天氣應用截圖](screenshot.JPG)

## ✨ 功能特色

- 🌞 動畫天氣圖示（旋轉太陽、下落雨滴、飄落雪花）
- 🎨 動態背景漸層根據天氣變化
- 🌙 深色/淺色模式切換
- 📱 完全響應式設計
- 📊 7日天氣預報
- 🌡️ 溫度統計

## 🚀 快速開始

1. **安裝依賴**
   ```bash
   npm install
   ```

2. **設定環境變數**
   
   複製 `.env.example` 為 `.env`，並填入你的API金鑰：
   ```env
   CLIENT_ID=你的CLIENT_ID
   CLIENT_SECRET=你的CLIENT_SECRET
   ```

3. **啟動應用**
   ```bash
   npm start
   ```

4. 訪問 `http://localhost:3000`

## 🔑 API金鑰申請

前往 [TDX運輸資料流通服務平台](https://tdx.transportdata.tw/) 申請API金鑰。

## 🛠️ 技術棧

- **前端**: React 19, Vite, CSS-in-JS
- **後端**: Express.js, Node.js
- **API**: 交通部TDX氣象API

## 📝 可用指令

```bash
npm start     # 啟動前後端
npm run dev   # 僅前端
npm run server # 僅後端
npm run build # 構建
```

## 📄 授權

MIT License

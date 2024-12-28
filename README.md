
# GuiTab – Guitar Pro Tabs Scraper and Viewer

GuiTab is a full-stack web application designed to scrape, download, and display guitar pro tabs (`.gp3/.gp4/.gp5` files) from popular tab-sharing websites.  
It features real-time tab search and preview, WebSocket streaming, and tab visualization powered by AlphaTab.

---

## 📂 Project Structure
```
GuiTab/
│
├── Backend/                   # Express.js backend with Puppeteer
│   ├── src/                   # Source code for backend
│   │   ├── app.ts             # Main entry point (server setup)
│   │   ├── controllers/       # API controllers (file download, scraping)
│   │   ├── services/          # Puppeteer scraping logic
│   │   ├── models/            # Data models (TabModel, Errors)
│   │   └── middleware/        # Error handling middleware
│   ├── package.json           # Backend dependencies
│   ├── dockerfile             # Dockerfile for backend
│   └── tsconfig.json          # TypeScript configuration
│
├── Frontend/                  # React + TypeScript frontend
│   ├── public/                # Static files (index.html, icons, manifest.json)
│   ├── src/                   # React source code
│   │   ├── Components/        # React components (TabViewer, Layout, Menu)
│   │   ├── Services/          # API services (WebSocket, Tab fetching)
│   │   ├── Utils/             # Utility hooks and configurations
│   │   └── index.tsx          # React entry point
│   ├── package.json           # Frontend dependencies
│   ├── dockerfile             # Dockerfile for frontend (NGINX)
│   └── tailwind.config.js     # TailwindCSS configuration
│
└── docker-compose.yml         # Docker Compose setup for multi-container deployment
```

---

## 🚀 Features
- **Scrape Guitar Pro Tabs** – Fetch `.gp3/.gp4/.gp5` tabs from external websites using Puppeteer.
- **Real-time Tab Search** – Tabs load progressively via WebSocket streaming.
- **Tab Viewer** – Visualize guitar pro tabs directly in the browser using AlphaTab.
- **File Download** – Tabs are downloadable directly from the UI.
- **Responsive Design** – TailwindCSS-powered responsive UI.

---

## 🛠️ Technologies Used
- **Frontend**: React, TypeScript, TailwindCSS  
- **Backend**: Node.js, Express.js, Puppeteer, Socket.IO  
- **Visualization**: AlphaTab  
- **Build Tools**: Webpack, Docker, Jest (Testing)  
- **Database**: MySQL (planned)

---

## ⚙️ Setup and Installation

### 1. Clone the Repository
```bash
git clone https://github.com/YourRepo/GuiTab.git
cd GuiTab
```

### 2. Backend Setup
```bash
cd Backend
cp .env.example .env  # Configure MySQL and app settings
npm install
npm run start  # Starts the server at http://localhost:4000
```

### 3. Frontend Setup
```bash
cd ../Frontend
npm install
npm start  # Starts the development server at http://localhost:3000
```

### 4. Docker Setup (Optional)
```bash
docker-compose up --build
```

---

## 🔧 Configuration

### `.env` (Backend)
```env
PORT=4000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=guitab
```

### `.env` (Frontend)
```env
REACT_APP_BASE_URL=http://localhost:4000/
```

---

## 📜 API Endpoints

| Method | Endpoint                          | Description                          |
|--------|-----------------------------------|--------------------------------------|
| GET    | /api/tabs/search?query={song}     | Search for tabs                      |
| GET    | /api/tab-file/{filename}          | Download a tab file                  |
| GET    | /api/tabs/recent                  | List recently downloaded tabs        |

---

## 🐳 Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./Backend
    ports:
      - "4000:4000"
    env_file:
      - ./Backend/.env

  frontend:
    build: ./Frontend
    ports:
      - "3000:3000"
```

---

## ✅ Testing
```bash
cd Backend
npm test

cd ../Frontend
npm test
```

---

## 🔍 Known Issues and Limitations
- **Scraping Limits** – Some websites implement anti-scraping measures. Puppeteer settings can be adjusted to bypass basic protections.  
- **Tab Visualization** – AlphaTab supports most guitar pro formats but may have rendering inconsistencies.

---

## 📄 License
MIT License – Free to use and modify.

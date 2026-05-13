# Beginner-Friendly Next.js Bike Demand App

This project is a **Next.js + Tailwind CSS** beginner-friendly app.
Users enter a place name, short place description, and weather values (temperature, humidity, windspeed, holiday, working day), then the app shows estimated bike rental demand output with place-based differences.

## Run on Windows PowerShell

### 1) Open PowerShell and clone the repository
```powershell
cd "$HOME"
git clone https://github.com/Nobel789/END-to-end-ml-model-and-deployment.git
cd .\END-to-end-ml-model-and-deployment
```

### 2) Check Node.js and npm
```powershell
node -v
npm -v
```
Use an active Node.js LTS release (for example Node.js 24 LTS).

### 3) Install dependencies
```powershell
npm install
```

### 4) Start development server
```powershell
npm run dev
```

### 5) Open the app
Go to: `http://localhost:3000`

## Common PowerShell Issues

### `cd : Cannot find path`
You are in the wrong folder. Use:
```powershell
cd "$HOME"
Get-ChildItem -Directory
```
Then `cd` into the exact repo folder name.

### `npm : File cannot be loaded because running scripts is disabled`
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```
Then close/reopen PowerShell.

### `npm install` returns 403/407/proxy errors
Check if your network, VPN, or organization proxy blocks npm registry access.

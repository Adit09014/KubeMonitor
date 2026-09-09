# 1. Install System Prerequisites (Run in PowerShell as Administrator)
# winget install GoLang.Go
# winget install OpenJS.NodeJS.LTS

# 2. Setup Environment Files
Set-Content -Path "server-go/.env" -Value "REMOTE_CLUSTER_API=http://140.238.166.160:8080"
Set-Content -Path "client/.env" -Value @"
VITE_API_URL=http://localhost:8080
VITE_REMOTE_CLUSTER_URL=http://140.238.166.160:8080
"@

# 3. Install Backend Dependencies
cd server-go
go mod download
cd ..

# 4. Install Frontend Dependencies
cd client
npm install
cd ..

Write-Host "Installation completed successfully!" -ForegroundColor Green
Write-Host "To run backend:  cd server-go; go run .\main.go"
Write-Host "To run frontend: cd client; npm run dev"

# KubePulse - Setup & Migration Guide

A step-by-step guide to transfer, install dependencies, and run KubePulse on another PC (Windows, macOS, or Linux).

---

## 1. Prerequisites (Software to Install)

Before running the project, install **Go** and **Node.js**:

### On Windows
You can install both quickly using `winget` in PowerShell (Admin), or download the installers:

```powershell
# Install Go (Golang)
winget install GoLang.Go

# Install Node.js (LTS version)
winget install OpenJS.NodeJS.LTS

# Install Git (Optional, if transferring via Git)
winget install Git.Git
```
*Alternatively, download manually:*
- **Go (Golang >= 1.21)**: [https://go.dev/dl/](https://go.dev/dl/)
- **Node.js (>= 18 or 20 LTS)**: [https://nodejs.org/](https://nodejs.org/)

> **Note on SQLite**: The backend uses pure-Go SQLite (`github.com/glebarez/sqlite`). You do **not** need GCC, MinGW, or any C/C++ compiler.

---

## 2. Transferring the Project Files

### Option A: Via Git
```bash
git clone <your-repository-url>
cd "PROJECT I"
```

### Option B: Via USB / ZIP Archive
If copying manually, you can delete or exclude `client/node_modules/` to make the file size much smaller and transfer faster.

---

## 3. Environment Variables Configuration

Create the `.env` files on the new machine (these are omitted from Git for security).

### A. Backend Configuration: `server-go/.env`
Create a file at `server-go/.env` with the following content:

```env
REMOTE_CLUSTER_API=http://140.238.166.160:8080
```

*PowerShell one-liner to create it:*
```powershell
Set-Content -Path "server-go/.env" -Value "REMOTE_CLUSTER_API=http://140.238.166.160:8080"
```

### B. Frontend Configuration: `client/.env`
Create a file at `client/.env` with the following content:

```env
VITE_API_URL=http://localhost:8080
VITE_REMOTE_CLUSTER_URL=http://140.238.166.160:8080
```

*PowerShell one-liner to create it:*
```powershell
Set-Content -Path "client/.env" -Value @"
VITE_API_URL=http://localhost:8080
VITE_REMOTE_CLUSTER_URL=http://140.238.166.160:8080
"@
```

---

## 4. Install Dependencies & Run

Open two separate terminals (PowerShell or Bash):

### Terminal 1: Start Backend (`server-go`)

```powershell
# 1. Navigate to the backend directory
cd server-go

# 2. Download and verify Go dependencies
go mod download

# 3. Start the Go server
go run .\main.go
```

**Expected Output:**
```
Connected to SQLite database: kubepulse.db
Database migrations completed successfully
Go Server listening on :8080
```

---

### Terminal 2: Start Frontend (`client`)

```powershell
# 1. Navigate to the frontend directory
cd client

# 2. Install npm packages
npm install

# 3. Start the Vite development server
npm run dev
```

**Expected Output:**
```
  VITE v8.2.2  ready in 240 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

---

## 5. Accessing the Application

1. Open your web browser and go to:
   ```
   http://localhost:5173
   ```
2. Click **"Need an account? Register"** to create an initial user.
3. Once logged in, you will be redirected to the **Overview** dashboard.
4. All routes (`/nodes`, `/pods`, `/deployments`, `/services`, `/namespaces`, `/metrics`, `/rbac`, `/alerts`, `/logs`, `/events`, `/yaml`, `/settings`) are fully active.

---

## 6. Verification & Health Checks

To verify backend connectivity from the terminal:

```powershell
# Test backend health
curl.exe http://localhost:8080/api/health
# Expected: {"message":"Go backend running","status":"ok"}

# Test cluster proxy connectivity
curl.exe http://localhost:8080/api/cluster/info
# Expected: {"deployments":9,"namespaces":5,"nodes":1,"pods":15,"services":18,"version":"v1.36.4+k3s1"}
```

---

## 7. Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `port 8080 already in use` | Another process is using port 8080. | Stop the old process (`Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess \| Stop-Process`). |
| `Failed to connect to cluster` | Remote VM unreachable or no internet. | Ensure the machine has an active internet connection to ping `http://140.238.166.160:8080/api/cluster/info`. |
| `Uncaught SyntaxError in browser` | Node packages out of date. | Run `npm install` inside the `client` directory. |
| Session lost on reload | Cookies blocked by browser. | Ensure your browser allows cookies on `localhost:5173`. `axios.defaults.withCredentials = true` is configured out of the box. |

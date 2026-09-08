# Kubemonitor Backend Handover

## Overview
The KubeMonitor Go backend is set up and functional. The core API routes are defined, but there are a few remaining integrations and adjustments needed from the team to make it fully complete.

## Things to be Implemented / Adjusted
1. **Cluster API Local Fallback**: The cluster endpoints (`api/cluster/handlers.go`) currently try to use in-cluster config, and fallback to the hardcoded VM kubeconfig path (`/etc/rancher/k3s/k3s.yaml`). For local development to work seamlessly off the VM, update the fallback to check the standard local config (`~/.kube/config`).
2. **RBAC Auth Middleware**: The `/api/rbac/*` endpoints are defined but currently unprotected. You need to implement and attach the Auth Middleware to these routes (as noted by the `// TODO` in `main.go`).
3. **Frontend Integration**: Hook up the React frontend components to use these newly available REST API endpoints for displaying cluster information, metrics, and RBAC rules.
4. **Metrics-Server Integration**: The `/api/cluster/metrics` endpoint currently returns valid capacities but simulated `0` for actual resource usage. To retrieve actual CPU/memory usage, integrate the backend with the Kubernetes `metrics-server`.

## Available API Endpoints

When running locally, the backend serves requests at `http://127.0.0.1:8080/api/`.

### General
- **`GET /api/health`**
  - **Description**: Health check endpoint.
  - **Example Response**: `{"message":"Go backend running","status":"ok"}`

### Authentication
- **`POST /api/auth/login`**
  - **Description**: Authenticate a user and receive a token.
  - **Payload**: `{"username": "...", "password": "..."}`
- **`POST /api/auth/register`**
  - **Description**: Register a new user.
  - **Payload**: `{"name": "...", "username": "...", "email": "...", "password": "..."}`

### Cluster Telemetry
*(Note: Hitting these locally without a valid `kubeconfig` or in-cluster access will result in an error)*
- **`GET /api/cluster/info`**
  - **Description**: Returns the cluster version and counts of nodes, pods, deployments, services, and namespaces.
- **`GET /api/cluster/metrics`**
  - **Description**: Returns cluster-wide CPU and memory capacity.
- **`GET /api/cluster/nodes`**
  - **Description**: Returns a detailed list of nodes, including readiness status and allocatable resources.

### RBAC 
- **`GET /api/rbac/roles`**
  - **Description**: Fetches the list of Kubernetes roles.
- **`GET /api/rbac/bindings`**
  - **Description**: Fetches the list of Kubernetes role bindings.

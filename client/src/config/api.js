// Centralized API configuration from environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const REMOTE_CLUSTER_URL = import.meta.env.VITE_REMOTE_CLUSTER_URL || API_BASE_URL;

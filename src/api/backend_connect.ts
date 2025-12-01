// src/api/beckend_connect.ts

import axios from "axios";

const loadingListeners: Array<(isLoading: boolean) => void> = [];

export const subscribeLoading = (callback: (isLoading: boolean) => void) => {
  loadingListeners.push(callback);
  return () => {
    const index = loadingListeners.indexOf(callback);
    if (index > -1) loadingListeners.splice(index, 1);
  };
};

let activeRequests = 0;
let loadingTimer: NodeJS.Timeout | null = null;
const showLoading = () => {
  loadingListeners.forEach(cb => cb(true));
};

const hideLoading = () => {
  if (loadingTimer) {
    clearTimeout(loadingTimer);
    loadingTimer = null;
  }
  loadingListeners.forEach(cb => cb(false));
};

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  activeRequests++;
  if (activeRequests === 1) {
    loadingTimer = setTimeout(showLoading, 1000); // ← 整整 1000ms 後才顯示！
  }

  return config;
}
);

api.interceptors.response.use(
  response => {
    activeRequests--;
    if (activeRequests === 0) {
      hideLoading();
    }
    return response;
  },
  error => {
    activeRequests--;
    if (activeRequests === 0) {
      hideLoading();
    }
    return Promise.reject(error);
  }
);

export const API = api;
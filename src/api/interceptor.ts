import { useAuthStore } from "../store/useAuthStore";
import { getTimeStamp } from "../utils/timestamp";
import api from "./axios";
import { DEVICE_ID, APP_CONFIG } from "../services/config";
import { AxiosHeaders } from "axios";

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken; 
  const current_timestamp = getTimeStamp();

  const headers = new AxiosHeaders ({
    'Content-Type': 'application/json',
    'appName': APP_CONFIG.appName,
    'packageName': APP_CONFIG.packageName,
    'deviceId': DEVICE_ID,
    'appInstallId': APP_CONFIG.appInstallId,
    'timestamp': current_timestamp,
    'xRequestId': `${DEVICE_ID}-${current_timestamp}`,
    'os': APP_CONFIG.os,
    'source': APP_CONFIG.source,
    'buildNumber': APP_CONFIG.buildNumber,
    'appVersion': APP_CONFIG.appVersion,
    'deviceIp': APP_CONFIG.deviceIp,
    'userAgent': APP_CONFIG.userAgent,
    ...config.headers,
  });

  if (token) {
    headers.set('Authorization' , `Bearer ${token}`);
  }
config.headers = headers;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);
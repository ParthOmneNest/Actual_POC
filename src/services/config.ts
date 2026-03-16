
export const BASE_URL = import.meta.env.VITE_BASE_URL;
export const DEVICE_PUBLIC_KEY = import.meta.env.VITE_STATIC_PUBLIC_KEY;
export const DEVICE_ID = import.meta.env.VITE_DEVICE_ID;

export const APP_CONFIG = {
  appName:      import.meta.env.VITE_APP_NAME,
  packageName:  import.meta.env.VITE_PACKAGE_NAME,
  appInstallId: import.meta.env.VITE_APP_INSTALL_ID,
  buildNumber:  import.meta.env.VITE_BUILD_NUMBER,
  appVersion:   import.meta.env.VITE_APP_VERSION,
  os:           import.meta.env.VITE_OS,
  source:       import.meta.env.VITE_SOURCE,
  deviceIp:     import.meta.env.VITE_DEVICE_IP,
  userAgent:    import.meta.env.VITE_userAgent,
};
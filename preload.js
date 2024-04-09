const { contextBridge, ipcRenderer } = require("electron");
const ipc = ipcRenderer;

const API = {
  mainSys: {
    closeApp: () => ipc.send("close_app"),
    minimizeApp: () => ipc.send("minimize_app"),
    appName: (callback) => ipc.on("app_name", (event, data) => callback(data)),
    appVersion: (callback) =>
      ipc.on("app_version", (event, data) => callback(data)),
    laptopModel: (callback) =>
      ipc.on("laptop_model", (event, data) => callback(data)),
  },
  batterySys: {
    scanPC: () => ipc.send("scan_pc"),
    batteryData: (callback) =>
      ipc.on("battery_data", (event, data) => callback(data)),
    batteryState: () => ipc.invoke("battery_state"),
  },
  storageSys: {
    getUserSettings: () => ipc.send("get_user_settings"),
    userSettings: (callback) =>
      ipc.on("user_settings", (event, data) => callback(data)),
    autoScan: (data) => ipc.send("auto_scan", data),
    autoUpdate: (data) => ipc.send("auto_update", data),
  },
};

contextBridge.exposeInMainWorld("bridge", API);

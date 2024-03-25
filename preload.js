const { contextBridge, ipcRenderer } = require("electron");
const ipc = ipcRenderer;

const API = {
  mainSys: {
    closeApp: () => ipc.send("close_app"),
    minimizeApp: () => ipc.send("minimize_app"),
    laptopModel: (callback) =>
      ipc.on("laptop_model", (event, data) => callback(data)),
  },
  batterySys: {
    scanPC: () => ipc.send("scan_pc"),
    batteryData: (callback) =>
      ipc.on("battery_data", (event, data) => callback(data)),
    batteryState: () => ipc.invoke("battery_state"),
  },
};

contextBridge.exposeInMainWorld("bridge", API);

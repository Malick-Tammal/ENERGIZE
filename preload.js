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
    checkPC: () => ipc.send("check_pc"),
    batteryData: (callback) =>
      ipc.on("battery_data", (event, data) => callback(data)),
    batteryState: () => ipc.invoke("battery_state"),
    batteryDataTwo: (callback) =>
      ipc.on("battery_data_2", (event, data) => callback(data)),
  },
};

contextBridge.exposeInMainWorld("bridge", API);

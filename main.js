console.time("app_startup_time"); // 670ms / new is 180ms / steel optimizing the code

const { app, BrowserWindow, ipcMain } = require("electron");
const ipc = ipcMain;
const path = require("path");

let mainWin;
const appName = "ENERGIZE";

const createMainWin = () => {
  mainWin = new BrowserWindow({
    width: 550,
    height: 600,
    title: appName,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });
  mainWin.loadFile("./src/index.html");
  mainWin.webContents.openDevTools({ mode: "detach" });
};

app.whenReady().then(() => {
  createMainWin();
  console.timeEnd("app_startup_time");
});

app.on("window-all-closed", () => {
  app.quit();
});

ipc.on("close_app", () => {
  app.quit();
});
ipc.on("minimize_app", () => {
  mainWin.minimize();
});

ipc.on("scan_pc", (event) => {
  const {
    psBatteryData,
    getLaptopModel,
    getBatteryState,
  } = require("./lib/battery.js");

  psBatteryData
    .then((data) => {
      event.sender.send("battery_data", data);
    })
    .catch((err) => {
      event.sender.send("battery_data", err);
    });

  getLaptopModel
    .then((data) => {
      event.sender.send("laptop_model", data);
    })
    .catch((err) => {
      event.sender.send("laptop_model", err);
    });

  ipc.handle("battery_state", async () => {
    const data = await getBatteryState();
    return data;
  });
});

ipc.on("get_user_settings", (event) => {
  const { getData } = require("./lib/settings.js");
  event.sender.send("user_settings", getData());
});

ipc.on("auto_scan", (args, data) => {
  const { saveData } = require("./lib/settings.js");
  saveData({ autoScan: data });
});

ipc.on("auto_update", (args, data) => {
  const { saveData } = require("./lib/settings.js");
  saveData({ autoUpdate: data });
});

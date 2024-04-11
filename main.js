/*
    ==============================
    ==============================
    ========== Main js ===========
    ========== ENERGIZE ==========
    ==============================
*/

console.time("app_startup_time"); // improve loading speed => /old 670ms / new 180ms

const { app, BrowserWindow, ipcMain } = require("electron");
const ipc = ipcMain;
const path = require("path");

let mainWin;
const appName = "ENERGIZE";

const isDev = !app.isPackaged;

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
  // Dev tools
  if (isDev) mainWin.webContents.openDevTools({ mode: "detach" });
};

app.whenReady().then(() => {
  createMainWin();
  console.timeEnd("app_startup_time");
});

app.on("window-all-closed", () => {
  app.quit();
});

// Close the app
ipc.on("close_app", () => {
  app.quit();
});

// Minimize the app
ipc.on("minimize_app", () => {
  mainWin.minimize();
});

// Getting / Sending app name | version
ipc.on("get_app_data", (event) => {
  event.sender.send("app_name", appName);
  event.sender.send("app_version", app.getVersion());
});

// Getting battery info and sending it to renderer (ui)==\\
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
//=======================================================\\

// Getting user settings from settings.js==\\
ipc.on("get_user_settings", (event) => {
  const { getSettings } = require("./lib/settings.js");
  event.sender.send("user_settings", getSettings());
});
//=========================================\\

// Saving user settings
ipc.on("auto_scan", (args, data) => {
  const { saveSettings } = require("./lib/settings.js");
  saveSettings({ autoScan: data });
});
ipc.on("auto_update", (args, data) => {
  const { saveSettings } = require("./lib/settings.js");
  saveSettings({ autoUpdate: data });
});

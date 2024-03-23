const { app, BrowserWindow, ipcMain } = require("electron");
const ipc = ipcMain;
const path = require("path");
const {
  psBatteryData,
  getLaptopModel,
  getBatteryState,
} = require("./battery.js");

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
  //mainWin.webContents.openDevTools({ mode: "detach" });
};

app.whenReady().then(() => {
  createMainWin();
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

ipc.on("check_pc", (event) => {
  psBatteryData
    .then((data) => {
      event.sender.send("battery_data", data);
    })
    .catch((error) => {
      event.sender.send("battery_data", error);
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

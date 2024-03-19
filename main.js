const { app, BrowserWindow, ipcMain } = require("electron");
const ipc = ipcMain;
const path = require("path");
const exec = require("child_process").exec;
const si = require("systeminformation");
const battery = require("battery");

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

const execute = (command, callback) => {
  exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
};

ipc.on("check_pc", (event) => {
  execute(
    "powershell -executionpolicy bypass -File ./battery_ps/get_battery_health.PS1",
    (output) => {
      event.sender.send("battery_data_2", output);
    }
  );

  si.battery().then((data) => {
    event.sender.send("battery_data", data);
  });

  si.system().then((data) => {
    const laptopModel = `${data.manufacturer} ${data.model}`;
    event.sender.send("laptop_model", laptopModel);
  });

  ipc.handle("battery_state", async () => {
    const { level, charging } = await battery();
    const data = { level, charging };
    return data;
  });
});

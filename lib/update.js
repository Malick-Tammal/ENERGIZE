/*
    ==============================
    ==============================
    ========= Update js ==========
    ========== ENERGIZE ==========
    ==============================
*/

const updater = require("electron-updater").autoUpdater;
const { Notification } = require("electron");
const path = require("path");

updater.autoDownload = true;
updater.autoInstallOnAppQuit = true;
//updater.autoRunAppAfterInstall = true;

const checkUpdates = () => {
  updater.checkForUpdates();
};

updater.on("update-available", (info) => {
  customNotification(
    "ENERGIZE Update system",
    `Update available : V${info.releaseName}\nRelease date : ${info.releaseDate}`
  );
});

updater.on("update-not-available", () => {
  customNotification("ENERGIZE Update system", "You have latest version");
});

updater.on("update-downloaded", () => {
  customNotification(
    "ENERGIZE Update system",
    "Update downloaded please relaunch the app"
  );
});

const installUpdate = () => {
  updater.quitAndInstall();
};

const customNotification = (title, body) => {
  new Notification({
    title: title,
    body: body,
    icon: path.join(__dirname, "../asset/icons/App_icon.ico"),
  }).show();
};

module.exports = {
  checkUpdates: checkUpdates,
  installUpdate: installUpdate,
};

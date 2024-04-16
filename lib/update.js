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

const checkUpdates = () => {
  updater.checkForUpdates();
};

updater.on("update-available", (info) => {
  customNotification(
    "Update found",
    `Update version : V${info.releaseName}\nThe update has started downloading`
  );
});

updater.on("update-not-available", () => {
  customNotification("You are up-to-date", "You have latest version");
});

updater.on("update-downloaded", () => {
  customNotification(
    "Update downloaded",
    "Please close the application to install the update"
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

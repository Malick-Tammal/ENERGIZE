/*
    ==============================
    ==============================
    ========= Update js ==========
    ========== ENERGIZE ==========
    ==============================
*/

const updater = require("electron-updater").autoUpdater;

const checkUpdates = () => {
  updater.checkForUpdates();
};

updater.on("update-available", (info) => {
  updateInfo = {
    updateVersion: info.releaseName,
    releaseDate: info.releaseDate,
  };
  console.log(updateInfo);
});

updater.on("update-not-available", () => {
  console.log("You have latest version");
});

updater.on("update-downloaded", () => {
  console.log("Update downloaded");
});

const installUpdate = () => {
  updater.quitAndInstall();
};

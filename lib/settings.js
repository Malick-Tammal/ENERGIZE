/*
    ==============================
    ==============================
    ======== Settings js =========
    ========== ENERGIZE ==========
    ==============================
*/

const Store = require("electron-store");
const storage = new Store();

// Getting settings form storage / setting default if storage empty ===\\
const getSettings = () => {
  const default_settings = {
    autoScan: false,
    autoUpdate: true,
  };
  const settings = storage.get("settings");

  if (settings) return settings;
  else {
    storage.set("settings", default_settings);
    return default_settings;
  }
};
//======================================================================\\

// Saving settings to storage =============================\\
const saveSettings = (setting) => {
  if (typeof setting.autoScan === "boolean") {
    console.log("autoScan", setting.autoScan);
    storage.set("settings.autoScan", setting.autoScan);
  } else if (typeof setting.autoUpdate === "boolean") {
    console.log("autoUpdate", setting.autoUpdate);
    storage.set("settings.autoUpdate", setting.autoUpdate);
  } else {
    console.log("Error occurred while saving data");
  }
};
//==========================================================\\

// Exporting functions
module.exports = {
  getSettings: getSettings,
  saveSettings: saveSettings,
};

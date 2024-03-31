const Store = require("electron-store");
const storage = new Store();

const getData = () => {
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

const saveData = (setting) => {
  if (typeof setting.autoScan === "boolean") {
    console.log("autoScan", setting);
    storage.set("settings.autoScan", setting.autoScan);
  } else {
    console.log("autoUpdate", setting);
    storage.set("settings.autoUpdate", setting.autoUpdate);
  }
};

module.exports = {
  getData: getData,
  saveData: saveData,
};

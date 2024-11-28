/*
    ==============================
    ==============================
    ====== Renderer main js ======
    ========== ENERGIZE ==========
    ==============================
*/

console.log("\n");
console.log(
  "  ______ _   _ ______ _____   _____ _____ ____________ \r\n |  ____| \\ | |  ____|  __ \\ / ____|_   _|___  /  ____|\r\n | |__  |  \\| | |__  | |__) | |  __  | |    / /| |__   \r\n |  __| | . ` |  __| |  _  /| | |_ | | |   / / |  __|  \r\n | |____| |\\  | |____| | \\ \\| |__| |_| |_ / /__| |____ \r\n |______|_| \\_|______|_|  \\_\\\\_____|_____/_____|______|\r\n                                                       \r\n                                                       "
);
console.log(
  "===================================================================="
);
console.log(
  "=================== Interested in the app code ===================="
);
console.log(
  "===================== Consider to contribute ======================"
);
console.log(
  "======= Github repo : https://github.com/Malick-Tammal/ENERGIZE.git ======="
);
console.log(
  "===================================================================="
);

// Getting app name ========================================\\
const appTitle = document.querySelector(".app_title");
bridge.mainSys.appName((data) => {
  console.log(`app name : ${data}`);
  appTitle.innerText = data;
});
//==========================================================\\

// Close and Minimize functions =============================\\
const closeBtn = document.querySelector(".close-btn");
const minimizeBtn = document.querySelector(".minimize-btn");

closeBtn.addEventListener("click", () => {
  bridge.mainSys.closeApp();
});
minimizeBtn.addEventListener("click", () => {
  bridge.mainSys.minimizeApp();
});
//===========================================================\\

// Getting data and evoking functions in main process =======\\
document.addEventListener("DOMContentLoaded", () => {
  bridge.storageSys.getUserSettings();
  bridge.mainSys.getAppData();
  bridge.updateSys.checkUpdates();
});
// ==========================================================\\

// Settings panel functions (toggles / storage system) ======\\
const settingsBtn = document.querySelector(".settings");
const settingsBtnIcon = document.querySelector(".settings img");
const settingsPanel = document.querySelector(".settings_panel");
const SettingsOverlay = document.querySelector(".settings_overlay");

settingsBtn.addEventListener("mouseenter", () => {
  settingsBtnIcon.src = "../asset/icons/Setting_icon_colored.png";
});
settingsBtn.addEventListener("mouseleave", () => {
  if (settingsPanel.classList.contains("hide")) {
    settingsBtnIcon.src = "../asset/icons/Setting_icon.png";
  } else {
    settingsBtnIcon.src = "../asset/icons/Setting_icon_colored.png";
  }
});
settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("hide");
  SettingsOverlay.classList.toggle("hide");
});
SettingsOverlay.addEventListener("click", () => {
  settingsPanel.classList.toggle("hide");
  SettingsOverlay.classList.toggle("hide");
  settingsBtnIcon.src = "../asset/icons/Setting_icon.png";
});

const autoScanBtn = document.querySelector(".auto_scan");
const autoCheckBtn = document.querySelector(".auto_check");

bridge.storageSys.userSettings((data) => {
  console.log(data);
  if (data.autoScan === true) {
    autoScanBtn.classList.add("active");
    loadingPage.classList.remove("hide");
    setTimeout(() => {
      bridge.batterySys.scanPC();
      getBatteryState();
    }, 1000);
  } else {
    autoScanBtn.classList.remove("active");
  }

  if (data.autoUpdate === true) {
    autoCheckBtn.classList.add("active");
  } else {
    autoCheckBtn.classList.remove("active");
  }
});

autoScanBtn.addEventListener("click", () => {
  autoScanBtn.classList.toggle("active");
  if (autoScanBtn.classList.contains("active")) {
    bridge.storageSys.autoScan(true);
    console.log("auto-scan : on");
  } else {
    bridge.storageSys.autoScan(false);
    console.log("auto-scan : off");
  }
});
autoCheckBtn.addEventListener("click", () => {
  autoCheckBtn.classList.toggle("active");
  if (autoCheckBtn.classList.contains("active")) {
    bridge.storageSys.autoUpdate(true);
    console.log("auto-update : on");
  } else {
    bridge.storageSys.autoUpdate(false);
    console.log("auto-update : off");
  }
});
//===========================================================\\

// Getting app version ====================================\\
const appVersionDom = document.querySelector(".app_version");
bridge.mainSys.appVersion((data) => {
  console.log(`app version : v${data}`);
  appVersionDom.innerText = `v${data}`;
});
//==========================================================\\

// Scan btn to trigger battery scan function (main process) ==\\
const scanBtn = document.querySelector(".scan_btn");
const loadingPage = document.querySelector(".loading_page");
const batteryPage = document.querySelector(".battery_page");

scanBtn.addEventListener("click", () => {
  console.time("Getting_data_time");
  console.log("Started scanning...");
  bridge.batterySys.scanPC();

  getBatteryState();

  loadingPage.classList.remove("hide");
});
//=============================================================\\

// Getting battery state (percentage , isCharging) =======================\\
const waves = document.querySelector(".waves");
const percentBox = document.querySelector(".percent_box");
const chargingPer = document.querySelector(".charging_per");
const thunderIcon = document.querySelector(".thunder_icon");

const getBatteryState = () => {
  setInterval(async () => {
    const batteryState = await bridge.batterySys.batteryState();

    if (batteryState.isCharging === false) {
      waves.classList.add("hide");
      thunderIcon.classList.add("hide");
    } else {
      waves.classList.remove("hide");
      thunderIcon.classList.remove("hide");
    }

    waves.style.bottom = `${batteryState.level}%`;
    percentBox.style.height = `${batteryState.level}%`;

    chargingPer.innerText = `${batteryState.level}%`;
  }, 1000);
};
//===========================================================\\

// Getting battery info =====================================\\
const laptopModelDom = document.querySelector(".laptop_model");
const batteryIDdom = document.querySelector(".battery_id");
const batteryModel = document.querySelector(".battery_model");
const serialNumberDom = document.querySelector(".serial_number");
const cycleCountDom = document.querySelector(".cycle_count");
const fullChargeCapacityDom = document.querySelector(".full_charge_capacity");
const designCapacityDom = document.querySelector(".design_capacity");

// Getting laptop model
bridge.mainSys.laptopModel((data) => {
  console.log(`Laptop model ${data}`);
  laptopModelDom.innerText = data;
});

const batteryHealthNumDom = document.querySelector(".battery_health_num");
const batteryHealthTxtDom = document.querySelector(".battery_health_txt");

const boxTwo = document.querySelector(".box_2");

const unsupportedDevice = document.querySelector(".unsupported_device");

bridge.batterySys.batteryData((data) => {
  if (typeof data === "object") {
    setTimeout(() => {
      console.log("Battery info :");
      console.log(data);

      batteryIDdom.innerText = data.id;
      batteryModel.innerText = data.serialNumber + data.id;
      serialNumberDom.innerText = data.serialNumber;
      cycleCountDom.innerText = data.cycleCount;
      fullChargeCapacityDom.innerText =
        data.fullChargeCapacity + data.measureUnit;
      designCapacityDom.innerText = data.designCapacity + data.measureUnit;
      batteryHealthNumDom.innerText = `${data.health}%`;
      batteryHealthTxtDom.innerText = healthStatus(data.health);
      boxTwo.style.background = healthStatusColor(data.health);

      loadingPage.classList.add("hide");
      batteryPage.classList.remove("hide");

      console.log(`Scanning completed`);

      console.timeEnd("Getting_data_time");
    }, 200);
  } else {
    console.log(data);
    unsupportedDevice.classList.remove("hide");
  }
});
//===========================================================\\

// Adding health status based on battery health percentage ==\\
const healthStatus = (health) => {
  if (health >= 90) {
    return "GREAT";
  } else if (health >= 70 && health < 90) {
    return "OK";
  } else if (health >= 50 && health < 70) {
    return "LOW";
  } else if (health >= 20 && health < 50) {
    return "BAD";
  } else {
    return "Invalid Value";
  }
};
//===========================================================\\

// Adding health status color based on battery health percentage ==\\
const healthStatusColor = (health) => {
  if (health >= 90) {
    return "#06EB70";
  } else if (health >= 70 && health < 90) {
    return "#E6DD11";
  } else if (health >= 50 && health < 70) {
    return "#E6A211";
  } else if (health >= 20 && health < 50) {
    return "#E63B11";
  } else {
    return "#1D2A33";
  }
};
//===========================================================\\

// Icons hover animation ====================================\\
const websiteButton = document.querySelector(".website");
const githubButton = document.querySelector(".github");

websiteButton.addEventListener("mouseenter", () => {
  websiteButton.src = "../asset/icons/Website_icon_colored.png";
});
websiteButton.addEventListener("mouseleave", () => {
  websiteButton.src = "../asset/icons/Website_icon.png";
});

githubButton.addEventListener("mouseenter", () => {
  githubButton.src = "../asset/icons/Github_icon_colored.png";
});
githubButton.addEventListener("mouseleave", () => {
  githubButton.src = "../asset/icons/Github_icon.png";
});

websiteButton.addEventListener("click", () => {
  bridge.externalLinks.openWebsite();
});
githubButton.addEventListener("click", () => {
  bridge.externalLinks.openGithub();
});
//===========================================================\\

// Update listeners (click / auto) ===========================\\
const checkUpdatesBtn = document.querySelector(".check_updates");
checkUpdatesBtn.addEventListener("click", () => {
  bridge.updateSys.checkUpdatesUser();
});
//===========================================================\\

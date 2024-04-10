/*
    ==============================
    ==============================
    ====== Renderer main js ======
    ========== ENERGIZE ==========
    ==============================
*/

console.log("\n");
console.log(
  "    _____ _   _ _____ ____   ____ ___ __________ \n",
  "  | ____| \\ | | ____|  _ \\ / ___|_ _|__  / ____|\n",
  "  |  _| |  \\| |  _| | |_) | |  _ | |  / /|  _|  \n",
  "  | |___| |\\  | |___|  _ <| |_| || | / /_| |___ \n",
  "  |_____|_| \\_|_____|_| \\_\\____|___/____|_____|\n",
  "                                                \n"
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
  "======= Github repo : https://github.com/ADAMSKI-DZ/ENERGIZE ======="
);
console.log(
  "===================================================================="
);
console.log("\n");

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

// Settings panel functions (toggles / storage system) ======\\
const settingsBtn = document.querySelector(".settings");
const settingsBtnIcon = document.querySelector(".settings img");
const settingsPanel = document.querySelector(".settings_panel");

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
});

const autoScanBtn = document.querySelector(".auto_scan");
const autoCheckBtn = document.querySelector(".auto_check");
const checkUpdatesBtn = document.querySelector(".check_updates_btn");

document.addEventListener("DOMContentLoaded", () => {
  bridge.storageSys.getUserSettings();
});

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
  console.log("Started scanning...");
  loadingPage.classList.remove("hide");
  bridge.batterySys.scanPC();
  getBatteryState();
});
//=============================================================\\

// Getting battery state (percentage) =======================\\
const waves = document.querySelector(".waves");
const percentBox = document.querySelector(".percent_box");
const chargingPer = document.querySelector(".charging_per");
const thunderIcon = document.querySelector(".thunder_icon");

const getBatteryState = async () => {
  setInterval(async () => {
    const batteryState = await bridge.batterySys.batteryState();

    if (batteryState.charging === false) {
      waves.classList.add("hide");
      thunderIcon.classList.add("hide");
    } else {
      waves.classList.remove("hide");
      thunderIcon.classList.remove("hide");
    }

    waves.style.bottom = `${batteryState.level * 100}%`;
    percentBox.style.height = `${batteryState.level * 100}%`;

    chargingPer.innerText = `${Math.round(batteryState.level * 100)}%`;
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
  console.log(`Scanning completed`);
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
      console.log("Battery info =====================//");
      console.log(data);
      batteryIDdom.innerText = data.batteryId;
      batteryModel.innerText = data.serialNumber + data.batteryId;
      serialNumberDom.innerText = data.serialNumber;
      cycleCountDom.innerText = data.cycleCount;
      fullChargeCapacityDom.innerText =
        data.fullChargeCapacity + data.measureUnit;
      designCapacityDom.innerText = data.designCapacity + data.measureUnit;
      batteryHealthNumDom.innerText =
        calcBatteryHealth(data.fullChargeCapacity, data.designCapacity) + "%";
      batteryHealthTxtDom.innerText = healthStatus(
        data.fullChargeCapacity,
        data.designCapacity
      );
      boxTwo.style.background = healthStatusColor(
        data.fullChargeCapacity,
        data.designCapacity
      );

      loadingPage.classList.add("hide");
      batteryPage.classList.remove("hide");
    }, 200);
  } else {
    console.log(data);
    unsupportedDevice.classList.remove("hide");
  }
});
//===========================================================\\

// Calculating battery health ===============================\\
const calcBatteryHealth = (fChargeC, designC) => {
  let batteryHealth = Math.round((fChargeC / designC) * 100);
  return batteryHealth;
};
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
    return "#19c219";
  } else if (health >= 70 && health < 90) {
    return "#84c219";
  } else if (health >= 50 && health < 70) {
    return "#c2af19";
  } else if (health >= 20 && health < 50) {
    return "#c23819";
  } else {
    return "#000000";
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
//===========================================================\\

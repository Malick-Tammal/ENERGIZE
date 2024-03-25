//! Close and Minimize function
const closeBtn = document.querySelector(".close-btn");
const minimizeBtn = document.querySelector(".minimize-btn");

closeBtn.addEventListener("click", () => {
  bridge.mainSys.closeApp();
});
minimizeBtn.addEventListener("click", () => {
  bridge.mainSys.minimizeApp();
});

//! Settings panel function
const settingsBtn = document.querySelector(".settings");
const settingsBtnIcon = document.querySelector(".settings img");
const settingsPanel = document.querySelector(".settings_panel");

settingsBtn.addEventListener("mouseenter", () => {
  settingsBtnIcon.src = "../asset/Setting_icon_colored.png";
});
settingsBtn.addEventListener("mouseleave", () => {
  if (settingsPanel.classList.contains("hide")) {
    settingsBtnIcon.src = "../asset/Setting_icon.png";
  } else {
    settingsBtnIcon.src = "../asset/Setting_icon_colored.png";
  }
});
settingsBtn.addEventListener("click", () => {
  settingsPanel.classList.toggle("hide");
});

//! Checking system battery info
const scanBtn = document.querySelector(".scan_btn");
const loadingPage = document.querySelector(".loading_page");
const batteryPage = document.querySelector(".battery_page");

scanBtn.addEventListener("click", () => {
  loadingPage.classList.remove("hide");
  bridge.batterySys.scanPC();
  getBatteryState();
});

const waves = document.querySelector(".waves");
const percentBox = document.querySelector(".percent_box");
const chargingPer = document.querySelector(".charging_per");
const thunderIcon = document.querySelector(".thunder_icon");

//! Getting battery state (percentage)
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

const laptopModelDom = document.querySelector(".laptop_model");
const batteryIDdom = document.querySelector(".battery_id");
const batteryModel = document.querySelector(".battery_model");
const serialNumberDom = document.querySelector(".serial_number");
const cycleCountDom = document.querySelector(".cycle_count");
const fullChargeCapacityDom = document.querySelector(".full_charge_capacity");
const designCapacityDom = document.querySelector(".design_capacity");

//! Getting laptop model
bridge.mainSys.laptopModel(async (data) => {
  const laptopModel = await data;
  laptopModelDom.innerText = laptopModel;
});

const batteryHealthNumDom = document.querySelector(".battery_health_num");
const batteryHealthTxtDom = document.querySelector(".battery_health_txt");

const boxTwo = document.querySelector(".box_2");

const unsupportedDevice = document.querySelector(".unsupported_device");

//! Getting battery data
bridge.batterySys.batteryData((data) => {
  if (typeof data === "object") {
    setTimeout(() => {
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
    }, 1000);
  } else {
    console.log(data);
    unsupportedDevice.classList.remove("hide");
  }
});

// ^ Function to calculate battery health
const calcBatteryHealth = (fChargeC, designC) => {
  let batteryHealth = Math.round((fChargeC / designC) * 100);
  return batteryHealth;
};

// ^ Function to add health status based on battery health percentage
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

// ^ Function to add health status color based on battery health percentage
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

const radioButtons = document.querySelectorAll(".radio_button");
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener("click", () => {
    radioButton.classList.toggle("active");
  });
});

// ^ Icons hover animation
const websiteButton = document.querySelector(".website");
const githubButton = document.querySelector(".github");

websiteButton.addEventListener("mouseenter", () => {
  websiteButton.src = "../asset/Website_icon_colored.svg";
});
websiteButton.addEventListener("mouseleave", () => {
  websiteButton.src = "../asset/Website_icon.svg";
});

githubButton.addEventListener("mouseenter", () => {
  githubButton.src = "../asset/Github_icon_colored.svg";
});
githubButton.addEventListener("mouseleave", () => {
  githubButton.src = "../asset/Github_icon.svg";
});

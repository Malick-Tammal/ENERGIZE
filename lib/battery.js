/*
    ==============================
    ==============================
    ========= Battery js =========
    ========== ENERGIZE ==========
    ==============================
*/

const battery = require("battery");
const util = require("./util");
const bu = require("battery_util");

// Running a process and executing a powershell script (Battery info) ===\\
const getBatteryInfo = new Promise((resolve, reject) => {
  bu.batteryInfo()
    .then((data) => {
      resolve(data);
    })
    .catch((err) => {
      reject(err);
    });
});
//=======================================================================\\

// Running a process and executing a powershell commend (Laptop model) ===\\
const getLaptopModel = new Promise((resolve, reject) => {
  util
    .powerShell(
      "Get-CimInstance Win32_ComputerSystemProduct | select Name,Vendor | fl"
    )
    .then((stdout, error) => {
      if (stdout.includes("Name")) {
        const dataSplitted = stdout.split("\r\n");
        const laptopModel = `${util.getValue(
          dataSplitted,
          "Vendor",
          ":"
        )} ${util.getValue(dataSplitted, "Name", ":")}`;
        resolve(laptopModel);
      } else {
        reject("Error occurred while getting laptop model.");
      }
    });
});
//========================================================================\\

// Getting battery state (percentage / state) || changing soon (poor package) ===\\
const getBatteryState = async () => {
  const { level, charging } = await battery();
  const data = { level, charging };
  return data;
};
//===============================================================================\\

// Exporting functions
module.exports = {
  getBatteryInfo: getBatteryInfo,
  getLaptopModel: getLaptopModel,
  getBatteryState: getBatteryState,
};

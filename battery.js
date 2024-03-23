const exec = require("child_process").exec;
const si = require("systeminformation");
const battery = require("battery");

let psBatteryData = new Promise((resolve, reject) => {
  exec(
    "powershell -executionpolicy bypass -File ./battery_ps/get_battery_health.PS1",
    (error, stdout, stderr) => {
      if (!stdout.includes("DesignCapacity")) {
        reject("Error occurred while executing Powershell script.");
      } else {
        const dataSplitted = stdout.split("\n");

        const measureUnit = "mWh";
        const fileSavedPath = dataSplitted[0];
        const designCapacity = dataSplitted[3]
          .split(" ")
          .filter((item) => item != "")[2];
        const fullChargeCapacity = dataSplitted[4]
          .split(" ")
          .filter((item) => item != "")[2];
        const cycleCount = dataSplitted[5]
          .split(" ")
          .filter((item) => item != "")[2];
        const batteryIdSplitted = dataSplitted[6]
          .split(" ")
          .filter((item) => item != "");
        const batteryId = `${batteryIdSplitted[2]} ${batteryIdSplitted[3]}`;
        const serialNumber = dataSplitted[7]
          .split(" ")
          .filter((item) => item != "")[2];

        const allData = {
          measureUnit: measureUnit,
          fileSavedPath: fileSavedPath,
          designCapacity: designCapacity,
          fullChargeCapacity: fullChargeCapacity,
          cycleCount: cycleCount,
          batteryId: batteryId,
          serialNumber: serialNumber,
        };

        resolve(allData);
      }
    }
  );
});

const getLaptopModel = new Promise((resolve, reject) => {
  si.system()
    .then((data) => {
      const laptopModel = `${data.manufacturer} ${data.model}`;
      resolve(laptopModel);
    })
    .catch((err) => reject(err));
});

const getBatteryState = async () => {
  const { level, charging } = await battery();
  const data = { level, charging };
  return data;
};

module.exports = {
  psBatteryData: psBatteryData,
  getLaptopModel: getLaptopModel,
  getBatteryState: getBatteryState,
};

const exec = require("child_process").exec;
const battery = require("battery");
const util = require("./util");

const execute = (command, callback) => {
  exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
};

const psBatteryData = new Promise((resolve, reject) => {
  execute(
    "powershell -executionpolicy bypass -File ./battery_ps/get_battery_health.PS1",
    (output) => {
      if (output.includes("DesignCapacity")) {
        const dataSplitted = output.split("\r\n");

        const fileSavedPath = dataSplitted[0];
        const measureUnit = "mWh";
        const designCapacity = util.getValue(
          dataSplitted,
          "designCapacity",
          ":"
        );
        const fullChargeCapacity = util.getValue(
          dataSplitted,
          "fullChargeCapacity",
          ":"
        );
        const cycleCount = util.getValue(dataSplitted, "cycleCount", ":");
        const batteryId = util.getValue(dataSplitted, "id", ":");
        const serialNumber = util.getValue(dataSplitted, "serialNumber", ":");

        const allData = {
          fileSavedPath: fileSavedPath,
          measureUnit: measureUnit,
          designCapacity: designCapacity,
          fullChargeCapacity: fullChargeCapacity,
          cycleCount: cycleCount,
          batteryId: batteryId,
          serialNumber: serialNumber,
        };

        resolve(allData);
      } else {
        reject("Error occurred while executing Powershell script.");
      }
    }
  );
}); 

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

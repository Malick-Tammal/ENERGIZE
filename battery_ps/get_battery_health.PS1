# Creating windows battery report than getting data from it
powercfg /batteryreport /XML /OUTPUT "./battery_ps/batteryreport.xml"
Start-Sleep 1
[xml]$b = Get-Content "./battery_ps/batteryreport.xml"

$b.BatteryReport.Batteries | ForEach-Object {
    [PSCustomObject]@{
        DesignCapacity     = $_.Battery.DesignCapacity
        FullChargeCapacity = $_.Battery.FullChargeCapacity
        CycleCount         = $_.Battery.CycleCount
        Id                 = $_.Battery.id
        SerialNumber       = $_.Battery.SerialNumber
    }
}
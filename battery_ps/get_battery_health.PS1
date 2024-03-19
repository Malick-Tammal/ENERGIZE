$InfoAlertPercent = "70"
$WarnAlertPercent = "50"
$CritAlertPercent = "20"
$BatteryHealth=""
& powercfg /batteryreport /XML /OUTPUT "./battery_ps/batteryreport.xml"
Start-Sleep 1
[xml]$b = Get-Content "./battery_ps/batteryreport.xml"

$b.BatteryReport.Batteries |
    ForEach-Object{
        [PSCustomObject]@{
            DesignCapacity = $_.Battery.DesignCapacity
            FullChargeCapacity = $_.Battery.FullChargeCapacity
            BatteryHealth = [math]::floor([int64]$_.Battery.FullChargeCapacity/[int64]$_.Battery.DesignCapacity*100)
            CycleCount = $_.Battery.CycleCount
            Id = $_.Battery.id
            SerialNumber = $_.Battery.SerialNumber
        }

        if (([int64]$_.Battery.FullChargeCapacity/[int64]$_.Battery.DesignCapacity)*100 -gt $InfoAlertPercent){
            $BatteryHealth="Great"
            write-host "Battery Health is $BatteryHealth"
        }elseif (([int64]$_.Battery.FullChargeCapacity/[int64]$_.Battery.DesignCapacity)*100 -and ([int64]$_.Battery.FullChargeCapacity/[int64]$_.Battery.DesignCapacity)*100 -gt $WarnAlertPercent){
            $BatteryHealth="OK"
            write-host "Battery Health is $BatteryHealth"
        }elseif (([int64]$_.Battery.FullChargeCapacity/[int64]$_.Battery.DesignCapacity)*100 -and ([int64]$_.Battery.FullChargeCapacity/[int64]$_.Battery.DesignCapacity)*100 -gt $CritAlertPercent){
            $BatteryHealth="Low"
            write-host "Battery Health is $BatteryHealth"
        }elseif (([int64]$_.Battery.FullChargeCapacity/[int64]$_.Battery.DesignCapacity)*100 -le $CritAlertPercent){
            $BatteryHealth="Critical"
            write-host "Battery Health is $BatteryHealth"
        }
    }
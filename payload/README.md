# Prerequisite Instruction

1. Install the LTS version of [NodeJS](https://nodejs.org/en/)
2. Open Firewall ports 3000, 5000, and 8000 for in-bound traffic.
3. Launch one of the web applications as a local server.
4. Inject some payloads and have fun.

## Opening Firewall Ports

### Windows Firewall
```
# Add Rules
netsh advfirewall firewall add rule name="SSJI 3000" dir=in protocl=tcp localport=3000 action=allow
netsh advfirewall firewall add rule name="SSJI 5000" dir=in protocl=tcp localport=5000 action=allow
netsh advfirewall firewall add rule name="SSJI 8000" dir=in protocl=tcp localport=8000 action=allow

# Delete Rules 
netsh advfirewall firewall delete rule name="SSJI 3000"
netsh advfirewall firewall delete rule name="SSJI 5000"
netsh advfirewall firewall delete rule name="SSJI 8000"
```

### Linux IPTables
```
# Add Rules
iptables -I INPUT -p tcp --dport 3000 -j ACCEPT
iptables -I INPUT -p tcp --dport 5000 -j ACCEPT
iptables -I INPUT -p tcp --dport 8000 -j ACCEPT

# Delete Rules
iptables -L --line-numbers
iptables -D INPUT <line number>
```

### Linux NFTables
```
# Add Rules
nft add rule inet filter input tcp dport 3000 accept comment \"allow 3000\"
nft add rule inet filter input tcp dport 5000 accept comment \"allow 5000\"
nft add rule inet filter input tcp dport 8000 accept comment \"allow 8000\"

# Delete Rules
nft -a list ruleset
nft delete rule inet filter input handle <handle number>
```

# How to Exploit?


The goal of this repository is to perform SSJI by injecting malicious payloads in a vulnerable web application. Thereby successfully hacking it and gaining persistence through a backdoor.

Click either one of the guides in based on which operating system the vulnerable web application is running on.

## [Linux Instructions](./Linux/Linux.md)
* Follow this guide if both the web server and the hacker is running linux.

## [Windows Instructions](./Windows/Windows.md)
* Follow this guide if the web server runs windows and the hacker is running linux.

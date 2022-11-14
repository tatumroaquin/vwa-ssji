<h1 align='center'>The Cutlery Shop</h1>
<h5 align='center'>12/11/2022</h5>

![tcs-screenshot](./public/assets/the-cutlery-shop.png)

<h3 align='center'>Description</h3>

This is a vulnerable NodeJS frontend is made to demonstrate the Server-side JavaScript Code Injection vulnerabilty. It includes a mock JSON database, storing information about silverware products

<h2 align='center'>How to Run</h3>

1. `npm install`
2. `npm start`

<h2 align='center'>Intended Usage</h3>

You can do the basic __CRUD (Create, Read, Update, Delete)__ operations on that data. Which means populating the form fields provided with the correct data and sending it via __POST__ request.

<h2 align='center'>Exploitation</h3>

JavaScript code can be injected inside the form fields directly, you MUST enclose your code inside two pluses wrapped in double quotations like so:
```
1. " + res.send("hello world") + "
2. " + <payload> + "
```
Because of the way that this vulnerable application programmed, the input fields in forms allows for string escapes. Thus, providing an opening for RCE (Remote Code Execution) as a foundation for privilege escalation.

# CORS Options Configuration Explained

This document provides a detailed explanation of each CORS configuration option for your application.

## **1. origin**

This option specifies the origins that are allowed to access your server.

* **Single Origin:**

   - You can specify a single origin as a string.
     - Example: `"http://localhost:3000"` allows only requests from this origin.

* **Multiple Origins:**

   - An array of origins can be provided to allow requests from specific origins.
     - Example: `['http://localhost:3000', 'http://localhost:3500']`.

* **Regex:**

   - A regular expression can be used to match dynamic origins.
     - Example: `/^http:\/\/localhost:\d+$/` matches `http://localhost` on any port.

* **Function:**

   - A function can dynamically decide whether to allow a request based on its origin.

     ```javascript
     origin: (origin, callback) => {
         if (!origin || whitelist.indexOf(origin) !== -1) {
             callback(null, true); // Allowed
         } else {
             callback(new Error('Not allowed by CORS')); // Blocked
         }
     }
     ```

     - If `origin` is `null` (like in non-browser requests such as from Postman), it is allowed.
     - `whitelist` can be an array of allowed origins.


## **2. methods**

Specifies the HTTP methods that are allowed for cross-origin requests.

```javascript
methods: ['GET', 'POST', 'PUT', 'DELETE']
```
The server will accept requests only using these methods.


## **3. allowedHeaders**

Lists the HTTP headers that clients are allowed to include in requests.

```javascript
allowedHeaders: ['Content-Type', 'Authorization']
```

Controls which headers are allowed in the `Access-Control-Allow-Headers` response header.

**Example:** A request with an additional custom header like `X-Custom-Header` would fail unless explicitly listed here.


## **4. exposedHeaders**

Specifies the headers that should be made accessible to the client in the response.

```javascript
exposedHeaders: ['Content-Range', 'X-Content-Range']
```
By default, some response headers are not exposed to the client for security reasons.
This configuration allows the server to expose specific headers in the response.

**Example:** If a client wants to read the `Content-Range` header from the server’s response, it must be listed here.


## **5. credentials**

Specifies whether credentials (cookies, HTTP authentication, etc.) are allowed in cross-origin requests.

```javascript
credentials: true
```

When set to true, browsers include credentials in requests.
Requires `Access-Control-Allow-Credentials: true` in the server response.

<span style="color:magenta">

**Note:** When `credentials: true` is set in a server, it means that the client will include credentials (such as cookies, authorization headers, or TLS client certificates) in requests to the server.

Here are a few things you need to take care of:

* **CORS Configuration:**
    * Ensure that the server is configured to accept credentials from the client. 
    * This involves setting the `Access-Control-Allow-Credentials` header to `true` and specifying the allowed origin using the `Access-Control-Allow-Origin` header. 
    * Note that you cannot use a wildcard (*) for the `Access-Control-Allow-Origin` header when credentials are included.

* **Secure Cookies:**
    * If you are using cookies for authentication, make sure they are marked as `HttpOnly` and `Secure` to prevent them from being accessed via JavaScript and to ensure they are only sent over HTTPS.

* **SameSite Attribute:**
    * Configure the `SameSite` attribute of cookies appropriately. 
    * Depending on your use case, you might need to set it to `None` (along with `Secure`), `Lax`, or `Strict`.

* **CSRF Protection:**
    * Ensure that your application has proper Cross-Site Request Forgery (CSRF) protection in place, as including credentials can make your application more vulnerable to CSRF attacks.

<br>

**Note:** In your frontend code, you need to ensure that the `credentials` option is set to `true` in your fetch or XMLHttpRequest requests. Here is an example using the Fetch API:

```javascript
fetch('http://example.com/data', {
    method: 'GET',
    credentials: 'include' // This ensures credentials are included in the request
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Error:', error));
```

If you are using Axios, you can set the `withCredentials` option to `true`:

```javascript
axios.get('http://example.com/data', {
    withCredentials: true // This ensures credentials are included in the request
})
.then(response => console.log(response.data))
.catch(error => console.error('Error:', error));
```
</span>


### **6. preflightContinue**

Determines whether the server should pass the preflight request to the application for handling.

```javascript
preflightContinue: false
```
A preflight request is an HTTP `OPTIONS` request sent before the actual request to check permissions.
If `false`, the server responds directly to the preflight OPTIONS request.If `true`, the application handles it.


### **7. optionsSuccessStatus**

Sets the HTTP status code sent for successful OPTIONS (preflight) requests.

```javascript
optionsSuccessStatus: 204
```

The default is 204 (No Content), but you can change it to another status if needed for compatibility with certain clients.


### **8. maxAge**

Specifies the duration (in seconds) that the results of a preflight request can be cached by the browser.

```javascript
maxAge: 3600
```
Indicates to the browser that it can cache the preflight response for 3600 seconds (1 hour). This reduces the frequency of preflight requests for performance optimization.


### **9. preflight**

Enables or disables handling of preflight requests.

```javascript
preflight: true
```

When set to `true`, it ensures preflight handling is enabled for cross-origin requests.


### **10. hideOptionsRoute**

Hides the OPTIONS route in documentation or server logs.

```javascript
hideOptionsRoute: false
```

When false, it means the server will include the OPTIONS route in its route list, which can be useful for debugging.
If true, it hides the OPTIONS route from being explicitly listed in tools like API documentation.


<br>

## **How These Options Work Together**

**When a browser sends a cross-origin request, it may first send a preflight request (OPTIONS method) to verify server permissions.**

**The server checks the origin, method, and headers based on the above options and responds accordingly.**

**If the request is allowed, the browser proceeds with the actual request.**
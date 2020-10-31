# OpenSSL NodeJS

This package provides a simple interface to the [OpenSSL](https://www.openssl.org/) binary.  
IO operations are handled with a path config - and can be overwritten by
([Buffor](https://nodejs.org/dist/latest-v10.x/docs/api/buffer.html)) streams.

# Installation &amp; Usage

### Perform basic npm installation task:

```bash
foo@bar: npm install libopenssl --save
```

### Import openssl module:

```javascript
const openssl = require("libopenssl");
```

### Next, we need to create the config object.

```javascript
sslconfig = []; // object
sslconfig["params"] = "genrsa -out certs/domain.key 1024"; // string
sslconfig["params"] = ["genrsa", "-out", "certs/domain.key", "1024"]; // alternative: object
sslconfig["path"] = "C:/Users/heckel.timo/Temporary/OpenSSL/"; // string
sslconfig["beautify"] = true; // boolean
```

### We can now execute the openssl binary with the config object created earlier:

```javascript
openssl.run(sslconfig, function (data) {
  // the data object will contain every process output
  console.log(data);
});
```

### The last parameter of the function `run` will always be the callback function.

The Library will call this function with all return values of the process:

```js
[
  (processError: ""),
  (processOutput: "Generating RSA private key, 1024 bit long modulus (2 primes)"),
  (processExitCode: 0),
  (hasError: false),
];
```

If you want to specify Buffer text instead of the file as an input/output or whatever you need, use the version with an array as a function parameter.
And put an object with keys: name: (specify a name of file which will be created to handle this command), and buffer: (your buffer variable)
Example of object:

```javascript
{ name:'csr.conf', buffer: BufferVariable }
```

Command example:

```javascript
openssl.run(
  [
    "req",
    "-config",
    { name: "csr.conf", buffer: BufferVariable },
    "-out",
    "CSR.csr",
    "-new",
    "-newkey",
    "rsa:2048",
    "-nodes",
    "-keyout",
    "privateKey.key",
  ],
  function (data) {
    console.log(data);
  }
);
```

When you provide a command which performs IO operations, make sure to include the `path` configuration. The package will then recursivly create the specified path. All output files will appear in this folder.

Keep in mind:

> If u want to use a command which needs additional interaction use parameter `-config` and specify pass to file with configuration. For more information about the openssl config, check the official documentation.

---

That's all that you need to start using it.  
For any information, improvements or bug fixes please contact me.
This package is a fork of the really awesome library (maintained?) by [GitHub](https://github.com/codevibess).

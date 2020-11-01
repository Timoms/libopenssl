// openssl = require("./index.js");
// openssl("version", function (data) {
//   console.log(data);
// });
// openssl.version();

const openssl = require("./index.js");
sslconfig = [];
sslconfig["params"] = "genrsa -out certs/domain.key 12"; // object or string
sslconfig["path"] = "C:/Users/xx/Temporary/OpenSSL/"; // string
sslconfig["beautify"] = true; // boolean

openssl.run(sslconfig, function (data) {
  console.log(data);
});

// Invalid command 'xxx'; type "help" for a list.

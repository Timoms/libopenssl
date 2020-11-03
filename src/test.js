// openssl = require("./index.js");
// openssl("version", function (data) {
//   console.log(data);
// });
// openssl.version();

const openssl = require("./index.js");
let sslconfig = []; // object
sslconfig["params"] =
  "req -text -noout -verify -in C:\\Users\\heckel.timo\\Temporary\\SSHTest\\BB-DP-EX01.Heckel.IT.csr"; // string
sslconfig["path"] = ""; // string
sslconfig["beautify"] = true; // boolean
sslconfig["appendConf"] = true; // boolean
openssl.run(sslconfig, function (data) {
  console.log(data);
});

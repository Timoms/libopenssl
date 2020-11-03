/**
 * Open-Source module for common openssl commands.
 *
 * Run every OpenSSL command in Node.js in a handy way.
 *
 * @link   https://github.com/Timoms/openssl-nodejs
 * @file
 * @author Timo Heckel, codevibess
 */

/** jshint {inline configuration here} */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint indent: "error" */
const fs = require("fs");
const { spawn } = require("child_process");
const path = require("path");
const os = require("os"); // Comes with node.js
const operatingsystem = os.type();

const isFunction = (callback) => callback instanceof Function;

const checkIsParamsString = (params) => typeof params === "string";

const checkIfParamsArrayIsEmpty = (params) => Boolean(params.length);

const checkBufferObject = (element) =>
  element instanceof Object && element.name && Buffer.isBuffer(element.buffer);

const checkCommandForIO = (element) =>
  element.includes("-in") ||
  element.includes("-out") ||
  element.includes("-keyout") ||
  element.includes("-signkey") ||
  element.includes("-key");

const checkCommandForIOExceptIN = (element) =>
  element.includes("-out") ||
  element.includes("-keyout") ||
  element.includes("-signkey");

const checkDataTypeCompatibility = (params) => {
  const allowedParamsDataTypes = ["string", "object"];
  return allowedParamsDataTypes.includes(typeof params);
};

/*=================================================
Module Exports
=================================================*/
module.exports.run = function openssl(config, callback) {
  const stdout = [];
  const stderr = [];

  let parameters = config["params"];

  const dir =
    typeof config["path"] !== "undefined" ? config["path"] : "openssl/";

  const beautify =
    typeof config["beautify"] !== "undefined" ? config["beautify"] : true;

  const appendSampleConfig =
    typeof config["appendConf"] !== "undefined" ? config["appendConf"] : true;

  if (!isFunction(callback)) {
    throw new Error(
      `Callback must be a function, but got a ${typeof callback}`
    );
  }

  if (!checkDataTypeCompatibility(parameters)) {
    throw new Error(
      `Parameters must be string or an object, but got ${typeof parameters}`
    );
  }

  if (checkIsParamsString(parameters)) {
    parameters = parameters.split(" ");
  }

  if (!checkIfParamsArrayIsEmpty(parameters))
    throw new Error("Array of params must contain at least one parameter");

  if (parameters[0] === "openssl") parameters.shift();

  let fullPath = "";
  for (let i = 0; i <= parameters.length - 1; i++) {
    if (checkBufferObject(parameters[i])) {
      if (!fs.existsSync(dir)) {
        try {
          fs.mkdirSync(dir);
        } catch (error) {
          throw new Error(error);
        }
      }

      const filename = dir + parameters[i].name;
      // console.log("out: ", filename);
      fs.writeFileSync(filename, parameters[i].buffer, (err) => {
        if (err) {
          throw new Error(err);
        }
      });

      parameters[i] = parameters[i].name;
      parameters[i] = dir + parameters[i];
    }

    if (
      checkCommandForIO(parameters[i]) &&
      typeof parameters[i + 1] !== "object"
    ) {
      parameters[i + 1] = dir + parameters[i + 1];
      fullPath = parameters[i + 1];
    }
  }

  if (checkCommandForIOExceptIN) {
    try {
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    } catch (error) {
      throw new Error(error);
    }
  }

  let osslpath = "";
  let osslexecutable = "";
  switch (operatingsystem) {
    case "Windows_NT":
      osslpath = "\\bin\\win\\";
      osslexecutable = "openssl.exe";
      break;
    case "Linux":
      throw new Error("Linux is currently not supported.");
    case "Darwin":
      throw new Error("Darwin is currently not supported.");
  }

  const openSSLProcess = spawn(
    __dirname + osslpath + osslexecutable,
    parameters
  );
  if (appendSampleConfig) {
    parameters.unshift(__dirname + osslpath + "openssl.cnf ");
    parameters.unshift("-config");
  }

  openSSLProcess.stdout.on("data", (data) => {
    stdout.push(data);
  });

  openSSLProcess.stderr.on("data", (data) => {
    stderr.push(data);
  });

  returnValue = [];
  openSSLProcess.on("close", (code) => {
    if (beautify) {
      returnValue["processError"] = stderr.toString().replace("\r\n", "");
      returnValue["processOutput"] = stdout.toString().replace("\r\n", "");
    } else {
      returnValue["processError"] = stderr.toString();
      returnValue["processOutput"] = stdout.toString();
    }
    returnValue["processExitCode"] = code;
    returnValue["hasError"] = code !== 0;
    callback.call(null, returnValue);
  });

  return openSSLProcess;
};

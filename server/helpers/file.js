const fs = require("fs");

function getDataFromFile(filepath) {
  if (!fs.existsSync(filepath)) {
    return Promise.reject(new Error(`path not exist: '${filepath}'`));
  }
  const data = fs.readFileSync(filepath);
  return Promise.resolve(data);
}

function saveDataToFile(filepath, data) {
  fs.writeFileSync(filepath, data);
  return Promise.resolve(data);
}

function appendJSONToFile(filepath, objData) {
  appendTextToFile(filepath, JSON.stringify(objData));
}

function appendTextToFile(filepath, textData) {
  let rawData = `${textData}\n`;
  appendDataToFile(filepath, rawData);
}

function appendDataToFile(filepath, data) {
  fs.appendFileSync(filepath, data);
}

function makeDir(filepath) {
  if (fs.existsSync(filepath)) return;
  fs.mkdirSync(filepath, { recursive: true });
}

function getDirFiles(filepath, regex = new RegExp()) {
  return fs
    .readdirSync(filepath, { withFileTypes: true })
    .filter(file => file.isFile())
    .map(file => file.name)
    .filter(filename => regex.test(filename));
}

function readLines(filepath) {
  return fs
    .readFileSync(filepath)
    .toString()
    .split("\n");
}

function readJSONArray(filepath) {
  var lines = readLines(filepath);
  lines.pop(); //remove empty line
  var parsedLines = lines.map(str => JSON.parse(str));
  return parsedLines;
}

/**
 * appends/overrides array to file as JSON line by line
 * @param {string} filepath path to file
 * @param {Array} arrayData object to serialize
 * @param {bool} override override whole file or append data
 */
function writeJSONArray(filepath, arrayData, override = false) {
  if (override) clearFile(filepath);

  arrayData.forEach(data => appendJSONToFile(filepath, data));
}

function clearFile(filepath) {
  fs.writeFileSync(filepath, "");
}

module.exports = {
  makeDir,
  getDataFromFile,
  getDirFiles,
  saveDataToFile,
  appendDataToFile,
  appendTextToFile,
  appendJSONToFile,
  readLines,
  readJSONArray,
  writeJSONArray,
  clearFile
};

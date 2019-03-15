"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const colors = require("colors");
const path = require("path");
const stripcolorcodes = require("stripcolorcodes");
const util = require("util");
var pref = {
    logConfig: {
        displayModulePath: false,
        displaySystemLog: true,
        displayDate: false,
        displayTime: true,
        displayFile: true,
        displayProjectID: true,
        displayInfo: true,
        displayIcon: true,
        verboseLogTypeArray: [],
        projectID: "",
        getCalcTabSize: function () {
            return ((this.displayFile) ? 38 : 0) +
                ((this.displayIcon) ? 2 : 0) +
                ((this.displayTime) ? 11 : 0) +
                ((this.displayDate) ? 9 : 0) +
                ((this.displayProjectID && this.projectID !== '') ? (this.projectID.length + 3) : 0);
        }
    }
};
function setPreference(logConfig) {
    pref.logConfig = Object.assign({}, pref.logConfig, logConfig);
}
exports.setPreference = setPreference;
const icon_warn = "?";
const icon_error = "X";
const icon_normal = "-";
const icon_system = "*";
function _rightPaddingAt($number, $str) {
    var len = stripcolorcodes($str).length;
    var returnstr = $str;
    for (var i = 0; i < $number - len; i++) {
        returnstr += " ";
    }
    return returnstr;
}
function _repeatString($number, $str) {
    var returnstr = "";
    for (var i = 0; i < $number; i++) {
        returnstr += $str;
    }
    return returnstr;
}
function _getBlockCurrentTime() {
    return "[" + colors.gray(moment().format(((pref.logConfig.displayDate) ? "YMMDD HH:mm:ss" : "HH:mm:ss"))) + "]";
}
function _getBlockMode($mode) {
    switch ($mode) {
        case "warn":
            return colors.yellow("[" + icon_warn + "]");
        case "error":
            return colors.red("[" + icon_error + "]");
        case "system":
            return colors.cyan("[" + icon_system + "]");
        case "normal":
        default:
            return colors.white("[" + icon_normal + "]");
    }
}
function _getBlockProjectID() {
    return "[" + colors.magenta(pref.logConfig.projectID) + "]";
}
function _getBlockFile($fileAndLine) {
    return "[" + colors.cyan($fileAndLine) + "]";
}
function _rightPaddingPrefix($str) {
    return _rightPaddingAt(pref.logConfig.getCalcTabSize(), $str);
}
function _getBlockPrefix($mode, $fileAndLine) {
    return (pref.logConfig.displayInfo) ? _rightPaddingPrefix(((pref.logConfig.displayIcon) ? _getBlockMode($mode) : "") +
        ((pref.logConfig.displayTime) ? _getBlockCurrentTime() + " " : "") +
        ((pref.logConfig.displayProjectID && pref.logConfig.projectID !== '') ? _getBlockProjectID() : "") +
        ((pref.logConfig.displayFile) ? _getBlockFile($fileAndLine) : "")) : "";
}
function _getFileStack() {
    var stack = (new Error().stack).toString();
    var reg = /[(]?([a-z\-\&A-Z._:0-9/]+[0-9]+:[0-9]+)[)]?/mg;
    var match;
    var matcharray = [];
    while ((match = reg.exec(stack)) != null) {
        matcharray.push(match[1]);
    }
    var folder = path.resolve(__dirname, "../../");
    //console.log(matcharray);
    return matcharray[2].split(folder)[1];
}
/**
 * Default Log (console.log) with options
 * @param $str
 */
function log($str) {
    var logLineDetails = _getFileStack();
    arguments[0] = _getBlockPrefix("normal", logLineDetails) + " " + arguments[0];
    console.log.apply(this, arguments);
}
exports.log = log;
/**
 * Default Log with warn type
 * @param $str
 */
function warn($str) {
    var logLineDetails = _getFileStack();
    arguments[0] = _getBlockPrefix("warn", logLineDetails) + " " + arguments[0];
    console.log.apply(this, arguments);
}
exports.warn = warn;
/**
 * Error Log
 * @param $str
 */
function error($str) {
    var logLineDetails = _getFileStack();
    arguments[0] = _getBlockPrefix("error", logLineDetails) + " " + arguments[0];
    console.log.apply(this, arguments);
}
exports.error = error;
/**
 * Default Log, but mark as system type
 * @param $str
 */
function systemLog($str) {
    var logLineDetails = _getFileStack();
    arguments[0] = _getBlockPrefix("system", logLineDetails) + " " + arguments[0];
    console.log.apply(this, arguments);
}
exports.systemLog = systemLog;
/**
 * Default Log, but mark as specific type
 * @param $type Specific Type (This can be set verbose anytime at preference.logConfig.verboseLogTypeArray[])
 * @param $str
 */
function logWithType($type, $str) {
    var logLineDetails = _getFileStack();
    $str = _getBlockPrefix("normal", logLineDetails) + " " + $str;
    if (pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) === -1)
        console.log($str);
}
exports.logWithType = logWithType;
/**
 * Log current function location
 * @param $str
 */
function logFunction($str) {
    $str = ($str == null) ? "" : colors.gray(" -- " + $str);
    var stack = (new Error().stack).toString();
    var reg = /(at ([a-zA-Z0-9.]+) )/mg;
    var match;
    var matcharray = [];
    while ((match = reg.exec(stack)) != null) {
        matcharray.push(match[2]);
    }
    var functionName = matcharray[1];
    var str = "[" + colors.blue("FUNCTION") + "] " + colors.blue(functionName + "()") + $str;
    var logLineDetails = _getFileStack();
    var $type = "sys-function";
    var content = _getBlockPrefix("normal", logLineDetails) + " " + str;
    if (pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) == -1)
        console.log(content);
}
exports.logFunction = logFunction;
function logCallerFunction($str) {
    $str = ($str == null) ? "" : colors.gray(" -- " + $str);
    var stack = (new Error().stack).toString();
    var reg = /(at ([a-zA-Z0-9.]+) )/mg;
    var match;
    var matcharray = [];
    while ((match = reg.exec(stack)) != null) {
        matcharray.push(match[2]);
    }
    var functionName = matcharray[2];
    var str = "[" + colors.blue("CALLER_FUNCTION") + "] " + colors.blue(functionName + "()") + $str;
    var logLineDetails = _getFileStack();
    var $type = "sys-function";
    var content = _getBlockPrefix("normal", logLineDetails) + " " + str;
    if (pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) == -1)
        console.log(content);
}
exports.logCallerFunction = logCallerFunction;
/**
 * Log and indent to the main grid column
 * @param $str
 */
function logWithTab($str) {
    var logLineDetails = _getFileStack();
    var textlength = stripcolorcodes(_getBlockPrefix("normal", logLineDetails)).length;
    arguments[0] = ((pref.logConfig.displayInfo) ? _rightPaddingAt(textlength, " ") : "") + " " + arguments[0];
    console.log.apply(this, arguments);
}
exports.logWithTab = logWithTab;
/**
 * Nothing special right now, just object inspector (TODO:Prettify)
 * @param $object
 * @param $depth
 */
function inspect($object, $depth = 3) {
    $depth = ($depth == null) ? 3 : $depth;
    console.log(util.inspect($object, { showHidden: false, depth: $depth }));
}
exports.inspect = inspect;
/**
 * Log Section with formatting
 * @param $name
 * @param $size
 */
function section($name, $size = 0) {
    $size = $size || 0;
    this.line(0, "=", $size);
    console.log(colors.gray("   " + $name));
    this.line($size, "=", 0);
}
exports.section = section;
const LINE_WIDTH = 160;
/**
 * Log Line
 * @param $size
 * @param $style
 * @param $bottomsize
 */
function line($size = 0, $style = '-', $bottomsize) {
    $bottomsize = ($bottomsize === undefined) ? $size : $bottomsize;
    $style = $style || "-";
    var i;
    for (i = 0; i < $size; i++) {
        console.log("");
    }
    console.log(colors.gray(_repeatString(LINE_WIDTH, $style)));
    for (i = 0; i < $bottomsize; i++) {
        console.log("");
    }
}
exports.line = line;

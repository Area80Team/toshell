"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
const colors = require("colors");
const path = require("path");
const stripcolorcodes = require("stripcolorcodes");
const util = require("util");
function getColorCode(color) {
    switch (color) {
        case '_reset':
            return '\x1b[0m';
        case 'txt_bright':
            return '\x1b[1m';
        case 'txt_dim':
            return '\x1b[2m';
        case 'txt_underscore':
            return '\x1b[4m';
        case 'txt_blink':
            return '\x1b[5m';
        case 'txt_reverse':
            return '\x1b[7m';
        case 'txt_hidden':
            return '\x1b[8m';
        case 'black':
            return '\x1b[30m';
        case 'red':
            return '\x1b[31m';
        case 'green':
            return '\x1b[32m';
        case 'yellow':
            return '\x1b[33m';
        case 'blue':
            return '\x1b[34m';
        case 'magenta':
            return '\x1b[35m';
        case 'cyan':
            return '\x1b[36m';
        case 'white':
            return '\x1b[37m';
        case 'bg_black':
            return '\x1b[40m';
        case 'bg_red':
            return '\x1b[41m';
        case 'bg_green':
            return '\x1b[42m';
        case 'bg_yellow':
            return '\x1b[43m';
        case 'bg_blue':
            return '\x1b[44m';
        case 'bg_magenta':
            return '\x1b[45m';
        case 'bg_cyan':
            return '\x1b[46m';
        case 'bg_white':
            return '\x1b[47m';
    }
}
var standardPreference = {
    logConfig: {
        displayDate: false,
        displayTime: true,
        displayFile: true,
        displayProjectID: true,
        displayInfo: true,
        fileMaxLength: 34,
        displayIcon: true,
        verboseLogTypeArray: [],
        projectID: "",
        //rootFolder: path.resolve(__dirname, "../../../")
        rootFolder: path.resolve(path.dirname(require.main.filename), '../')
    }
};
const LINE_WIDTH = 160;
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
function _getBlockFile($fileAndLine) {
    return "[" + colors.cyan($fileAndLine) + "]";
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
class ToShell {
    constructor(logConfig) {
        this.pref = {
            logConfig: Object.assign({}, standardPreference.logConfig, logConfig)
        };
    }
    /**
     * Create New Instance of ToShell
     * @param logConfig
     * @param inheritConfig copy current config to new instance or use default configuration
     */
    newInstance(logConfig, inheritConfig) {
        if (inheritConfig) {
            return new ToShell(Object.assign({}, this.pref.logConfig, logConfig));
        }
        else {
            return new ToShell(logConfig);
        }
    }
    _getBlockCurrentTime() {
        return "[" + colors.gray(moment().format(((this.pref.logConfig.displayDate) ? "YMMDD HH:mm:ss" : "HH:mm:ss"))) + "]";
    }
    _getBlockProjectID() {
        return "[" + colors.magenta(this.pref.logConfig.projectID) + "]";
    }
    _getCalcTabSize() {
        return ((this.pref.logConfig.displayFile) ? this.pref.logConfig.fileMaxLength : 0) +
            ((this.pref.logConfig.displayIcon) ? 3 : 0) +
            ((this.pref.logConfig.displayTime) ? 10 : 0) +
            ((this.pref.logConfig.displayDate) ? 9 : 0) +
            ((this.pref.logConfig.displayProjectID && this.pref.logConfig.projectID !== '') ? (this.pref.logConfig.projectID.length + 2) : 0);
    }
    _rightPaddingPrefix($str) {
        return _rightPaddingAt(this._getCalcTabSize(), $str);
    }
    /**
     * Set Preference of current instance
     * @param logConfig
     */
    setPreference(logConfig) {
        this.pref.logConfig = Object.assign({}, this.pref.logConfig, logConfig);
    }
    _getBlockPrefix($mode, $fileAndLine) {
        return (this.pref.logConfig.displayInfo) ? this._rightPaddingPrefix(((this.pref.logConfig.displayIcon) ? _getBlockMode($mode) : "") +
            ((this.pref.logConfig.displayTime) ? this._getBlockCurrentTime() + "" : "") +
            ((this.pref.logConfig.displayProjectID && this.pref.logConfig.projectID !== '') ? this._getBlockProjectID() : "") +
            ((this.pref.logConfig.displayFile) ? _getBlockFile($fileAndLine) : "")) : "";
    }
    _getFileStack() {
        var stack = (new Error().stack).toString();
        //console.log(stack);
        var reg = /[(]?([a-z\-\&A-Z._:0-9/]+[0-9]+:[0-9]+)[)]?/mg;
        var match;
        var matcharray = [];
        while ((match = reg.exec(stack)) != null) {
            matcharray.push(match[1]);
        }
        var folder = this.pref.logConfig.rootFolder;
        //console.log(matcharray);
        var file = matcharray[2].split(folder)[1];
        if (!file) {
            file = matcharray[2];
        }
        if (file.length > this.pref.logConfig.fileMaxLength)
            file = '...' + file.slice(file.length - (this.pref.logConfig.fileMaxLength - 3));
        return file;
    }
    /**
     * Wrap string with color code
     * @param {ColorName} name
     * @param {string} message
     * @return {string}
     */
    color(name, message) {
        return `${getColorCode(name)}${message}${getColorCode('_reset')}`;
    }
    /**
     * Default Log (console.log) with options
     * @param $str
     */
    log($str) {
        var logLineDetails = this._getFileStack();
        arguments[0] = this._getBlockPrefix("normal", logLineDetails) + " " + arguments[0];
        console.log.apply(this, arguments);
    }
    /**
     * Default Log with warn type
     * @param $str
     */
    warn($str) {
        var logLineDetails = this._getFileStack();
        arguments[0] = this._getBlockPrefix("warn", logLineDetails) + " " + arguments[0];
        console.log.apply(this, arguments);
    }
    /**
     * Error Log
     * @param $str
     */
    error($str) {
        var logLineDetails = this._getFileStack();
        arguments[0] = this._getBlockPrefix("error", logLineDetails) + " " + arguments[0];
        console.log.apply(this, arguments);
    }
    /**
     * Default Log, but mark as system type
     * @param $str
     */
    systemLog($str) {
        var logLineDetails = this._getFileStack();
        arguments[0] = this._getBlockPrefix("system", logLineDetails) + " " + arguments[0];
        console.log.apply(this, arguments);
    }
    /**
     * Default Log, but mark as specific type
     * @param $type Specific Type (This can be set verbose anytime at preference.logConfig.verboseLogTypeArray[])
     * @param $str
     */
    logWithType($type, $str) {
        var logLineDetails = this._getFileStack();
        $str = this._getBlockPrefix("normal", logLineDetails) + " " + $str;
        if (this.pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) === -1)
            console.log($str);
    }
    /**
     * Log current private location
     * @param $str
     */
    logFunction($str) {
        $str = ($str == null) ? "" : colors.gray(" -- " + $str);
        var stack = (new Error().stack).toString();
        var reg = /(at ([a-zA-Z0-9.]+) )/mg;
        var match;
        var matcharray = [];
        while ((match = reg.exec(stack)) != null) {
            matcharray.push(match[2]);
        }
        var privateName = matcharray[1];
        var str = "[" + colors.blue("FUNCTION") + "] " + colors.blue(privateName + "()") + $str;
        var logLineDetails = this._getFileStack();
        var $type = "sys-private";
        var content = this._getBlockPrefix("normal", logLineDetails) + " " + str;
        if (this.pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) == -1)
            console.log(content);
    }
    logCallerFunction($str) {
        $str = ($str == null) ? "" : colors.gray(" -- " + $str);
        var stack = (new Error().stack).toString();
        var reg = /(at ([a-zA-Z0-9.]+) )/mg;
        var match;
        var matcharray = [];
        while ((match = reg.exec(stack)) != null) {
            matcharray.push(match[2]);
        }
        var privateName = matcharray[2];
        var str = "[" + colors.blue("CALLER_FUNCTION") + "] " + colors.blue(privateName + "()") + $str;
        var logLineDetails = this._getFileStack();
        var $type = "sys-private";
        var content = this._getBlockPrefix("normal", logLineDetails) + " " + str;
        if (this.pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) == -1)
            console.log(content);
    }
    /**
     * Log and indent to the main grid column
     * @param $str
     */
    logWithTab($str) {
        var logLineDetails = this._getFileStack();
        var textlength = stripcolorcodes(this._getBlockPrefix("normal", logLineDetails)).length;
        arguments[0] = ((this.pref.logConfig.displayInfo) ? _rightPaddingAt(textlength, " ") : "") + " " + arguments[0];
        console.log.apply(this, arguments);
    }
    /**
     * Nothing special right now, just object inspector
     * @param $object
     * @param $depth
     */
    inspect($object, $depth = 3) {
        $depth = ($depth == null) ? 3 : $depth;
        console.log(util.inspect($object, { showHidden: false, depth: $depth, colors: true }));
    }
    /**
     * Log Section with formatting
     * @param $name
     * @param $size
     */
    section($name, $size = 0) {
        $size = $size || 0;
        this.line(0, "=", $size);
        console.log(colors.gray("   " + $name));
        this.line($size, "=", 0);
    }
    /**
     * Log Line
     * @param $size
     * @param $style
     * @param $bottomsize
     */
    line($size = 0, $style = '-', $bottomsize) {
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
}
exports.ToShell = ToShell;
const defaultInstance = new ToShell();
exports.default = defaultInstance;

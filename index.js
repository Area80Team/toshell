var moment          = require("moment");
var colors          = require("colors");
var stripcolorcodes = require("stripcolorcodes");
/* node libs*/
var path            = require("path");
var util            = require("util");

function getPreference () {
	return {
			displaySystemLog : true, //display log that calls via logger.systelLog
			displayDate      : false, //display date
			displayTime      : true, //display time
			displayFile      : true, //display script path for each line
			displayProjectID : true, //display project id
			displayInfo      : true, //display additional information
			displayIcon      : true, //display icon
			verboseLogTypeArray: [], //disable some log type when use logger.logWithType 
			projectID          : "LOG", //project id
			getCalcTabSize     : function () {
				return ((this.displayFile) ? 38 : 0) +
					   ((this.displayIcon) ? 2 : 0) +
					   ((this.displayTime) ? 11 : 0) +
					   ((this.displayDate) ? 9 : 0) +
					   ((this.displayProjectID) ? (this.projectID.length + 3) : 0);
			} //this will use to calculate tab size of the log line
	};
}

if(global._toShellLoggerPreference === undefined) {
	global._toShellLoggerPreference = getPreference();
}
var globpref = global._toShellLoggerPreference;

function Logger() {
	"use strict";
	var icon_warn   = "?";
	var icon_error  = "X";
	var icon_normal = "-";
	var icon_system = "*";
	this.pref = globpref;
	
	
	this.setPreference = function (newPref, forTheSessionOnly) {
		if(forTheSessionOnly === true) {
			this.pref = getPreference();
		} else {
			this.pref = globpref;
		}
		for(var prop in this.pref) {
			if(newPref.hasOwnProperty(prop)) {
				this.pref[prop] = newPref[prop];
			}
		}
	};

	this._getBlockPrefix = function ($mode, $fileAndLine) {

		return (this.pref.displayInfo) ? this._rightPaddingPrefix
												  (
													  ((this.pref.displayIcon) ? this._getBlockMode($mode) : "") +
													  ((this.pref.displayTime) ? this._getBlockCurrentTime() + " " : "") +
													  ((this.pref.displayProjectID) ? this._getBlockProjectID() : "") +
													  ((this.pref.displayFile) ? this._getBlockFile($fileAndLine) : "")
												  ) : "";
	};

	this._getBlockCurrentTime = function () {
		return "[" + colors.gray(
				moment().format(((this.pref.displayDate) ? "YYYY-MM-DD HH:mm:ss" : "HH:mm:ss"))
			) + "]";
	};
	this._getColorFromMode = function ($mode, code) {
		switch ($mode) {
			case "warn":
				return colors.yellow(code);
			case "error":
				return colors.red(code);
			case "system":
				return colors.cyan(code);
			case "normal":
			default:
				return colors.white(code);
		}
	};
	this._getBlockMode        = function ($mode) {
		switch ($mode) {
			case "warn":
				return this._getColorFromMode($mode, "[" + icon_warn + "]");
			case "error":
				return this._getColorFromMode($mode, "[" + icon_error + "]");
			case "system":
				return this._getColorFromMode($mode, "[" + icon_system + "]");
			case "normal":
			default:
				return this._getColorFromMode($mode, "[" + icon_normal + "]");
		}

	};
	this._getBlockProcessPID  = function () {
		return "[" + colors.gray(process.pid) + "]";
	};
	this._getBlockProjectID   = function () {
		return "[" + colors.magenta(this.pref.projectID) + "]";
	};
	this._getBlockFile        = function ($fileAndLine) {
		// var folder = path.resolve(__dirname,"../../");
		// var fileAndLine = $fileAndLine.split(folder)[1];
		return "[" + colors.cyan($fileAndLine) + "]";
	};

	this._getFileStack       = function () {
		var stack = (new Error().stack).toString();
		var currentProjectPath = path.resolve(__dirname) + "/";
		stack = stack.split(currentProjectPath).join("");

		var reg        = /[(]?([a-z\-\&A-Z._:0-9/]+[0-9]+:[0-9]+)[)]?/mg;
		var match;
		var matcharray = [];
		while ((match = reg.exec(stack)) != null) {
			matcharray.push(match[1]);
		}
		//console.log(path.resolve(__dirname));
		//var folder = path.resolve(__dirname, pref.startProjectDirectory);
		var folder = path.resolve(__dirname, "./");
		//console.log(matcharray);
		return matcharray[2];

	};
	this._rightPaddingPrefix = function ($str) {
		return this._rightPaddingAt(this.pref.getCalcTabSize(), $str);
	};
	this._rightPaddingAt     = function ($number, $str) {
		var len       = stripcolorcodes($str).length;
		var returnstr = $str;
		for (var i = 0; i < $number - len; i++) {
			returnstr += " ";
		}
		return returnstr;
	};
	this._repearString       = function ($number, $str) {
		var returnstr = "";
		for (var i = 0; i < $number; i++) {
			returnstr += $str;
		}
		return returnstr;
	};

}

/**
 * Default Log (console.log) with options
 * @param $str
 */
Logger.prototype.log = function ($str) {
	var logLineDetails = this._getFileStack();
	arguments[0]       = this._getBlockPrefix("normal", logLineDetails) + (this.pref.displayInfo?" ":"") + arguments[0];
	console.log.apply(this, arguments);
};
/**
 * Default Log with warn type
 * @param $str
 */
Logger.prototype.warn = function ($str) {
	var logLineDetails = this._getFileStack();
	arguments[0]       = this._getBlockPrefix("warn", logLineDetails) + (this.pref.displayInfo?" ":"") + this._getColorFromMode("warn", arguments[0]);
	console.log.apply(this, arguments);
};
/**
 * Error Log
 * @param $str
 */
Logger.prototype.error = function ($str) {
	var logLineDetails = this._getFileStack();
	arguments[0]       = this._getBlockPrefix("error", logLineDetails) + (this.pref.displayInfo?" ":"") + this._getColorFromMode("error", arguments[0]);
	console.log.apply(this, arguments);
};
/**
 * Default Log, but mark as system type
 * @param $str
 */
Logger.prototype.systemLog = function ($str) {
	var logLineDetails = this._getFileStack();
	arguments[0]       = this._getBlockPrefix("system", logLineDetails) + (this.pref.displayInfo?" ":"") +  this._getColorFromMode("system", arguments[0]);
	console.log.apply(this, arguments);
};
/**
 * Default Log, but mark as specific type
 * @param $type Specific Type (This can be set verbose anytime at preference.logConfig.verboseLogTypeArray[])
 * @param $str
 */
Logger.prototype.logWithType = function ($type, $str) {
	var logLineDetails = this._getFileStack();


	$str = this._getBlockPrefix("normal", logLineDetails) + (this.pref.displayInfo?" ":"") + $str;
	if (this.pref.verboseLogTypeArray.indexOf($type.toLowerCase()) === -1) console.log($str);
};
Logger.prototype.logFunction       = function ($str) {
	$str = ($str == null) ? "" : colors.gray(" -- " + $str);


	var stack      = (new Error().stack).toString();
	var reg        = /(at ([a-zA-Z0-9.]+) )/mg;
	var match;
	var matcharray = [];

	while ((match = reg.exec(stack)) != null) {
		matcharray.push(match[2]);
	}
	var functionName = matcharray[1];

	var str = "[" + colors.blue("FUNCTION") + "] " + colors.blue(functionName + "()") + $str;

	var logLineDetails = this._getFileStack();
	var $type          = "sys-function";

	var content = this._getBlockPrefix("normal", logLineDetails) + " " + str;
	if (this.pref.verboseLogTypeArray.indexOf($type.toLowerCase()) == -1) console.log(content);
};
Logger.prototype.logCallerFunction = function ($str) {
	$str = ($str == null) ? "" : colors.gray(" -- " + $str);


	var stack      = (new Error().stack).toString();
	var reg        = /(at ([a-zA-Z0-9.]+) )/mg;
	var match;
	var matcharray = [];

	while ((match = reg.exec(stack)) != null) {
		matcharray.push(match[2]);
	}
	var functionName = matcharray[2];

	var str = "[" + colors.blue("CALLER_FUNCTION") + "] " + colors.blue(functionName + "()") + $str;

	var logLineDetails = this._getFileStack();
	var $type          = "sys-function";

	var content = this._getBlockPrefix("normal", logLineDetails) + (this.pref.displayInfo?" ":"") + str;
	if (this.pref.verboseLogTypeArray.indexOf($type.toLowerCase()) === -1) console.log(content);
};
/**
 * Log and indent to the main grid column
 * @param $str
 */
Logger.prototype.logWithTab = function ($str) {
	var logLineDetails = this._getFileStack();
	var textlength     = stripcolorcodes(this._getBlockPrefix("normal", logLineDetails)).length;

	arguments[0] = ((this.pref.displayInfo) ? this._rightPaddingAt(textlength, " ") : "") + (this.pref.displayInfo?" ":"") + arguments[0];
	console.log.apply(this, arguments);
};
/**
 * Nothing special right now, just object inspector (TODO:Prettify)
 * @param $object
 * @param $depth {number=3}
 */
Logger.prototype.inspect = function ($object, $depth) {
	$depth = ($depth === undefined || $depth === null) ? 3 : $depth;
	console.log(util.inspect($object, {showHidden: false, depth: $depth}));
};
/**
 * Log Section with formatting
 * @param $name
 * @param $size {number=0}
 */
Logger.prototype.section = function ($name, $size) {
	$size = $size || 0;
	this.line(0, "=", $size);
	console.log(colors.gray("   " + $name));
	this.line($size, "=", 0);
};

/**
 * Log Line
 * @param $size     {number=0}
 * @param $style    {string=""}
 * @param $bottomsize {number=0}
 */
Logger.prototype.line = function ($size, $style, $bottomsize) {
	"use strict";
	$size       = ($size != null) ? $size : 0;
	$bottomsize = ($bottomsize !== null) ? $bottomsize : $size;

	$style = $style || "-";
	var i;
	for (i = 0; i < $size; i++) {console.log("");}
	console.log(colors.gray(this._repearString(this.LINE_WIDTH, $style)));
	for (i = 0; i < $bottomsize; i++) {console.log("");}
};

Logger.prototype.LINE_WIDTH = 160;

module.exports = new Logger();
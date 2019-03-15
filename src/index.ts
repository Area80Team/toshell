import * as moment from 'moment';
import * as colors from 'colors';
import * as path from 'path';
import * as stripcolorcodes from 'stripcolorcodes';
import * as util from 'util';

type Preference = {
	logConfig: {
		displayModulePath: boolean,
		displaySystemLog: boolean,
		displayDate: boolean,
		displayTime: boolean,
		displayFile: boolean,
		displayProjectID: boolean,
		displayInfo: boolean,
		displayIcon: boolean,
		verboseLogTypeArray: string[],
		projectID: string,
		getCalcTabSize(): number;
	}
}
export type ILogConfig = {
	displayModulePath?: boolean,
	displaySystemLog?: boolean,
	displayDate?: boolean,
	displayTime?: boolean,
	displayFile?: boolean,
	displayProjectID?: boolean,
	displayInfo?: boolean,
	displayIcon?: boolean,
	verboseLogTypeArray?: string[],
	projectID?: string,
	getCalcTabSize?(): number;
};
var pref: Preference = {
	logConfig: {
		displayModulePath: false,
		displaySystemLog: true,
		displayDate: false,
		displayTime: true,
		displayFile: true,
		displayProjectID: true,
		displayInfo: true,
		displayIcon: true,
		verboseLogTypeArray: [], //verbose log when use logger.logWithType
		projectID: "",
		getCalcTabSize: function () {
			return ((this.displayFile) ? 38 : 0) +
				((this.displayIcon) ? 2 : 0) +
				((this.displayTime) ? 11 : 0) +
				((this.displayDate) ? 9 : 0) +
				((this.displayProjectID && this.projectID!=='') ? (this.projectID.length + 3) : 0);
		}
	}
};

export function setPreference(logConfig: ILogConfig) {
	pref.logConfig = {
		...pref.logConfig,
		...logConfig
	}
}


const icon_warn = "?";
const icon_error = "X";
const icon_normal = "-";
const icon_system = "*";

function _rightPaddingAt($number: number, $str: string) {
	var len = stripcolorcodes($str).length;
	var returnstr = $str;
	for (var i = 0; i < $number - len; i++) {
		returnstr += " ";
	}
	return returnstr;
}

function _repeatString($number: number, $str: string): string {
	var returnstr = "";
	for (var i = 0; i < $number; i++) {
		returnstr += $str;
	}
	return returnstr;
}

function _getBlockCurrentTime(): string {
	return "[" + colors.gray(
		moment().format(((pref.logConfig.displayDate) ? "YMMDD HH:mm:ss" : "HH:mm:ss"))
	) + "]";
}

type BlockMode = 'warn' | 'error' | 'system' | 'normal';

function _getBlockMode($mode: BlockMode): string {
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

function _getBlockProjectID(): string {
	return "[" + colors.magenta(pref.logConfig.projectID) + "]";
}

function _getBlockFile($fileAndLine): string {
	return "[" + colors.cyan($fileAndLine) + "]";
}

function _rightPaddingPrefix($str): string {
	return _rightPaddingAt(pref.logConfig.getCalcTabSize(), $str);
}

function _getBlockPrefix($mode, $fileAndLine): string {
	return (pref.logConfig.displayInfo) ? _rightPaddingPrefix
	(
		((pref.logConfig.displayIcon) ? _getBlockMode($mode) : "") +
		((pref.logConfig.displayTime) ? _getBlockCurrentTime() + " " : "") +
		((pref.logConfig.displayProjectID && pref.logConfig.projectID!=='') ? _getBlockProjectID() : "") +
		((pref.logConfig.displayFile) ? _getBlockFile($fileAndLine) : "")
	) : "";
}

function _getFileStack(): string {
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
export function log($str) {
	var logLineDetails = _getFileStack();
	arguments[0] = _getBlockPrefix("normal", logLineDetails) + " " + arguments[0];
	console.log.apply(this, arguments);
}

/**
 * Default Log with warn type
 * @param $str
 */
export function warn($str) {
	var logLineDetails = _getFileStack();
	arguments[0] = _getBlockPrefix("warn", logLineDetails) + " " + arguments[0];
	console.log.apply(this, arguments);
}

/**
 * Error Log
 * @param $str
 */
export function error($str) {
	var logLineDetails = _getFileStack();
	arguments[0] = _getBlockPrefix("error", logLineDetails) + " " + arguments[0];
	console.log.apply(this, arguments);
}

/**
 * Default Log, but mark as system type
 * @param $str
 */
export function systemLog($str: string): void {
	var logLineDetails = _getFileStack();
	arguments[0] = _getBlockPrefix("system", logLineDetails) + " " + arguments[0];
	console.log.apply(this, arguments);
}

/**
 * Default Log, but mark as specific type
 * @param $type Specific Type (This can be set verbose anytime at preference.logConfig.verboseLogTypeArray[])
 * @param $str
 */
export function logWithType($type: string, $str: string): void {
	var logLineDetails = _getFileStack();
	$str = _getBlockPrefix("normal", logLineDetails) + " " + $str;
	if (pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) === -1) console.log($str);
}

/**
 * Log current function location
 * @param $str
 */
export function logFunction($str: string): void {
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
	if (pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) == -1) console.log(content);
}

export function logCallerFunction($str: string): void {
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
	if (pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) == -1) console.log(content);
}

/**
 * Log and indent to the main grid column
 * @param $str
 */
export function logWithTab($str: string): void {
	var logLineDetails = _getFileStack();
	var textlength = stripcolorcodes(_getBlockPrefix("normal", logLineDetails)).length;

	arguments[0] = ((pref.logConfig.displayInfo) ? _rightPaddingAt(textlength, " ") : "") + " " + arguments[0];
	console.log.apply(this, arguments);
}



/**
 * Nothing special right now, just object inspector (TODO:Prettify)
 * @param $object
 * @param $depth
 */

export function inspect($object: any, $depth: number = 3): void {
	$depth = ($depth == null) ? 3 : $depth;
	console.log(util.inspect($object, {showHidden: false, depth: $depth}));
}

/**
 * Log Section with formatting
 * @param $name
 * @param $size
 */
export function section($name: string, $size: number = 0): void {
	$size = $size || 0;
	this.line(0, "=", $size);
	console.log(colors.gray("   " + $name));
	this.line($size, "=", 0);
}

const LINE_WIDTH = 160;

/**
 * Log Line
 * @param $size
 * @param $style
 * @param $bottomsize
 */
export function line($size: number = 0, $style: '-' | '=' | string = '-', $bottomsize?: number): void {
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

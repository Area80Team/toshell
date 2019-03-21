import * as moment from 'moment';
import * as colors from 'colors';
import * as path from 'path';
import * as stripcolorcodes from 'stripcolorcodes';
import * as util from 'util';

type Preference = {
	logConfig: {
		displayDate: boolean,
		displayTime: boolean,
		displayFile: boolean,
		displayProjectID: boolean,
		displayInfo: boolean,
		fileMaxLength: number,
		displayIcon: boolean,
		verboseLogTypeArray: string[],
		projectID: string,
		rootFolder: string
	}
}
type ILogConfig = {
	displayDate?: boolean,
	displayTime?: boolean,
	displayFile?: boolean,
	displayProjectID?: boolean,
	displayInfo?: boolean,
	fileMaxLength?: number,
	displayIcon?: boolean,
	verboseLogTypeArray?: string[],
	projectID?: string,
	rootFolder?: string
};
var standardPreference: Preference = {
	logConfig: {
		displayDate: false,
		displayTime: true,
		displayFile: true,
		displayProjectID: true,
		displayInfo: true,
		fileMaxLength: 34,
		displayIcon: true,
		verboseLogTypeArray: [], //verbose log when use logger.logWithType
		projectID: "",
		rootFolder: path.resolve(__dirname, "../../../")
	}
};

const LINE_WIDTH = 160;

const icon_warn = "?";
const icon_error = "X";
const icon_normal = "-";
const icon_system = "*";
type BlockMode = 'warn' | 'error' | 'system' | 'normal';


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

function _getBlockFile($fileAndLine): string {
	return "[" + colors.cyan($fileAndLine) + "]";
}

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


export class ToShell {
	pref: Preference;

	constructor(logConfig?: ILogConfig) {
		this.pref = {
			logConfig: {
				...standardPreference.logConfig,
				...logConfig
			}
		};
	}

	/**
	 * Create New Instance of ToShell
	 * @param logConfig
	 * @param inheritConfig copy current config to new instance or use default configuration
	 */
	newInstance(logConfig?: ILogConfig, inheritConfig?: boolean): ToShell {
		if (inheritConfig) {
			return new ToShell({
				...this.pref.logConfig,
				...logConfig
			});
		} else {
			return new ToShell(logConfig);
		}
	}

	private _getBlockCurrentTime(): string {
		return "[" + colors.gray(
			moment().format(((this.pref.logConfig.displayDate) ? "YMMDD HH:mm:ss" : "HH:mm:ss"))
		) + "]";
	}


	private _getBlockProjectID(): string {
		return "[" + colors.magenta(this.pref.logConfig.projectID) + "]";
	}

	private _getCalcTabSize() {
		return ((this.pref.logConfig.displayFile) ? this.pref.logConfig.fileMaxLength : 0) +
			((this.pref.logConfig.displayIcon) ? 3 : 0) +
			((this.pref.logConfig.displayTime) ? 10 : 0) +
			((this.pref.logConfig.displayDate) ? 9 : 0) +
			((this.pref.logConfig.displayProjectID && this.pref.logConfig.projectID !== '') ? (this.pref.logConfig.projectID.length + 2) : 0);
	}

	private _rightPaddingPrefix($str): string {
		return _rightPaddingAt(this._getCalcTabSize(), $str);
	}

	/**
	 * Set Preference of current instance
	 * @param logConfig
	 */
	setPreference(logConfig: ILogConfig) {
		this.pref.logConfig = {
			...this.pref.logConfig,
			...logConfig
		}
	}


	private _getBlockPrefix($mode, $fileAndLine): string {
		return (this.pref.logConfig.displayInfo) ? this._rightPaddingPrefix
		(
			((this.pref.logConfig.displayIcon) ? _getBlockMode($mode) : "") +
			((this.pref.logConfig.displayTime) ? this._getBlockCurrentTime() + "" : "") +
			((this.pref.logConfig.displayProjectID && this.pref.logConfig.projectID !== '') ? this._getBlockProjectID() : "") +
			((this.pref.logConfig.displayFile) ? _getBlockFile($fileAndLine) : "")
		) : "";
	}

	private _getFileStack(): string {
		var stack = (new Error().stack).toString();

		var reg = /[(]?([a-z\-\&A-Z._:0-9/]+[0-9]+:[0-9]+)[)]?/mg;
		var match;
		var matcharray = [];
		while ((match = reg.exec(stack)) != null) {
			matcharray.push(match[1]);
		}
		var folder = this.pref.logConfig.rootFolder;
		//console.log(matcharray);
		var file = <string>matcharray[2].split(folder)[1];
		if (file.length > this.pref.logConfig.fileMaxLength) file = '...' + file.slice(file.length - (this.pref.logConfig.fileMaxLength - 3))
		return file;

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
	systemLog($str: string): void {
		var logLineDetails = this._getFileStack();
		arguments[0] = this._getBlockPrefix("system", logLineDetails) + " " + arguments[0];
		console.log.apply(this, arguments);
	}

	/**
	 * Default Log, but mark as specific type
	 * @param $type Specific Type (This can be set verbose anytime at preference.logConfig.verboseLogTypeArray[])
	 * @param $str
	 */
	logWithType($type: string, $str: string): void {
		var logLineDetails = this._getFileStack();
		$str = this._getBlockPrefix("normal", logLineDetails) + " " + $str;
		if (this.pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) === -1) console.log($str);
	}

	/**
	 * Log current private location
	 * @param $str
	 */
	logFunction($str: string): void {

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

		if (this.pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) == -1) console.log(content);

	}

	logCallerFunction($str: string): void {

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
		if (this.pref.logConfig.verboseLogTypeArray.indexOf($type.toLowerCase()) == -1) console.log(content);
	}

	/**
	 * Log and indent to the main grid column
	 * @param $str
	 */
	logWithTab($str: string): void {
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

	inspect($object: any, $depth: number = 3): void {
		$depth = ($depth == null) ? 3 : $depth;
		console.log(util.inspect($object, {showHidden: false, depth: $depth, colors: true}));
	}

	/**
	 * Log Section with formatting
	 * @param $name
	 * @param $size
	 */
	section($name: string, $size: number = 0): void {
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
	line($size: number = 0, $style: '-' | '=' | string = '-', $bottomsize?: number): void {
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
const defaultInstance = new ToShell();

export default defaultInstance;
declare type ColorName = '_reset' | 'txt_bright' | 'txt_dim' | 'txt_underscore' | 'txt_blink' | 'txt_reverse' | 'txt_hidden' | 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'bg_black' | 'bg_red' | 'bg_green' | 'bg_yellow' | 'bg_blue' | 'bg_magenta' | 'bg_cyan' | 'bg_white';
declare type Preference = {
    logConfig: {
        displayDate: boolean;
        displayTime: boolean;
        displayFile: boolean;
        displayProjectID: boolean;
        displayInfo: boolean;
        fileMaxLength: number;
        displayIcon: boolean;
        verboseLogTypeArray: string[];
        projectID: string;
        rootFolder: string;
    };
};
declare type ILogConfig = {
    displayDate?: boolean;
    displayTime?: boolean;
    displayFile?: boolean;
    displayProjectID?: boolean;
    displayInfo?: boolean;
    fileMaxLength?: number;
    displayIcon?: boolean;
    verboseLogTypeArray?: string[];
    projectID?: string;
    rootFolder?: string;
};
export declare class ToShell {
    pref: Preference;
    constructor(logConfig?: ILogConfig);
    /**
     * Create New Instance of ToShell
     * @param logConfig
     * @param inheritConfig copy current config to new instance or use default configuration
     */
    newInstance(logConfig?: ILogConfig, inheritConfig?: boolean): ToShell;
    private _getBlockCurrentTime;
    private _getBlockProjectID;
    private _getCalcTabSize;
    private _rightPaddingPrefix;
    /**
     * Set Preference of current instance
     * @param logConfig
     */
    setPreference(logConfig: ILogConfig): void;
    private _getBlockPrefix;
    private _getFileStack;
    /**
     * Wrap string with color code
     * @param {ColorName} name
     * @param {string} message
     * @return {string}
     */
    color(name: ColorName, message: string): string;
    /**
     * Default Log (console.log) with options
     * @param $str
     */
    log($str: any): void;
    /**
     * Default Log with warn type
     * @param $str
     */
    warn($str: any): void;
    /**
     * Error Log
     * @param $str
     */
    error($str: any): void;
    /**
     * Default Log, but mark as system type
     * @param $str
     */
    systemLog($str: string): void;
    /**
     * Default Log, but mark as specific type
     * @param $type Specific Type (This can be set verbose anytime at preference.logConfig.verboseLogTypeArray[])
     * @param $str
     */
    logWithType($type: string, $str: string): void;
    /**
     * Log current private location
     * @param $str
     */
    logFunction($str: string): void;
    logCallerFunction($str: string): void;
    /**
     * Log and indent to the main grid column
     * @param $str
     */
    logWithTab($str: string): void;
    /**
     * Nothing special right now, just object inspector
     * @param $object
     * @param $depth
     */
    inspect($object: any, $depth?: number): void;
    /**
     * Log Section with formatting
     * @param $name
     * @param $size
     */
    section($name: string, $size?: number): void;
    /**
     * Log Line
     * @param $size
     * @param $style
     * @param $bottomsize
     */
    line($size?: number, $style?: '-' | '=' | string, $bottomsize?: number): void;
}
declare const defaultInstance: ToShell;
export default defaultInstance;

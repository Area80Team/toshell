export declare type ILogConfig = {
    displayModulePath?: boolean;
    displaySystemLog?: boolean;
    displayDate?: boolean;
    displayTime?: boolean;
    displayFile?: boolean;
    displayProjectID?: boolean;
    displayInfo?: boolean;
    displayIcon?: boolean;
    verboseLogTypeArray?: string[];
    projectID?: string;
    getCalcTabSize?(): number;
};
export declare function setPreference(logConfig: ILogConfig): void;
/**
 * Default Log (console.log) with options
 * @param $str
 */
export declare function log($str: any): void;
/**
 * Default Log with warn type
 * @param $str
 */
export declare function warn($str: any): void;
/**
 * Error Log
 * @param $str
 */
export declare function error($str: any): void;
/**
 * Default Log, but mark as system type
 * @param $str
 */
export declare function systemLog($str: string): void;
/**
 * Default Log, but mark as specific type
 * @param $type Specific Type (This can be set verbose anytime at preference.logConfig.verboseLogTypeArray[])
 * @param $str
 */
export declare function logWithType($type: string, $str: string): void;
/**
 * Log current function location
 * @param $str
 */
export declare function logFunction($str: string): void;
export declare function logCallerFunction($str: string): void;
/**
 * Log and indent to the main grid column
 * @param $str
 */
export declare function logWithTab($str: string): void;
/**
 * Nothing special right now, just object inspector (TODO:Prettify)
 * @param $object
 * @param $depth
 */
export declare function inspect($object: any, $depth?: number): void;
/**
 * Log Section with formatting
 * @param $name
 * @param $size
 */
export declare function section($name: string, $size?: number): void;
/**
 * Log Line
 * @param $size
 * @param $style
 * @param $bottomsize
 */
export declare function line($size?: number, $style?: '-' | '=' | string, $bottomsize?: number): void;

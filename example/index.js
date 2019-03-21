var toshell = require("./../dist").default;

toshell.log("Log using log()");
toshell.warn("Log using warn()");
toshell.error("Log using error()");
toshell.systemLog("Log using systemLog()");

var myFuntion = function () {
    toshell.logFunction("Log within closure function using logFunction()");
};
myFuntion();

toshell.setPreference({
    displaySystemLog : true, //display log that calls via logger.systelLog
    displayDate      : true, //display date
    displayTime      : true, //display time
    displayFile      : true, //display script path for each line
    displayProjectID : true, //display project id
    displayInfo      : true, //display additional information
    displayIcon      : true, //display icon
    fileMaxLength    : 30, //set maximum length of file path
    verboseLogTypeArray: [], //disable some log type when use logger.logWithType
    projectID          : "GLOBAL" //project id
});

toshell.log("Logging after setPreference() ");

toshell.section("Playing with indent");
toshell.log("Line 1");
toshell.logWithTab("Line 2");
toshell.logWithTab("Line 3");
toshell.inspect(require('../package.json'));
toshell.inspect(module);

toshell.section("Playing with preference");

var localToShell = toshell.newInstance({projectID:"LOCAL"});

localToShell.log("Create local instance and set projectID:\"LOCAL\"");

localToShell.setPreference({displayFile:false});
localToShell.warn("displayFile:false");

localToShell.setPreference({displayTime:false});
localToShell.error("displayTime:false");

toshell.log('Log from GLOBAL instance');
localToShell.log('Log from LOCAL instance');


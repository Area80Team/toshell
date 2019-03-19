var toshell = require("./../dist");
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
    displayDate      : false, //display date
    displayTime      : true, //display time
    displayFile      : true, //display script path for each line
    displayProjectID : true, //display project id
    displayInfo      : true, //display additional information
    displayIcon      : true, //display icon
    fileMaxLength    : 30, //set maximum length of file path
    verboseLogTypeArray: [], //disable some log type when use logger.logWithType
    projectID          : "LOG" //project id
});

toshell.log("Logging after setPreference() ");


toshell.section("Playing with indent");
toshell.log("Line 1");
toshell.logWithTab("Line 2");
toshell.logWithTab("Line 3");

toshell.section("Playing with preference");

toshell.setPreference({projectID:"MY_PROJECT"});
toshell.log("projectID:\"MY_PROJECT\" preference");

toshell.setPreference({displayFile:false});
toshell.warn("displayFile:false preference");

toshell.setPreference({displayDate:true});
toshell.error("displayDate:true");

toshell.line();
toshell.setPreference({projectID:"MY_PROJECT"});
toshell.log("projectID:\"MY_PROJECT\"");

toshell.setPreference({displayFile:false});
toshell.warn("displayFile:false");

toshell.setPreference({displayDate:true});
toshell.error("displayDate:true");
toshell.line();

toshell.inspect(require('../package.json'));
toshell.inspect(module);
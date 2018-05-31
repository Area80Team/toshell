var toshell = require("./index");
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
    verboseLogTypeArray: [], //disable some log type when use logger.logWithType
    projectID          : "LOG", //project id
    getCalcTabSize     : function () {
        return ((this.displayFile) ? 38 : 0) +
            ((this.displayIcon) ? 2 : 0) +
            ((this.displayTime) ? 11 : 0) +
            ((this.displayDate) ? 9 : 0) +
            ((this.displayProjectID) ? (this.projectID.length + 3) : 0);
    } //this will use to calculate tab size of the log line
}, true);

toshell.log("Logging after setPreference() ");


toshell.section("Playing with indent");
toshell.log("Line 1");
toshell.logWithTab("Line 2");
toshell.logWithTab("Line 3");

toshell.section("Playing with preference");

toshell.setPreference({projectID:"MY_PROJECT", getCalcTabSize:function(){return 50;}},true);
toshell.log("projectID:\"MY_PROJECT\" && Fix tab size with getCalcTabsize() preference");

toshell.setPreference({displayFile:false, getCalcTabSize:function(){return 50;}},true);
toshell.warn("displayFile:false && Fix tab size with getCalcTabsize() preference");

toshell.setPreference({displayDate:true, getCalcTabSize:function(){return 50;}},true);
toshell.error("displayDate:true && Fix tab size with getCalcTabsize() preference");

toshell.line();
toshell.setPreference({projectID:"MY_PROJECT", getCalcTabSize:function(){return 70;}},true);
toshell.log("projectID:\"MY_PROJECT\" && Fix tab size with getCalcTabsize() preference");

toshell.setPreference({displayFile:false, getCalcTabSize:function(){return 70;}},true);
toshell.warn("displayFile:false && Fix tab size with getCalcTabsize() preference");

toshell.setPreference({displayDate:true, getCalcTabSize:function(){return 70;}},true);
toshell.error("displayDate:true && Fix tab size with getCalcTabsize() preference");
toshell.line();

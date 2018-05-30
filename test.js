var logger = require("./index");
logger.log("Log using log()");
logger.warn("Log using warn()");
logger.error("Log using error()");
logger.systemLog("Log using systemLog()");

var myFuntion = function () {
	logger.logFunction("Log within closure function using logFunction()");
}
myFuntion();

logger.setPreference({projectID:"MY_PROJECT"})
logger.log("Logging after setPreference({projectID}) ")

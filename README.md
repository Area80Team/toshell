# toshell
Simple text logger for node application.
We create it for fast and beautiful logging.

- Beautiful logging.
- Light weigt.
- Log caller file and line number.
- Create custom log type, then you can choose what you want to display at the moment without commenting out the line.
- Global settings also avaliable for your project scope and environment.

### TODO
- [ ] parse any object as preety json format
- [ ] cli command line

[![NPM](https://nodei.co/npm/toshell.png)](https://nodei.co/npm/toshell/)

![Screenshot](https://www.dropbox.com/s/pvaqq7zhur96myz/logger-2.png?raw=1)

### Usage

```javascript
var toshell = require("toshell");
toshell.log("Log using log()");
toshell.warn("Log using warn()");
toshell.error("Log using error()");
toshell.systemLog("Log using systemLog()");
toshell.line();//log line
toshell.section("This is Section");

var myFuntion = function () {
	toshell.logFunction("Log within closure function using logFunction()");
};
myFuntion();

toshell.setPreference({projectID:"MY_PROJECT"});
toshell.log("Logging after setPreference({projectID}) ");
```

### Preference

Preference can set at any point of the application.

It's will apply to all usage afterwards, by default.

```javascript
var toshell = require("toshell");
toshell.setPreference({
	projectID : "MY_PROJECT"
});
```
or
```javascript
var toshell = require("toshell");
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
});
```

You can change behavior of preference to apply within the file

```javascript
var toshell = require("toshell");
toshell.setPreference({projectID:"MY_PROJECT"}, true);
//the preference will only apply to current require scope...
```

### Playing around with preference

Try it yourself

```javascript
var toshell = require("toshell");
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
```
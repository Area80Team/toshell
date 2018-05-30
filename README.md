# toshell
Simple text logger for node application.

![Screenshot](https://www.dropbox.com/s/uu2btrqvot55d44/logger.png?raw=1)

### Usage

```javascript
var toshell = require("toshell");
toshell.log("Log using log()");
toshell.warn("Log using warn()");
toshell.error("Log using error()");
toshell.systemLog("Log using systemLog()");

var myFuntion = function () {
	toshell.logFunction("Log within closure function using logFunction()");
}
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
toshell.setPreference({
	displaySystemLog : true, //display log that calls via logger.systelLog
	displayDate      : false, //display date
	displayTime      : true, //display time
	displayFile      : true, //display script path for each line
	displayProjectID : true, //display project id
	displayInfo      : true, //display line number
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
})
```

You can change behavior of preference to apply within the file

```javascript
toshell.setPreference({projectID:"MY_PROJECT"}, true);
//the preference will only apply to current require scope...
```
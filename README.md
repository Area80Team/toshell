# toshell
Simple text logger for node application.
We create it for fast and beautiful logging.

- Beautiful logging.
- Light weight.
- Log caller file and line number.
- Create custom log type, then you can choose what you want to display at the moment without commenting out the line.
- Global settings also avaliable for your project scope and environment.
- Typescript Support

[![NPM](https://nodei.co/npm/toshell.png)](https://nodei.co/npm/toshell/)

---

### TODO
- [ ] parse any object as pretty json format
- [ ] cli command line 
- [ ] transfer log to web with interactive interface (json object viewer, filter, search)

---

![Screenshot](https://www.dropbox.com/s/pvaqq7zhur96myz/logger-2.png?raw=1)

---

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
---

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
	fileMaxLength    : 30, //set maximum length of file path
	verboseLogTypeArray: [], //disable some log type when use logger.logWithType 
	projectID          : "LOG" //project id
});
```

You can change behavior of preference to apply within the file

```javascript
var toshell = require("toshell");
toshell.setPreference({projectID:"MY_PROJECT"});
//the preference will only apply to current require scope...
```
---

### Playing around with preference

Try it yourself

```javascript
var toshell = require("toshell");
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
```
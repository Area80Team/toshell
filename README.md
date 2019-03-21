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
### Change Log
#### v1.2.0
- Use default varialbe to access global instance 
```javascript
var toshell = require('toshell').default;//javascript
```
```typescript
import {default as toshell} from 'toshell';//typescript
```
- Now you can create new instance of toshell for further preference modification without effect default instance via toshellInstance.newInstance() 
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
var toshell = require("toshell").default;
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
var toshell = require("toshell").default;
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
var toshell = require("toshell").default;
toshell.setPreference({projectID:"MY_PROJECT"});
//the preference will only apply to current require scope...
```
---

### Playing around with preference

Try it yourself

```javascript
var toshell = require("toshell").default;
toshell.section("Playing with indent");
toshell.log("Line 1");
toshell.logWithTab("Line 2");
toshell.logWithTab("Line 3");

toshell.section("Playing with preference");

//create new instance of toshell
var localToShell = toshell.newInstance({projectID:"LOCAL"});

localToShell.log("Create local instance and set projectID:\"LOCAL\"");

localToShell.setPreference({displayFile:false});
localToShell.warn("displayFile:false");

localToShell.setPreference({displayTime:false});
localToShell.error("displayTime:false");

toshell.log('Log from GLOBAL instance');
localToShell.log('Log from LOCAL instance');

```
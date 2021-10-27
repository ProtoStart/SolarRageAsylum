var asylumData = {
	"rooms":{
		
	},

}

var toolData = {
	"localStorageKeyName":"SolarAsylumBuilder", //HTML5 local storage uses key value pairs. We'll need to use the same key name when saving and using. Access with toolData.localStorageKeyName
	"currentCell": "", //the grid cell currently being viewed or edited. Access with toolData.currentCell
	"defaultRoom": { //access with toolData.defaultRoom
		"designersNotes" : {	
			"label": "",
			"description":"An empty cell", //access with toolData.defaultRoom.description, in an actual room access with asylumData.rooms[roomID].description  lets the user describe what is there or should be there
			"designCompleteness":"Not started", //access with toolData.defaultRoom.designCompleteness, in an actual room access with asylumData.rooms[roomID].designCompleteness
		},
		"bounds": { //Bounds are the edges of the playable area for a room, in px, and what kind of boundary is there - just wall, doorway, archway etc. To create these I took the values used for the first room used in the original asylum (room 10 - Rec3), and then converted them to all full walls - much of this will be overriden during editing anyway, but this gives us our basic structure.	
			"top": {
				"val": "99",   //val is short for value - in this case the amount of px from the top of the movement area
				"known": "no", //no means not known to the player character
				"type":"wall", //wall = continuous wall with no archway or door
			},
			"right": {
				"val": "658", //val is short for value - in this case the amount of px from the left edge of the movement area
				"known": "no", //no means not known to the player character
				"type":"wall", //wall = continuous wall with no archway or door
			},
			"bottom": {
				"val": "439",  //val is short for value - in this case the amount of px from the top of the movement area
				"known": "no", //no means not known to the player character
				"type":"wall", //wall = continuous wall with no archway or door
			},
			"left": {
				"val": "90",   //val is short for value - in this case the amount of px from the left edge of the movement area
				"known": "no", //no means not known to the player character
				"type":"wall", //wall = continuous wall with no archway or door
			},
		},
		"bumpCoords": {
			
		}
	},
	
}

function JSONstringifyInOrder(obj)
{
	//This function is a solution to a tricky problem of JSON stringifying in the wrong order, I tweaked this to my liking from  https://stackoverflow.com/a/53593328 and took care to go through and understand it, and explain how it works in comments.
    var allKeys = [];
    var seen = {};
	//take our object run it through JSON.stringify but with a special function running inside, that copies all of the keys into an array. We don't use the result of this stringify, only the list of keys!
    JSON.stringify(obj, function (key, value) {
        if (!(key in seen)) {
            allKeys.push(key);
            seen[key] = null;
        }
        return value;
    });
    allKeys.sort(); //This sorts our list of keys - I was initially concerned that this would ruin the nesting, but it doesn't, because we're not actaully touching the structure, in fact the next stringify uses the original object as it was passed into the function, but it will be stringifyed with an ordered list as a filter. Since the filter list has all of the keys in there, it doesn't filter out anything, but since it places things in the order in which they are matched in the filter array, and our filter array is sorted, it has the effect of sorting each level of our object. This does mean that every key is ordered alphabetically within it's parent, but that consistency could make it easier for others to understand. This solution does mean we use the same full list of every key in the object for each nested part of the object, but the performance seems to be okay, so I'm not concerned about that.
	return JSON.stringify(obj, allKeys, "	"); //This is the stringify that actually creates our new object. It takes in the object as passed into this function, a sorted list of all the keys within, and the entity for a tab since we want it to use tabs for line starts
}

function showViewAsylumBtns(){
	showViaClass("viewAsylumJsonBtn");
	showViaClass("viewAsylumGridBtn");
}

function createRooms(){
	if(JSON.stringify(asylumData.rooms) == "{}" || confirm("This tool only remembers one Asylum at a time, reset all progress?")){
		let gridRef = ""; //instantiate these before the loop so they only instatiate once, we fill over the value again and again
		let iString = "";
		for (let i = 0; i < 10; i++) {
			iString = parseInt(i); //parse the first digit once
			for (let j = 0; j < 10; j++) {
				gridRef = iString + "" + parseInt(j); //string concatenation
				asylumData.rooms[gridRef] = JSON.parse(JSON.stringify(toolData.defaultRoom)); /*actually create the new room in the JSON object - stringifying and then parsing here so that it actually duplicates rather than just putting in a reference to the default room object. THERE ARE LIMITATIONS TO THIS - as far as I can see it should be fine but see https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
				
				Key part here:
				Fast cloning with data loss - JSON.parse/stringify
					If you do not use Dates, functions, undefined, Infinity, RegExps, Maps, Sets, Blobs, FileLists, ImageDatas, sparse Arrays, Typed Arrays or other complex types within your object, a very simple one liner to deep clone an object is:*/
			}
		}
		document.getElementById("createRooms").innerHTML = "Reset to Asylum Outline";
	}
	showViewAsylumBtns();
}

function importAsylum(){
	hideAllXClassShowY("leftItem", "jsonEditor");
	showViewAsylumBtns();
}

function displayAllJSON(){
	let gridRef = ""; //instantiate these before the loop so they only instatiate once
	let iString = "";
	let neatOutput = "";
	/*for (let i = 0; i < 10; i++) {
		iString = parseInt(i); //parse the first digit once
		for (let j = 0; j < 10; j++) {
			jString = parseInt(j);
			gridRef = iString + "" + jString; //"" forces string concatenation
			neatOutput += "//Row " + iString + " Column " + jString + "/n"; //writes a comment above each cell with row and collumn numbers - makes it easier to understand for new people and also makes the JSON easy to search using cntrl+f
			neatOutput += "\"" + gridRef + "\": " + JSON.stringify(asylumData.rooms[gridRef], null, "&#9;") + ",<br/>"; //turn the JSON for that specific cell into a string (stringify), with tabs ("&#9;"), and a line break (<br/>) after a seperating comma
			//JSON.stringify is a part of regular modern JavaScript - even though it doesn't sound like it is. It converts a JavaScript object into a JSON formatted string. In this case we are stringifying the asylumData, so that it can be displayed.
		}
		neatOutput += "<br/>"; //add an extra line break every 10 rooms, since 10 rooms represents a row
	}*/
	//JSON.stringify(obj)
	neatOutput = JSONstringifyInOrder(asylumData);
	document.getElementById("jsonTextArea").value  = neatOutput; //needs to be value rather than innerHTML so that the save function can work

	hideAllXClassShowY("leftItem", "jsonEditor");
}

function applyJson(){
	document.getElementById("jsonTextArea").focus();
	//alert(document.getElementById("jsonTextArea").value);
	try{
		let saveAttempt = document.getElementById("jsonTextArea").value;
		//TODO (IMPORTANT TO DO BEFORE RELEASE TO PUBLIC) SECURITY VALIDATION
		asylumData = JSON.parse(saveAttempt);
	} catch (error) {
		let errorString = error.toString(); //need it in string form for string matching in the if statement
		alert("Couldn't save, probably due to invalid JSON. \n Web browser thinks the error is: \n" + errorString);
		document.getElementById("jsonTextArea").focus();
		//some browsers (including chrome on PC) will give an error message for failed JSON parsing that includes which character caused the syntax error. This code attempts to check for an error message like that, and then select the problematic character
		if(errorString.includes("at position")){
			//will be the case in Chrome on Windows
			alert("Your web browsers error message seems to include the position where an error is, so we'll automatically select an area around that character to help show the rough area to look");
			document.getElementById("jsonTextArea").focus();
			let positionAtString = errorString.match(/(position) (\d)*/g); //gets a string within the errorString that matches "position " followed by an amount of number characters. This allows for a chance that the error message could include multiple sets of numbers, we only want it if it's describing position rather than line number or collumn. This alone isn't enough to use for the selectionStart and selectionEnd as it contains the string "position ". Note that match adds all matches to an array not a string - this stumped me for about an hour of debugging!!
			//alert(positionAtString);
			let errorPosNum = 0;
			errorPosNum = parseInt( positionAtString[0].slice(9)); //[0] to just use the first (and hopefully only) index of the array, slice(9) to take just the part after the first 9 chars which is the "position " that comes before the actual number
			document.getElementById("jsonTextArea").selectionStart = errorPosNum - 6;
			document.getElementById("jsonTextArea").selectionEnd = errorPosNum + 6;
		} else if (errorString.includes("at line ")){
			//firefox on windows says "SyntaxError: JSON.parse: bad control character in string literal at line 6 column 19 of the JSON data"  We'll do similar stuff as for Chrome, but use a seperate function to select the line that is stated (it involves reading through the textarea contents counting lines). For simplicity, we'll ignore the column - most of the lines are fairly short anyway, so line alone is sufficient
		alert("Your web browsers error message seems to state the line it couldn't read in, so we'll select that line automatically. If error isn't on that line check the lines just before, and then try searching for {{ or }}");
			document.getElementById("jsonTextArea").focus();
			let atLineString = errorString.match(/(at line) (\d)*/g);
			let lineNum = parseInt( atLineString[0].slice(8));
			selectTextAreaLine(document.getElementById("jsonTextArea"),lineNum);
		}
		
	}
}

function applyThenLocalSaveJson(){
	applyJson();
	localSaveJson();
}

function localSaveJson(){
	/*
	use saveToLocalStorage(key,value);  -- a function for saving to HTML5 local storage
	  with contents of toolData.localStorageKeyName as the key
	  and asylumData as the value
	*/
	saveToLocalStorage(toolData.localStorageKeyName, asylumData);
}

function localLoadAsylum(){
	try {
		asylumData = localStorage.getItem(toolData.localStorageKeyName);
	} catch {
		alert("couldn't get data from local storage");
	}
	showViewAsylumBtns();

}

function displayGrid(){
	//alert("we're still building this tool");
	hideAllXClassShowY("leftItem", "asylumGrid");
	
}

function viewCell(cellID){
	//alert("we're still building this tool");
	hideAllXClassShowY("rightPanelView", "cellView");
	toolData.currentCell = cellID;//so that the save button knows which cell was altered
	document.getElementById("cellNumber").innerHTML  = "Cell " + cellID;
	document.getElementById("cellLabel").value = asylumData.rooms[cellID].designersNotes.label;
	document.getElementById("cellDescription").value = asylumData.rooms[cellID].designersNotes.description;
	//
	document.getElementById("cellDesignCompleteness").value = asylumData.rooms[cellID].designersNotes.designCompleteness;
	
}

function applyCellEdits(){
	//Todo (BEFORE PUBLIC RELEASE): SECURITY FEATURES
	//save edits for the cell in toolData.currentCell
	asylumData.rooms[toolData.currentCell].designersNotes.label = document.getElementById("cellLabel").value;
	asylumData.rooms[toolData.currentCell].designersNotes.description = document.getElementById("cellDescription").value;
	//
	asylumData.rooms[toolData.currentCell].designersNotes.designCompleteness = document.getElementById("cellDesignCompleteness").value;
	//alert( JSON.stringify(toolData.defaultRoom));
}

function moreInfoToggle(){

	//SLIGHTLY WEIRD CODE: toggleHidden does 2 things: toggles the given element between hidden and shown, and also returns true if it just toggled to hidden or returns false if it just toggled to showing. so toggleHidden causes a change in UI but also provides us a bool with which to make a decision about what the text should say
	if (toggleHidden("stagesList")){
		document.getElementById("moreInfoDevStages").innerHTML = "More Info";
	} else {
		document.getElementById("moreInfoDevStages").innerHTML = "Less Info";
	}
}

/** Our good old trusty show and hide functions that we use everywhere!!

by "via class" we mean by swapping css classes that handle showing or hiding things
Use in conjuction with hideViaClass(id) and css classes called "hidden" and "showing" that have css to hide/show things
**/
function showViaClass(id){
  document.getElementById(id).classList.remove("hidden");
  document.getElementById(id).classList.add("showing");
}

function hideViaClass(id){
	document.getElementById(id).classList.remove("showing");
	document.getElementById(id).classList.add("hidden");
}

function toggleHidden(id){
	//also returns bool: true for now hidden, used for toggling other UI accordingly
	if (document.getElementById(id).classList.contains("showing")){
		hideViaClass(id);
		return true;
	} else {
		showViaClass(id);
		return false;
	}
}

/*Our slightly less often used hide everything of a certain class, show this one specified thing, function*/
function hideAllXClassShowY(x,y){
	//as it says on the tin - Hides all elements with the class given in x, and Shows the element with Id given in y
	var xElements = document.getElementsByClassName(x);
	
	var i;
	for (i = 0; i < xElements.length; i++) {
		hideViaClass(xElements[i].id);
	}
	
	showViaClass(y);
}


function selectTextAreaLine(textArea,lineNum) {
	//thanks to http://lostsource.com/2012/11/30/selecting-textextArea-line.html for this code snippet. I was hoping there would be a less lengthy approach but this seems to be the best. I've made some small adjustments for readability but thats all
    lineNum--; // array starts at 0
    var lines = textArea.value.split("\n");  // Reads everything in the textextArea value, splits it up by newlines

    // calculate start/end
    var startPos = 0, endPos = textArea.value.length; //Phil always forgets you can do this with variables in JS, set up muliple variables with one var statement, just seperating them with commas
    for(var x = 0; x < lines.length; x++) {
        if(x == lineNum) {
            break;
        }
        startPos += (lines[x].length+1);
    }

    var endPos = lines[lineNum].length+startPos;

    // do selection
    // Chrome / Firefox

    if(typeof(textArea.selectionStart) != "undefined") {
        textArea.focus();
        textArea.selectionStart = startPos;
        textArea.selectionEnd = endPos;
        return true;
    }

    // IE
    if (document.selection && document.selection.createRange) {
        textArea.focus();
        textArea.select();
        var range = document.selection.createRange();
        range.collapse(true);
        range.moveEnd("character", endPos);
        range.moveStart("character", startPos);
        range.select();
        return true;
    }

    return false;
}

function saveToLocalStorage(key,value){ 
/*Returns true if successful, alerts if not*/
	//Before using web storage, check browser support for Storage (covers both localStorage and sessionStorage)  TODO: check if it would be better to just check local storage  - this link shows a potential alternative code block, though it relies on try catch, and right now I'm not confident I understand the code block fully https://diveinto.html5doctor.com/storage.html
	if (typeof(Storage) !== "undefined") {
	//Storage is there, so we'll save it
		localStorage.setItem(key, value);
		return true; //lets us display a relevant success message or carry on doing things
	} else {
	  //No Web Storage support - TODO: is this a good experience??
	  alert("couldn't save, browser doesn't support local storage");
	}
}

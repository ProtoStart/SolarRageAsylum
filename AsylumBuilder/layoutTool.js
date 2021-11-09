var asylumData = {
	"asylumNotes": "",
	"startConditions":{
		"time": "3",
		"cell": "10",
		"weatherOutside": "clear"
	},
	"worldConstants":{
		"dayLength": "10", //Asylums don't have to be on earth. A 10 hr dayLength means a brand new day starts every 10 hrs on that planet/moon/asteroid/whatever OR at least the repating pattern of natural light found in sunStrengthByHour repeats this often. An asylum with constant amounts of sunlight (always lit, or never lit) could put any number for dayLength and just have that many values in sunStrengthByHour set as whatever strength of sun works.
		"sunStrengthByHour": [0,0,6,8,10,10,8, 6, 2,0], //0 is pitch black night, 10 is as strong as midday sun in Madrid in July .
		"daysOfWeek": ["Klihl", "Slark", "Funata", "Rophis","Memphiso","Rhock","Flark", "Quill"], // 8 days, each with weird names!
		"nmlWorkWeekLength": "6",
		"nmlWorkDayLength": "5",
		"weatherChances": {
			"clear": 50,
			"hammering": 10,
			"thunder": 15,
			"scorching": 25
		}
		//"": "",
		
	},
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
			"designCompleteness":"cellDefault", //access with toolData.defaultRoom.designCompleteness, in an actual room access with asylumData.rooms[roomID].designCompleteness
		},
		"bounds": { //Bounds are the edges of the playable area for a room, in px, and what kind of boundary is there - just wall, doorway, archway etc. To create these I took the values used for the first room used in the original asylum (room 10 - Rec3), and then converted them to all full walls - much of this will be overriden during editing anyway, but this gives us our basic structure.	
			"top": {
				"val": "99",   //val is short for value - in this case the amount of px from the top of the movement area
				"known": "no", //no means not known to the player character
				"type":"wall", //wall = continuous wall with no archway or door
				"nextCell":""
			},
			"right": {
				"val": "658", //val is short for value - in this case the amount of px from the left edge of the movement area
				"known": "no", //no means not known to the player character
				"type":"wall", //wall = continuous wall with no archway or door
				"nextCell":""
			},
			"bottom": {
				"val": "439",  //val is short for value - in this case the amount of px from the top of the movement area
				"known": "no", //no means not known to the player character
				"type":"wall", //wall = continuous wall with no archway or door
				"nextCell":""
			},
			"left": {
				"val": "90",   //val is short for value - in this case the amount of px from the left edge of the movement area
				"known": "no", //no means not known to the player character
				"type":"wall", //wall = continuous wall with no archway or door
				"nextCell":""
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
	showViaClass("viewAsylumBtns");
}

function createRooms(){
	if(JSON.stringify(asylumData.rooms) == "{}" || confirm("This tool only remembers one Asylum at a time, reset all progress?")){
		let gridRef = ""; //instantiate these before the loop so they only instatiate once, we fill over the value again and again
		for (let i = 0; i < 10; i++) {
			for (let j = 0; j < 10; j++) {
				gridRef = i + "" + j; //string concatenation
				asylumData.rooms[gridRef] = JSON.parse(JSON.stringify(toolData.defaultRoom)); /*actually create the new room in the JSON object - stringifying and then parsing here so that it actually duplicates rather than just putting in a reference to the default room object. THERE ARE LIMITATIONS TO THIS - as far as I can see it should be fine but see https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
				
				Key part here:
				Fast cloning with data loss - JSON.parse/stringify
					If you do not use Dates, functions, undefined, Infinity, RegExps, Maps, Sets, Blobs, FileLists, ImageDatas, sparse Arrays, Typed Arrays or other complex types within your object, a very simple one liner to deep clone an object is:*/
				
				//Add in default nextCell data to every bounds - this data will be used in game for knowing where to go if player character can go through a bounds. By default, movement adheres to the grid as you'd expect - eg, going through top bounds will take you to the cell above unless that would take you out of the grid. Having these in the data rather than calculated in the game engine, allows us to override it at design time if we wish and also means these calculations are only done during Asylum design - good for performance.
				if (i == 9){
					asylumData.rooms[gridRef].bounds.bottom.nextCell = "outBottom";
				} else {
					asylumData.rooms[gridRef].bounds.bottom.nextCell = parseInt(gridRef) + 10;
				};
				if (j == 0){
					asylumData.rooms[gridRef].bounds.left.nextCell =  "outLeft";
				} else {
					asylumData.rooms[gridRef].bounds.left.nextCell =  parseInt(gridRef) - 1;
				};
				if (j == 9){
					asylumData.rooms[gridRef].bounds.right.nextCell =  "outRight";
				} else {
					asylumData.rooms[gridRef].bounds.right.nextCell =  parseInt(gridRef) + 1;
				};
				if (i == 0){
					asylumData.rooms[gridRef].bounds.top.nextCell = "outTop";
				} else {
					asylumData.rooms[gridRef].bounds.top.nextCell =  parseInt(gridRef) - 10;
				};
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
			errorPosNum = positionAtString[0].slice(9); //[0] to just use the first (and hopefully only) index of the array, slice(9) to take just the part after the first 9 chars which is the "position " that comes before the actual number
			document.getElementById("jsonTextArea").selectionStart = errorPosNum - 6;
			document.getElementById("jsonTextArea").selectionEnd = errorPosNum + 6;
		} else if (errorString.includes("at line ")){
			//firefox on windows says "SyntaxError: JSON.parse: bad control character in string literal at line 6 column 19 of the JSON data"  We'll do similar stuff as for Chrome, but use a seperate function to select the line that is stated (it involves reading through the textarea contents counting lines). For simplicity, we'll ignore the column - most of the lines are fairly short anyway, so line alone is sufficient
		alert("Your web browsers error message seems to state the line it couldn't read in, so we'll select that line automatically. If error isn't on that line check the lines just before, and then try searching for {{ or }}");
			document.getElementById("jsonTextArea").focus();
			let atLineString = errorString.match(/(at line) (\d)*/g);
			let lineNum = atLineString[0].slice(8);
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
	  HERE
	*/
	
	saveToLocalStorage(toolData.localStorageKeyName,  JSON.stringify(asylumData, null , "	"));
}

function localLoadAsylum(){
	try {
		//TODO: IMPORTANT BEFORE RELEASE: NEEDS MORE SECURITY!
		asylumData = JSON.parse(localStorage.getItem(toolData.localStorageKeyName));
		//addNextCells(); //special case - only needed if the local storage asylum doesn't have nextCell data for every bounds - which should never happen in production unless someone intentionally removes it or some unlikely unforeseen bug
	} catch {
		alert("couldn't get data from local storage");
	}
	showViewAsylumBtns();

}

function asylumGridColourCodeSelect(){
	document.getElementById("asylumGrid").classList.remove("labelCCode","designersNotesCCode");
	document.getElementById("asylumGrid").classList.add(document.getElementById("asylumGridColourCodeSelect").value); 
	
}

function displayGrid(){
	hideAllXClassShowY("leftItem", "asylumGridOuter");
	let grid = document.getElementById("asylumGrid");
	grid.innerHTML ="";
	let row = "";
	let lbl = "";
	let extraClasses = ""; //a variable to tap into via altering this code, to assign extra classes perhaps for styling things
	let cellRef = "";
	for (let i = 0; i < 10; i++) {
			row = "<div class=\"gridRow\">";
			
			for (let j = 0; j < 10; j++) {
				cellRef = i + "" + j; //using + "" + rather than + to force string concatenation
				lbl = asylumData.rooms[cellRef].designersNotes.label.slice(0,4);//limit it to four characters
				extraClasses = "";
				if (lbl == ""){
					lbl = "&nbsp;"; //put a non-breaking space for the label instead of nothing, so that browsers will always include a bottom line - this is an easy layout fix
					extraClasses += " cellNoLbl";
				} else {
					extraClasses += " cellHasLbl";
				}
				extraClasses += " " + asylumData.rooms[cellRef].designersNotes.designCompleteness;
				
				
				
				row += "<button class=\"gridCell" + extraClasses +"\" onclick=\"viewCell('" + cellRef + "')\">" + cellRef + "<br/>" + lbl + "</button>	"; //the tab after the buttons closing tag was an easy way to keep the same spacing as we had when the grid was static HTML (as that was each on new lines with tabs, and browsers condense space down
			}
			row += "</div>";
			grid.innerHTML += row;
	}
}

function displayRoomViewer(){
	hideAllXClassShowY("leftItem", "roomViewer");
}

function displayAsylumNotes(){
	hideAllXClassShowY("leftItem", "asylumNotesTab");
	document.getElementById("asylumNotes").value = asylumData.asylumNotes;
}

function applyAsylumNotes(){
	asylumData.asylumNotes = document.getElementById("asylumNotes").value;
}

function setBoundsEditorData(bound){
	/*
		"known": "no",
		"nextCell": 65,
		"type": "wall",
		"val": "439"
	*/
	//boundsKnown known
	document.getElementById("boundsKnown").value = asylumData.rooms[toolData.currentCell].bounds[bound].known;
	//(TODO: add boundsNextCell HTML)nextCell
	//document.getElementById("boundsType").value = asylumData.rooms[toolData.currentCell].bounds[bound].type;
	//boundsType type
	document.getElementById("boundsType").value = asylumData.rooms[toolData.currentCell].bounds[bound].type;
	//boundsVal val
	document.getElementById("boundsVal").value = asylumData.rooms[toolData.currentCell].bounds[bound].val;
	//alert(asylumData.rooms[toolData.currentCell].bounds[bound].known);
	
}

function changeRoomEditorPanel(){
	let showDiv = "";
	switch(document.getElementById("roomEditorPanelChoice").value){
		case "designersNotes":
			showDiv = "designersNotes";
			break;
		case "bottomBounds":
			setBoundsEditorData("bottom");
			showDiv = "bounds";
			break;
		case "leftBounds":
			setBoundsEditorData("left");
			showDiv = "bounds";
			break;
		case "rightBounds":
			setBoundsEditorData("right");
			showDiv = "bounds";
			break;
		case "topBounds":
			setBoundsEditorData("top");
			showDiv = "bounds";
			break;
		case "bumpCoords":
			showDiv = "bumpCoords";
			break;
	}
	
	hideAllXClassShowY("roomEditorPanel", showDiv);
}
function changeBoundsType(){
	let showDiv = "";
	switch(document.getElementById("boundsType").value){
		case "wall":
			showDiv = "";
			break;
		case "regularDoor":
			showDiv = "doorFields";
			break;
		case "keypadDoor":
			showDiv = "doorFields";
			break;
		case "continueRoom":
			showDiv = "";
			break;
		case "asylumExit":
			showDiv = "";
			break;
		case "customCodedType":
			showDiv = "";
			break;
	}
	
	hideAllXClassShowY("boundsTypeSpecific", showDiv);
}

function viewCell(cellID){
	//alert("we're still building this tool");
	hideAllXClassShowY("rightPanelView", "cellView");
	toolData.currentCell = cellID;//so that the save button knows which cell was altered
	
	//Show designers notes section immediately
	document.getElementById("roomEditorPanelChoice").value = "designersNotes";
	changeRoomEditorPanel();
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
	displayGrid();
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


/** **/

function addNextCells(){
	//This function might well only ever be run once - to add nextCell data to the starter asylum file since it was created without, and manually adding would take a long time
	
	let gridRef = ""; //instantiate these before the loop so they only instatiate once, we fill over the value again and again
	for (let i = 0; i < 10; i++) {
		for (let j = 0; j < 10; j++) {
			gridRef = i + "" + j; //string concatenation
			

			if (i == 9){
				asylumData.rooms[gridRef].bounds.bottom.nextCell = "outBottom";
			} else {
				asylumData.rooms[gridRef].bounds.bottom.nextCell = parseInt(gridRef) + 10;
			};
			if (j == 0){
				asylumData.rooms[gridRef].bounds.left.nextCell =  "outLeft";
			} else {
				asylumData.rooms[gridRef].bounds.left.nextCell =  parseInt(gridRef) - 1;
			};
			if (j == 9){
				asylumData.rooms[gridRef].bounds.right.nextCell =  "outRight";
			} else {
				asylumData.rooms[gridRef].bounds.right.nextCell =  parseInt(gridRef) + 1;
			};
			if (i == 0){
				asylumData.rooms[gridRef].bounds.top.nextCell = "outTop";
			} else {
				asylumData.rooms[gridRef].bounds.top.nextCell =  parseInt(gridRef) - 10;
			};
		}
	}

}

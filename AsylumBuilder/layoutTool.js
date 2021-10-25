var asylumData = {
	"rooms":{
		
	},
	"defaultRoom": { //access with asylumData.defaultRoom
		"designersNotes" : {	
			"label": "",
			"description":"An empty cell", //access with asylumData.defaultRoom.description, in an actual room access with asylumData.rooms[roomID].description  lets the user describe what is there or should be there
			"designCompleteness":"Not started", //access with asylumData.defaultRoom.designCompleteness, in an actual room access with asylumData.rooms[roomID].designCompleteness
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

var toolData = {
	"currentCell": "" //the grid cell currently being viewed or edited. Access with toolData.currentCell
	
}

function createRooms(){
	if(JSON.stringify(asylumData.rooms) == "{}" || confirm("This tool only remembers one Asylum at a time, reset all progress?")){
		let gridRef = ""; //instantiate these before the loop so they only instatiate once, we fill over the value again and again
		let iString = "";
		for (let i = 0; i < 10; i++) {
			iString = parseInt(i); //parse the first digit once
			for (let j = 0; j < 10; j++) {
				gridRef = iString + "" + parseInt(j); //string concatenation
				asylumData.rooms[gridRef] = JSON.parse(JSON.stringify(asylumData.defaultRoom)); /*actually create the new room in the JSON object - stringifying and then parsing here so that it actually duplicates rather than just putting in a reference to the default room object. THERE ARE LIMITATIONS TO THIS - as far as I can see it should be fine but see https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript
				
				Key part here:
				Fast cloning with data loss - JSON.parse/stringify
					If you do not use Dates, functions, undefined, Infinity, RegExps, Maps, Sets, Blobs, FileLists, ImageDatas, sparse Arrays, Typed Arrays or other complex types within your object, a very simple one liner to deep clone an object is:*/
			}
		}
		document.getElementById("createRooms").innerHTML = "Reset Asylum";
	}
	showViaClass("viewAsylumJsonBtn");
	showViaClass("viewAsylumGridBtn");
}

function importAsylum(){
	hideAllXClassShowY("leftItem", "jsonEditor");
}

function displayAllJSON(){
	let gridRef = ""; //instantiate these before the loop so they only instatiate once
	let iString = "";
	let neatOutput = "<pre>"; //<pre> tag wrapper needed for the JSON to be displayed neatly in new lines
	for (let i = 0; i < 10; i++) {
		iString = parseInt(i); //parse the first digit once
		for (let j = 0; j < 10; j++) {
			jString = parseInt(j);
			gridRef = iString + "" + jString; //"" forces string concatenation
			neatOutput += "//Row " + iString + " Column " + jString + "<br/>"; //writes a comment above each cell with row and collumn numbers - makes it easier to understand for new people and also makes the JSON easy to search using cntrl+f
			neatOutput += "\"" + gridRef + "\": " + JSON.stringify(asylumData.rooms[gridRef], null, "&#9;") + ",<br/>"; //turn the JSON for that specific cell into a string (stringify), with tabs ("&#9;"), and a line break (<br/>) after a seperating comma
			//JSON.stringify is a part of regular modern JavaScript - even though it doesn't sound like it is. It converts a JavaScript object into a JSON formatted string. In this case we are stringifying the asylumData, so that it can be displayed.
		}
		neatOutput += "<br/>"; //add an extra line break every 10 rooms, since 10 rooms represents a row
	}
	//JSON.stringify(obj)
	neatOutput += "</pre>";
	document.getElementById("jsonDisplayer").innerHTML  = neatOutput;

	hideAllXClassShowY("leftItem", "jsonDisplayer");
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

function saveCellEdits(){
	//save edits for the cell in toolData.currentCell
	asylumData.rooms[toolData.currentCell].designersNotes.label = document.getElementById("cellLabel").value;
	asylumData.rooms[toolData.currentCell].designersNotes.description = document.getElementById("cellDescription").value;
	//
	asylumData.rooms[toolData.currentCell].designersNotes.designCompleteness = document.getElementById("cellDesignCompleteness").value;
	//alert( JSON.stringify(asylumData.defaultRoom));
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


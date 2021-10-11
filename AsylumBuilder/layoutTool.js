var asylumData = {
	"rooms":{
		
	},
	"defaultRoom": { //access with asylumData.defaultRoom
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

function createRooms(){
	//note: this will wipe over anything already stored
	let gridRef = ""; //instantiate these before the loop so they only instatiate once
	let iString = "";
	let neatOutput = "";
	for (let i = 0; i < 10; i++) {
		iString = parseInt(i); //parse the first digit once
		for (let j = 0; j < 10; j++) {
			gridRef = iString + "" + parseInt(j); //string concatenation
			asylumData.rooms[gridRef] = asylumData.defaultRoom; //actually create the new room in the JSON object
			neatOutput += "\"" + gridRef + "\": " + JSON.stringify(asylumData.rooms[gridRef]) + ",<br/>"; //add to the string with what was added to the JSON for this, plus a comma and a line break
		}
		neatOutput += "<br/><br/>"; //add a double line break every 10 rooms, since that represents a row
	}
	//JSON.stringify(obj)
	  document.getElementById("jsonDisplayer").innerHTML  = neatOutput;//JSON.stringify is a part of regular modern JavaScript - even though it doesn't sound like it is. It converts a JavaScript object into a JSON formatted string. In this case we are stringifying the newly created asylumData, so that it can be displayed.
	//showViaClass("asylumGrid");
	
	showViaClass("jsonDisplayer");
}

function viewCell(cellID){
	//alert("we're still building this tool");
	hideAllXClassShowY("rightPanelView", "cellView");
	
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


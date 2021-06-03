//This file should only have stuff used in test area pages. 
//File should be renamed at least on each main version increment, plus any time we have issues with cacheing.

function move(dir){ //dir = direction
	//alert("Should move " + dir);
	//TODO: switch case would probably be better
	if (dir == "u"){
		alert("u");
		//TODO: find #mockPC coords - add a value to move it up
	} else if (dir == "l"){
		alert("l");
	} else if (dir == "d"){
		alert("d");
	} else if (dir == "r"){
		alert("r");
	};
	
}

function toggleWelcome(){
	if (document.getElementById("welcome").classList.contains("showing")){
		hideViaClass("welcome");
		document.getElementById("toggleWelcome").innerHTML = "Show the ramble again"
	} else {
		showViaClass("welcome");
		document.getElementById("toggleWelcome").innerHTML = "Hide this rambling nonsense!"
	}
}

/*by class we mean css class
Use in conjuction with hideViaClass(id) and css classes called "hidden" and "showing" that have css to hide/show things
*/
function showViaClass(id){
  document.getElementById(id).classList.remove("hidden");
  document.getElementById(id).classList.add("showing");
}

/*by class we mean css class
Use in conjuction with showViaClass(id) and css classes called "hidden" and "showing" that have css to hide/show things
*/
function hideViaClass(id){
  document.getElementById(id).classList.remove("showing");
  document.getElementById(id).classList.add("hidden");
}
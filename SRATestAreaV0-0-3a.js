//This file should only have stuff used in test area pages. 
//File should be renamed at least on each main version increment, plus any time we have issues with cacheing.

function move(dir){ //dir = direction
	let moveAmount = 10; //the amount of px (pixels) that something will move by in one movement, if it can.
	//alert("Should move " + dir);
	//find #mockPC co-ords (here before we check the direction, as every movement attempt will need the starting co-ords, so this saves repitition)
	var PCx = document.getElementById("mockPC").offsetLeft;
	var PCy = document.getElementById("mockPC").offsetTop;
	//alert("Start: x = " + PCx + ", y = " + PCy);
	
	//TODO: potential performance increase here - switch case
	if (dir == "u"){ 
		//alert("u");
		
		//check if can move
		//to go up reduce the top, since top is the amount of px from the top of the play area
		document.getElementById("mockPC").style.top = PCy + moveAmount;
		
	} else if (dir == "l"){//to go left reduce the left, since offsetLeft is the amount of px from the left edge of the play area
		alert("l");
	} else if (dir == "d"){ 
		//alert("d");
		//to go down increase the "top", since top is the amount of px from the top of the play area - using offsetTop doesn't work since that's a one way value (you can't set it)
		document.getElementById("mockPC").style.top = PCy + moveAmount + "px";
	} else if (dir == "r"){//to go right increase the left, since left is the amount of px from the left edge of the play area
		alert("r");
	};
}

function canMove(){ 

	//Todo: collision logic here
	return true;
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
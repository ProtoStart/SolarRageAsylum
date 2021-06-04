//This file should only have stuff used in test area pages. 
//File should be renamed at least on each main version increment, plus any time we have issues with cacheing.

/*Global Variables
	Anything defined outside of a function is in "global scope", which means any function can access it.
	I quite like having all my globals in a single JSON var. I've used the name globals here so that it's clear whenever you see it used that it's one of the globals you are using (in other projects I often go with "data" which is shorter though not as obviously a global var).
	You can access the individual parts of JSON variables like this: 
		globals.bounds.top
	There are other ways too - search for "JSON traversal" or "read JSON"
*/
var globals = {
	"bounds": { //The edges of the playable area, in px. Currently just matching the div gameArea size definition in gameStyles.css - maybe it should be set via JS in an init? Remember co-ords in JS/CSS are done with 0,0 being the top left.
		"top": "0",
		"right": "600",
		"bottom": "400",
		"left": "0"
	}
}; 
/* #gameArea
	width: 600px;
	height: 400px;
*/

function move(dir){ //dir = direction
	//HIJACKING TOP LINE OF THIS FUNCTION TO TEST ANOTHER FUNCTION inInBounds(xTop, yLeft, xBase, yRight) - I have alerts in the func for each test, then I change the values here to make sure each type of out of bounds gets caught and doesn't cause an error, with no erroneous catches - which it turned out originally there where because I forgot to parse to ints! - Normally this woudln't make it into a check in but I want to show that I do these checks at this point, before I hook it up fully (helps make bug fixing so much easier, because the code is fresh in my head, and I've done less that might cause a bug)
	isInBounds("7","7","7","7");
	let moveAmount = 30; //the amount of px (pixels) that something will move by in one movement, if it can.
	//alert("Should move " + dir);
	//find #mockPC co-ords (here before we check the direction, as every movement attempt will need the starting co-ords, so this saves repitition)
	var PCx = document.getElementById("mockPC").offsetLeft;
	var PCy = document.getElementById("mockPC").offsetTop;
	var attemptX = PCx; //Instantiated here with the PCx value, rewritten if moving in x axis, still used if moving in in y for collision detection
	var attemptY = PCy; //Instantiated here with the PCy value, rewritten if moving in y axis, still used if moving in in x for collision detection
	//alert("Start: x = " + PCx + ", y = " + PCy);
	
	//TODO: potential performance increase here - switch case
	if (dir == "u"){ 
		//alert("u");
		
		//check if can move - for now just wether it's in the bounds of the game area
		/*HERE if(isInBounds()){
			
		};*/
		//to go up reduce the top, since top is the amount of px from the top of the play area
		document.getElementById("mockPC").style.top = (PCy - moveAmount) + "px";  //brackets for human clarity, I tested it without them out of curiosity and it works, but feels like it shouldn't! Note that the minus treats the values immediatly around it as numbers in this case and then the plus sees that the "px" side is a string so does an append rather than mathematical addition
		
	} else if (dir == "l"){
		//alert("l");
		//to go left reduce the left, since left is the amount of px from the left edge of the play area. Needs the letters "px" appended to the end since we're changing a css style that needs to be set with the units.
		document.getElementById("mockPC").style.left = (PCx - moveAmount) + "px"; 
	} else if (dir == "d"){ 
		//alert("d");
		//to go down set our characters element css style for "top", to (old y axis value plus movement amount) with "px" on the end. Top is the distance from the top of the play area - using offsetTop doesn't work since that's a one way value (you can't set it, it's just calculated for you)
		document.getElementById("mockPC").style.top = PCy + moveAmount + "px"; //Note the first plus acts on two numbers, so does addition, then the second plus sees "px" is a string so appends it at the end. This results in a new value for the style rule complete with the px unit.
	} else if (dir == "r"){
		//alert("r");
		//to go right increase the "left", since "left" is the amount of distance from the left edge of the play area. Just like for left except we add the move amount: Take the old x axis value, add the moveAmount, then append "px", set that to the "left" style of the element we are moving
		document.getElementById("mockPC").style.left = (PCx + moveAmount) + "px"; 
	};
}

function isInBounds(xTop, yLeft, xBase, yRight){
	/*literally just output true if the given co-ords are within the bounds of the play area, and false if not
		Params: 
			xTop is the x axis of the top of the object 
			yLeft is the y axis of the left edge of the object
			xBase is the x axis of the base (bottom) of the object
			yRight is the y axis of the right edge of the object
		We need to compare the co-ords given in params with our boundary that we have stored in our global data
		All our global data is in a JSON format var called "globals" up the top of the file.
		< means the thing on the left is less than the thing on the right  (the crocodile bites the bigger thing!)
		> means the thing on the left is more than the thing on the right
	*/
	if(xTop < parseInt(globals.bounds.top)){ //globals.bounds.top is the top boundary - value is 0, top x co-ords less than 0 would mean it's above the top boundary
		alert("top bounds");
		return false;
	} else if (yRight > parseInt(globals.bounds.right)){ //globals.bounds.right is the right boundary - value is 600, right most y co-ords greater than 600 would be beyond the right boundary
		alert("right bounds, yRight = " + yRight + ", globals right = " + globals.bounds.right);
		return false;
	} else if (xBase > parseInt(globals.bounds.bottom)){ //globals.bounds.bottom is the bottom boundary - value is 400, x co-ords of the base greater than 400 would be beyond the bottom boundary
		alert("bottom bounds");
		return false;
	} else if (yLeft < parseInt(globals.bounds.left)){ //globals.bounds.left is the left boundary - value is 0, left most y co-ords less than 0 would be beyond the left boundary
		alert("left bounds");
		return false;
	};
	return true; //To get here none of the out of bounds conditions would have been met
}

function wouldCollide(){
	//function just figures out if a collision would occur if a movement where to happen
}

function canMove(){ 
	/** This is mostly about collision detection. However:
		 - Presumably somewhere in code we need to cover:
		 -- PC is capable of moving right now?
		 -- Game is paused therefore nothing can move (probs want a gamePaused flag and a function that checks it maybe isGamePaused)
		 -- 
	
	**/
	
	
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
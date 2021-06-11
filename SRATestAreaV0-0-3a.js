//This file should only have stuff used in test area pages. 
//File should be renamed at least on each main version increment, plus any time we have issues with cacheing.

/*Global Variables
	Anything defined outside of a function is in "global scope", which means any function can access it.
	I quite like having all my globals in a single JSON var. I've used the name globals here so that it's clear whenever you see it used that it's one of the globals you are using (in other projects I often go with "data" which is shorter though not as obviously a global var).
	You can access the individual parts of JSON variables like this: 
		globals.bounds.top
	There are other ways too - search for "JSON traversal" or "read JSON"
*/
//let pcElement = document.getElementById("mockPC");
//let pcSetWidth = (getComputedStyle(pcElement).width).slice(0,-2);

var globals = {
	"bounds": { //The edges of the playable area, in px. Currently just matching the div gameArea size definition in gameStyles.css - maybe it should be set via JS in an init? Remember co-ords in JS/CSS are done with 0,0 being the top left.
		"top": "0",
		"right": "600",
		"bottom": "390",
		"left": "0"
	},
	"PC": { /* PC == Player Character */
		//"element": document.getElementById("mockPC"),
		//I'll need a setter to set this programattically
		"width": 50,
		"height": 27,//document.getElementById("mockPC").style.height,
		/*"stat": ,*/
		"Name": "Bob",
		"angle": 0,
		"viewSpinAngle": 0
	}
}; 
/* #gameArea
	width: 600px;
	height: 400px;
*/

/** Keyboard controls **/
document.addEventListener("keydown", keyTap);

function keyTap(event) {
  //For letters keyCode seems to start at 65 and go up from there alphabetically (I guess it matches ASCII or Unicode rather than keyboard layout) I actually got the required keyCodes from just reading the alerts made by the test line below
  //alert("you pressed the key with keyCode: " + event.keyCode);
  //alert(globals.PC.width);
  //alert();
  
  //Maybe TODO: diagonals - it would get quite a bit more complicated I think - you'd have to check if another key was already pressed and allow for player not releasing key
  
  if (event.keyCode == 87 || event.keyCode == 38 ) { //w == 87, up arrow == 38 but may also cause page scrolling issues
	  move("u");
  } else if (event.keyCode == 65 || event.keyCode == 37) { //a == 65 or left arrow == 37
	  move("l");
  } else if (event.keyCode == 83 || event.keyCode == 40) { //s == 83 or down arrow == 40
	  move("d");
  } else if (event.keyCode == 68 || event.keyCode == 39) { //d == 68 or right arrow == 39
	  move("r");
  } else if (event.keyCode == 69 || event.keyCode == 32) { //e == 69 or space == 32
	  rotate("");
  };
}

/** Rotate **/
var rotatePCInterval;
function startRotate(dir){  //Allows continuous movement, until endMove called
	//clearInterval lines here are to allow players to "unstick" movement or rotation glitches caused by mouseup or touchend events not firing
	clearInterval(rotatePCInterval);
	clearInterval(movePCInterval);
	//starts off the continuous rotation
	rotatePCInterval = setInterval(function(){ rotate(dir); }, 40);
}

function endRotate(){  //Stops rotation caused by startRotate
	clearInterval(rotatePCInterval);
}

function rotate(dir){
	globals.PC.angle += 3; //weirdly if it goes over 360 js seems to be able to just handle that correctly, even though the value can go way up - might cause issues with a number being unexpectedly hight but maybe not
	document.getElementById("mockPC").style.transform = 'rotate(' + globals.PC.angle + 'deg)';
	//alert(globals.PC.angle); //This line if run and not commented, proves that the angle value keeps going up and up and js/css just handles it
	//rotate viewableArea counter clockwise   use viewSpinAngle
	globals.PC.viewSpinAngle -= 2;
	document.getElementById("viewableArea").style.transform = 'rotate(' + globals.PC.viewSpinAngle + 'deg)';
}


/** Movement **/
var movePCInterval;
function startMove(dir){  //Allows continuous movement, until endMove called
	//clearInterval lines here are to allow players to "unstick" movement or rotation glitches caused by mouseup or touchend events not firing (happens if they move off the button while they're still holding or clicking, or if button text is selected (but in final game I think I'l be getting rid of the text in the button)
	clearInterval(rotatePCInterval);
	clearInterval(movePCInterval);
	movePCInterval = setInterval(function(){ move(dir); }, 80);
}

function endMove(){  //Stops movement caused by startMove
	clearInterval(movePCInterval);
}

function move(dir){ //dir = direction
	let moveAmount = 30; //the amount of px (pixels) that something will move by in one movement, if it can.
	//alert("Should move " + dir);
	//find #mockPC co-ords (here before we check the direction, as every movement attempt will need the starting co-ords, so this saves repitition) -- x axis is from the left to the right, y axis is from top downwards
	var PCx = document.getElementById("mockPC").offsetLeft;
	var PCy = parseInt(document.getElementById("mockPC").offsetTop) - 2; //for some reason offsetTop seems to gets a value 2 px higher than it should and this causes our code to position the PC lower on each move than it should - causing noticeable diagonal movement when moving on x axis and not really noticeable extra/less movement when moving on the y axis.
	var attemptLeftX = PCx; //Instantiated here with the PCx value, rewritten if moving in x axis, still used if moving in in y for collision detection
	var attemptTopY = PCy; //Instantiated here with the PCy value, rewritten if moving in y axis, still used if moving in in x for collision detection
	var viewX = document.getElementById("viewableArea").offsetLeft;
	var viewY = parseInt(document.getElementById("viewableArea").offsetTop) - 29;
	var attViewX = viewX; //Same deal as for PC co-ords
	var attViewY = viewY; //Same deal as for PC co-ords

	//alert("Start: x = " + PCx + ", y = " + PCy);
	//TODO: potential performance increase here - switch case
	if (dir == "u"){ 
		//alert("u");
		
		//to go up reduce the top, since top is the amount of px from the top of the play area
		attemptTopY = PCy - moveAmount;  //Note that the minus treats the values immediatly around it as numbers in this case
		attViewY = viewY - moveAmount;
	} else if (dir == "l"){
		//alert("l");
		//to go left reduce the left, since left is the amount of px from the left edge of the play area
		attemptLeftX = PCx - moveAmount;
		attViewX = viewX - moveAmount;
	} else if (dir == "d"){ 
		//alert("d");
		//to go down we do our old y axis value plus movement amount
		attemptTopY = PCy + moveAmount;
		attViewY = viewY + moveAmount;
	} else if (dir == "r"){
		//alert("r");
		//Take the old x axis value, add the moveAmount
		attemptLeftX = PCx + moveAmount;
		attViewX = viewX + moveAmount;
	};
	
	//During early stages of working collision detection these where defined with the the other attempt values - but they can be based on the other attempt values after they've been calculated with movement included. Since they aren't needed til doing collision checks and those aren't done til here, theres no point defining them earlier just to update them.
	var attemptRightX = attemptLeftX + globals.PC.width;
	var attemptBottomY = attemptTopY + globals.PC.height;
	
	//If the values this is attempting will still be in bounds, change the styles of our Player Character div to show it where we want it to move to
	//function isInBounds(yTop, xLeft, yBase, xRight)
	if(isInBounds(attemptTopY, attemptLeftX, attemptBottomY, attemptRightX)){
		//alert("x: " + attemptLeftX + ", y :" + attemptTopY);
		document.getElementById("mockPC").style.left = attemptLeftX + "px";
		document.getElementById("mockPC").style.top = attemptTopY + "px";
		//Also move the swirly background with you
		document.getElementById("viewableArea").style.left = attViewX + "px";
		document.getElementById("viewableArea").style.top = attViewY + "px";
	} else { //This is one part of a mitigation strategy for an occasional bug caused by mouseup or touchend events not firing - now only really happens when people click hold then move cursor while still holding and release away from the button - having these lines here, mean that at least you stop trying to move there if you collide - (if player taps any button it will also end the old movement)
		clearInterval(movePCInterval);
		clearInterval(rotatePCInterval);
	};
}

function isInBounds(yTop, xLeft, yBase, xRight){
	/*literally just output true if the given co-ords are within the bounds of the play area, and false if not
		Params: 
			yTop is the y axis of the top of the object 
			xLeft is the x axis of the left edge of the object
			yBase is the y axis of the base (bottom) of the object
			xRight is the x axis of the right edge of the object
		We need to compare the co-ords given in params with our boundary that we have stored in our global data
		All our global data is in a JSON format var called "globals" up the top of the file.
		< means the thing on the left is less than the thing on the right  (the crocodile bites the bigger thing!)
		> means the thing on the left is more than the thing on the right
		x axis is left to right
		y axis is up and down (Phil messed this up when he initially wrote the function! woops! Fixed now!)
	*/
	if(yTop < parseInt(globals.bounds.top)){ //globals.bounds.top is the top boundary - value is 0, top y co-ords less than 0 would mean it's above the top boundary
		//alert("top bounds");
		return false;
	} else if (xRight > parseInt(globals.bounds.right)){ //globals.bounds.right is the right boundary - value is 600, right most x co-ords greater than 600 would be beyond the right boundary
		//alert("right bounds");
		return false;
	} else if (yBase > parseInt(globals.bounds.bottom)){ //globals.bounds.bottom is the bottom boundary - value is 400, y co-ords of the base greater than 400 would be beyond the bottom boundary
		//alert("bottom bounds");
		return false;
	} else if (xLeft < parseInt(globals.bounds.left)){ //globals.bounds.left is the left boundary - value is 0, left most x co-ords less than 0 would be beyond the left boundary
		//alert("left bounds");
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
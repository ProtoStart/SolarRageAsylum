/**This file should only have stuff used actually used in the beta for key things.

NOT IN HERE:
Specific level stuff
smaller additions to gameplay mechanics
stuff just for the landing page
stuff being experimented on in Alpha

We expect this file to get cached in players and developers browsers and not have to be reloaded too often.

It is in use from the first beta release onwards

STUFF THAT SHOULD BE IN HERE:
Basic movement and collision detection
Generic functions for showing and hiding content apropriately
Controlling what part of the game the player is in
Main game menu

**/

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
		"top": "30",
		"right": "570",
		"bottom": "360",
		"left": "30"
	},
	"PC": { /* PC == Player Character */
		//"element": document.getElementById("mockPC"),
		//I'll need a setter to set this programattically
		"width": 50,
		"height": 27,//match document.getElementById("mockPC").style.height,
		/*"stat": ,*/
		"Name": "my friend", //access with globals.PC.Name  This should get overwritten when the player names their character - using "my friend" as a default value in case we get a bug where the name is not set - as it's a good stand in for when you don't know a name
		"angle": 3,
		"viewSpinAngle": 0
	},
	"WallsBumped": { //all start off false, and change when PC bumps into them
		"N" : false,  //globals.WallsBumped.N  North wall  -- the top
		"E" : false,
		"S" : false,
		"W" : false
	},
	"Screens": {
		"current" : "screen001",  //Override on each transition, to keep track
		//Annotated template at bottom!
		"screen001" : {
			"prevScreen" : false,  //this is the first screen unless we include for example the landing page
			"nextScreen" : "screen002"
		},
		"screen002" : {
			"prevScreen" : "screen001",
			"nextScreen" : false //to get the animated rainbowVortex we need to call that func  - surely we can do onloads on divs?? instead did I just get it wrong last time I tried??
		},
		"screen003" : {
			"prevScreen" : "screen002", //div id of the previous screen (used for onscreen back button)
			"nextScreen" : "screen003b" //div id of the next screen
		}, 
		"screen003b" : {  //screen number matching div id that this refers to
			"prevScreen" : "screen003", //div id of the previous screen (used for onscreen back button)
			"nextScreen" : "screen004" //div id of the next screen
		}, 
		"screen004" : {  //screen number matching div id that this refers to
			"prevScreen" : "screen003", //div id of the previous screen (used for onscreen back button)
			"nextScreen" : false //false - this is the name input screen, so we have a button next to the input that runs a func to save the input and then move to the next screen
		}, 
		"screen005" : {  //screen number matching div id that this refers to
			"prevScreen" : "screen004", //the div id of the previous screen (used for onscreen back button)
			"nextScreen" : false //false as we need to run launchLevelOne() when done, as it includes some level setup stuff, including showing mainContent show
		}, 
		"mainContent" : { 
			"prevScreen" : "screen005", 
			"nextScreen" : false 
		}, 
 
		/* Annotated Template
		"screen002" : {  //screen number matching div id that this refers to
			"prevScreen" : "screen001", //false if the onscreen back button shouldn't show, otherwise the div id of the previous screen (used for onscreen back button)
			"nextScreen" : "screen003" //false if you don't want a simple skip screen button, otherwise div id of the next screen
		}, 
		Non annotated template
		"screen002" : { 
			"prevScreen" : "screen001", 
			"nextScreen" : "screen003" 
		}, 
		*/
	}
}; 
/* #gameArea
	width: 600px;
	height: 400px;
*/
function pageStart(){
	
	setTimeout(function(){
	nextScreen("screen001", "screen002");
	}, 3000);
}

function showNextBtn(){//Show the button called masterNextBtn
	showViaClass("masterNextBtn");
}

function masterNextBtn(){
	//for now this only does the first screen
	
}

function nextScreen(old, newScreen){
	hideViaClass(old);
	showViaClass(newScreen);
}

/*I don't think this ever actually gets called now!*/
function showgamearea(){
	//#gameArea
	alert("boo");
	showViaClass("gameArea");
}

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
var rotateJustRainbowInterval; // Sorry long var name!
var rotatePCInterval;
function startRotate(dir){  //Allows continuous movement, until endMove called
	//clearInterval lines here are to allow players to "unstick" movement or rotation glitches caused by mouseup or touchend events not firing
	clearInterval(rotatePCInterval);
	clearInterval(movePCInterval);
	//starts off the continuous rotation
	rotatePCInterval = setInterval(function(){ rotate(dir); }, 40);
}

function startRainbowRotate(dir){  //Allows continuous movement, until endMove called
	//starts off the continuous rotation using rotateRainbow(dir)
	rotateJustRainbowInterval = setInterval(function(){ rotateRainbow(dir); }, 40);
}

function endRotate(){  //Stops rotation caused by startRotate
	clearInterval(rotatePCInterval);
}

function endRainbowRotate(){  //Stops rainbow rotation caused by startRainbowRotate
	clearInterval(rotateJustRainbowInterval);
}

function rotatePC(dir){
	globals.PC.angle += 3; //weirdly if it goes over 360 js seems to be able to just handle that correctly, even though the value can go way up - might cause issues with a number being unexpectedly hight but maybe not
	document.getElementById("mockPC").style.transform = 'rotate(' + globals.PC.angle + 'deg)';
}

function rotateRainbow(dir){
	var change = -2; //default to a negative number so that it causes anti-clockwise rotation by default (as the original version of this did, when we only rotated view area acw)
	if(dir == "cw"){ //cw for clockwise - so if we specify clockwise we get clockwise, otherwise we get anti-clockwise
		change = 2;
	}
	//rotate viewableArea counter clockwise   use viewSpinAngle
	globals.PC.viewSpinAngle += change; //add a negative number to rotate anti-cw, add a +ve num to rotate cw
	document.getElementById("viewableArea").style.transform = 'rotate(' + globals.PC.viewSpinAngle + 'deg)';
}

function rotate(dir){ //NOTE at time of writing dir isn't actually used! Only clockwise has been implemented at time of writing
	rotatePC(dir);
	//alert(globals.PC.angle); //This line if run and not commented, proves that the angle value keeps going up and up and js/css just handles it
	rotateRainbow();
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
	} else {
		//one part of a mitigation strategy for an occasional bug caused by mouseup or touchend events not firing - now only really happens when people click hold then move cursor while still holding and release away from the button - having these lines here, mean that at least you stop trying to move there if you collide - (if player taps any button it will also end the old movement)
		clearInterval(movePCInterval);
		clearInterval(rotatePCInterval);
		
		//count up how many different walls player has bumped into
		var iWalls = 0; //Holds our number of walls player has bumped into
		if (globals.WallsBumped.N == true){
			iWalls++;
		};
		if (globals.WallsBumped.E == true){
			iWalls++;
		};
		if (globals.WallsBumped.S == true){
			iWalls++;
		};
		if (globals.WallsBumped.W == true){
			iWalls++;
		};
		//Now we know how many walls bumped into, we can give a message accordingly
		if (iWalls == 4){
			nextScreen("screen009", "screen010");
			//Previously used a confirm, but now we show in screen10 a link to go back
		} else if (iWalls == 3){
			nextScreen("screen008", "screen009");
		} else if (iWalls == 2){
			nextScreen("screen007", "screen008");
		} else if (iWalls == 1){
			nextScreen("screen006", "screen007");
		} 
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
		globals.WallsBumped.N = true;
		return false;
	} else if (xRight > parseInt(globals.bounds.right)){ //globals.bounds.right is the right boundary - value is 600, right most x co-ords greater than 600 would be beyond the right boundary
		//alert("right bounds");
		globals.WallsBumped.E = true;
		return false;
	} else if (yBase > parseInt(globals.bounds.bottom)){ //globals.bounds.bottom is the bottom boundary - value is 400, y co-ords of the base greater than 400 would be beyond the bottom boundary
		//alert("bottom bounds");
		globals.WallsBumped.S = true;
		return false;
	} else if (xLeft < parseInt(globals.bounds.left)){ //globals.bounds.left is the left boundary - value is 0, left most x co-ords less than 0 would be beyond the left boundary
		//alert("left bounds");
		globals.WallsBumped.W = true;
		return false;
	};
	return true; //To get here none of the out of bounds conditions would have been met
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

/** Level 1 / opening story specific stuff  - it probably should be in t's own separate file, but here's fine for now**/
//function used on the screen where the player can name their character
function namePC(){
	var name = "";
	//get the name: the value of the element with id fname
	name = document.getElementById("fname").value;
	//alert(name); //Handy to have for testing
	globals.PC.Name = name;
	//alert("globals.PC.Name == " + globals.PC.Name);
	nextScreen('screen004', 'screen005');
}

function showAwakening(){
	/* showAwakening handles a screen transition where our character wakes up
		while the narration is going on.
		The previous screen with just text is replaced by:
		some new text
		plus the first view of the opening game area
			but the player does not yet have control of the character
			also the black area needs to be smaller
		For Beta 0.0.1 "Early taster Beta" this was done with:
			a copy of the game area markup within the screens div,
				with different id's but CSS classes that had the same rules
		For an improved opening sequence: 
			I want the game area to stay on screen
				An easy way to do that is a seperate div that we just also show in this function
			I want the rainbowVortex to move on it's own at the start
				and then it'll stop during the story
				- to have done this on the stand in one, 
					I would've had to add quite a chunk of stuff that I'd done for the proper game area
		SO NOW:
			this function brings up the next div of words,
			but also the actual game area 
				- without the buttons 
					(those are set to hidden, and altered when we want players to be able to move the character)
				without keyboard input just yet 
					(they have to only be enabled at movable parts anyway - otherwise that would clash with typing into inputs)
				without the extra border we have for preventing the vortex going over the main page background
					(saves space for the text)
	*/
	nextScreen('screen002', 'screen003');
	showViaClass("mainContent");
	rotatePC("dir");
	startRainbowRotate("cw");
	//startRotate("dir");
	//rotateRainbow("cw"); //clockwise rotation
}

function launchLevelOne(){
	//move onto the controls explanation div via nextScreen
	nextScreen('screen005', 'screen006');
	
	//stop the rainbow from rotating, to simulate that that the rotation stops for now (but it comes back when you move around)
	endRainbowRotate(); 
	
	//apply class="ExtraBorder" to gameArea
	document.getElementById("gameArea").classList.add("ExtraBorder");
	
	//display the control buttons
	showViaClass("gameBtns");
	
	//Add the event listener for keytaps - we don't want this active before the game screen is shown!!
	document.addEventListener("keydown", keyTap);
}

function resetGameArea(){
	globals.WallsBumped.N = false;
	globals.WallsBumped.S = false;
	globals.WallsBumped.E = false;
	globals.WallsBumped.W = false;
	//also remove the event listener for keys!
	document.removeEventListener("keydown", keyTap);
	//hide the onscreen buttons
	hideViaClass("gameBtns");
	//hide screen006 - 010 (only one of those would be shown at any given time, but it's easier to make sure they are all hidden than to find out which one is showing and just hide that
	hideViaClass("screen006");
	hideViaClass("screen007");
	hideViaClass("screen008");
	hideViaClass("screen009");
	hideViaClass("screen010");
	//remove the extra border
	document.getElementById("gameArea").classList.remove("ExtraBorder");
	/*set the positions back to the starting place
		#mockPC
		left: 300px;
		top: 195px;
		#viewableArea
		left: 210px;
		top: 62px;
	*/
	document.getElementById("mockPC").style.left = "300px";
	document.getElementById("mockPC").style.top = "195px";
	
	document.getElementById("viewableArea").style.left = "210px";
	document.getElementById("viewableArea").style.top = "62px";
}

function exitGame(){
	if(confirm("Exit back to title screens?")){
		resetGameArea();
		//send back to opening screen
		nextScreen("mainContent", "screen001");
		pageStart();
	};
}
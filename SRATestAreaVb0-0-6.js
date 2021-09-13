/** Last used for: level codes basic testing
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
/*
Game Area
	width: 740px; //70px + 600px + 70px
	height: 530px; //70px + 390px + 70px

Rainbow
	width: 230px;
	height: 230px;
*/
var globals = {
	"GameStage": "start",  // access with globals.GameStage - represents a broad stage of the game - for example, though not finalised yet: start, middle, end
	"bounds": { //The edges of the playable area, in px. Originally based on the div gameArea size definition in gameStyles.css, and then altered from those values to fit. Remember co-ords in JS/CSS are done with 0,0 being the top left.
		"top": "99",
		"right": "658",
		"bottom": "439",
		"left": "90"
	},
	"bumpCoords": { // "Hit-box" co-ordinates of anything the player character might collide with. Remember co-ords in JS/CSS are done with 0,0 being the top left.
		/*
		"exampleObject" : {  Objects are rectangular or at least their hitboxes / "bumpCoords" are
			"top": "104",  //where the top of the object is
			"right": "658", //where the right most edge of the object is
			"bottom": "99",  //where the bottom of the object is
			"left": "90",    //where the left most edge of the object is
			"state": "solid" //info about the object used to show how it will respond to the player going into it
			//Some options: padded (like a padded wall), solid (a non-padded wall), locked (a door that is locked shut), open (an open door), shut (a shut but not locked door), standing (a person who is stood up), hoverbed
		},
		
		todo: group bumpCoords by room ID - by nesting them within a structure along the lines of 
			globals.rooms[roomCoords].bumpCoords   (where roomCoords relates to the location of the room on the full map of the Asylum - maybe by grid ref, or maybe just number them all line by line from the top left - so if it's a 10 by 10 grid and we start at 0 you'd get:

				0	1 	2 	3	4	5	6	7	8	9
				10	11	12	13	14	15	16	17	18	19
				20	21	22	23	24	25	26	27	28	29
				30	31	32	33	34	35	36	37	38	39
				40	41	42	43	44	45	46	47	48	49
				50	51	52	53	54	55	56	57	58	59
				60	61	62	63	64	65	66	67	68	69
				70	71	72	73	74	75	76	77	78	79
				80	81	82	83	84	85	86	87	88	89
				90	91	92	93	94	95	96	97	98	99
				That actually gives an interesting thought - if this is my grid, we can use tens for row and unit for column if we force it to 2 digits (eg 01 instead of 1)
		*/
		  //instead of bounds values for rooms, we can have bumpCoords for each wall, this way we can have gaps for doorways or archways
		"topWall" : { //access this with globals.bumpCoords.topWall
			"top": "94",  //bottom -5, so that the wall is 5px thick  - Represents where the top of this object is
			"right": "658", //match bounds.right because this wall goes up from the left most wall to the right
			"bottom": "99",  //match bounds.top (NOT bounds.bottom) because this is the wall that makes up the top boundary, and it's the bottom of the bumpCoords for the wall that the Player Character will collide with
			"left": "90", //match bounds.left because this wall goes up from the left most wall to the right
			"state": "padded" //it's a padded wall
		},
		"leftWall" : {
			"top": "99",
			"right": "90",   //match bounds.left
			"bottom": "439",
			"left": "85",
			"state": "padded"
		},
		"rightWallTop" : {
			"top": "99", //match bounds.top as the top of this wall ends there
			"right": "663",  //left + 5 to make it 5px thick 
			"bottom": "248", //match the top of "doorToCorridor"  
			"left": "658",  //match bounds.right (NOT bounds.left) because this wall makes up part of the right boundary, and it's the left of the bumpCoords for this wall that the Player Character will collide with
			"state": "padded" //it's a padded wall
		},
		"doorToCorridor" : {
			
			/*
			old values before visual adjustment:
				"top": "149"
				"right": "663"
				"bottom": "169",
				"left": "658"
			css after visual ajustment:
				top: 248px;
				left: 663px;
			
			*/
			"top": "248", //match bottom of "rightWallTop"
			"right": "668",  //left + 5
			"bottom": "268",  //top + 20
			"left": "663",  //match bounds.right (NOT bounds.left) because this door (while locked) makes up part of the right boundary, and it's the left of the bumpCoords for this wall that the Player Character will collide with
			"state": "open", //default as an open door since we don't use these until they check on you (we could have a section where they try to feel for a door, but that would probably be repetitive and dull)
			"doorTo": "corridorOne" //only doors have doorTo data, it's literally just a way of knowing where the player should be taken as they go through
		},
		"rightWallBottom" : {
			"top": "169", //match bottom of "doorToCorridor"
			"right": "663",  
			"bottom": "439",
			"left": "658", //match bounds.right (NOT bounds.left) because this wall makes up part of the right boundary, and it's the left of the bumpCoords for this wall that the Player Character will collide with
			"state": "padded"
		},
		"bottomWall" : {
			"top": "439",  //match bounds.bottom
			"right": "658",
			"bottom": "444",  
			"left": "90",
			"state": "padded"
		}
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
		"loadFrom": "screen003b", //Default is the screen where game play in a new game starts from. This var is altered when players choose to load the game at some other point, stored here for when they've got through the screens we want to show the players each time. To access this use globals.Screens.loadFrom
		"current" : "screen001", //Override each transition, to keep track - globals.Screens.current to access 
		//Annotated template at bottom!
		"screen001" : {
			"prevBtn" : false,  //this is the first screen unless we include for example the landing page
			"nextBtn" : function() {
				/*The next button intentionally does not show on first load of the page, but in some circumstances we might go back to that screen and we also now use the next button function for the text onclick since it was a convenient way to implement the load game button having focus*/
				nextScreen("screen001", "screen002");
				document.getElementById("loadGameBtn").focus();
			}
		},
		"screen002" : {
			"prevBtn" : false, /* Would be weird to have a Previous button and not a Next button - TODO add a "credits" button */
			"nextBtn" : false /*This screen now has Load and Start New Game buttons */
		},
		"loadGameScreen" : { /* The screen for choosing which place to load the game from*/
			"prevBtn" : "screen002",
			"nextBtn" : false
		},
		"controlsInfo" : { //Shows as a screen right after we go to full screen - when shown as a modal we won't use this block
			"prevBtn" : function() {
				closeFullscreen();
				nextScreen("controlsInfo","screen002");
			}, 
			"nextBtn" : function() {
				nextScreen("controlsInfo","screen003");
				document.getElementById("useSpin").focus();
			}
		},
		"screen003" : { //has an epilepsy warning in the centre of the screen
			"prevBtn" : "controlsInfo", 
			"nextBtn" : function() {
				/**Set spin settings depending on check box checked**/
				if(document.getElementById('useSpin').checked){
				//checkbox labelled "Use spin effect?" is checked
					globals.playerSettings.spin = true;
				} else {
				//checkbox labelled "Use spin effect?" is not checked
					globals.playerSettings.spin = false;
				}
				/**Launching into the actual game - different screens need different things to be happening when they load along with the text**/
				if (globals.Screens.loadFrom == "screen003b"){
					showAwakening();
				} else if (globals.Screens.loadFrom == "screen005"){
				//This loadFrom exists for developer convenience
					showAwakening();
					hazeInstantClear()
				} else if (globals.Screens.loadFrom == "screen010"){
					skipToScreen010Prep();
					hazeInstantClear();
				}
				//resetGameArea();
				
				nextScreen("screen003", globals.Screens.loadFrom);
			}
		}, 
		"screen003b" : {  //Game starts here - You awaken in a haze...
			"prevBtn" : function() {
				//neatly handle going back a screen
				undoAwakening(); //contains code for moving back a screen
			}, 
			"nextBtn" : function() {
				hazeStartsToClear();
				nextScreen("screen003b", "screen003b2"); //yes I know the screen naming is getting silly
			}
		}, 
		"screen003b2" : {  //"The haze begins to clear"
			"prevBtn" : "screen003b", //div id of the previous screen (used for onscreen back button)
			"nextBtn" : function() {
				hazeClearsABitMore();
				nextScreen("screen003b2", "screen003b3"); 
			} 
		}, 
		"screen003b3" : {  //"Out from the haze, a swirl of colours emerges"
			"prevBtn" : "screen003b2", //div id of the previous screen (used for onscreen back button)
			"nextBtn" : function() {
				hazeClears();
				nextScreen("screen003b3", "screen003c"); 
			} 
		}, 
		"screen003c" : {  //screen number matching div id that this refers to
			"prevBtn" : "screen003b2", //div id of the previous screen (used for onscreen back button)
			"nextBtn" : "screen003d" //div id of the next screen
		}, 
		"screen003d" : {  //screen number matching div id that this refers to
			"prevBtn" : "screen003c", //div id of the previous screen (used for onscreen back button)
			"nextBtn" : "screen003e" //div id of the next screen
		}, 
		"screen003e" : {  //screen number matching div id that this refers to
			"prevBtn" : "screen003d", //div id of the previous screen (used for onscreen back button)
			"nextBtn" : "screen003f" //div id of the next screen
		}, 
		"screen003f" : {  //screen number matching div id that this refers to
			"prevBtn" : "screen003e", //div id of the previous screen (used for onscreen back button)
			"nextBtn" : function() {
				nextScreen("screen003f","screen004");
				//Set the focus to the text box for the name
				document.getElementById("fname").focus();
			}
		}, 
		"screen004" : {  //screen number matching div id that this refers to
			"prevBtn" : "screen003f", //div id of the previous screen (used for onscreen back button)
			"nextBtn" : false //false - this is the name input screen, so we have a button next to the input that runs a func to save the input and then move to the next screen
		}, 
		"screen005" : {  //screen number matching div id that this refers to
			"prevBtn" : "screen004", //the div id of the previous screen (used for onscreen back button)
			"nextBtn" : function() {
				//we need to run launchLevelOne() when done, as it includes some level setup stuff, including showing mainContent
				launchLevelOne();
				saveToLocalStorage("Derek","true");
			}
		},
		"screen006" : {  //screen number matching div id that this refers to
			"prevBtn" : false, //the div id of the previous screen (used for onscreen back button)
			"nextBtn" : false //false as we need to run launchLevelOne() when done, as it includes some level setup stuff, including showing mainContent show
		},
		"screen007" : {  //screen number matching div id that this refers to
			"prevBtn" : false, //the div id of the previous screen (used for onscreen back button)
			"nextBtn" : false //false as we need to run launchLevelOne() when done, as it includes some level setup stuff, including showing mainContent show
		},
		"screen008" : {  //screen number matching div id that this refers to
			"prevBtn" : false, //the div id of the previous screen (used for onscreen back button)
			"nextBtn" : false //false as we need to run launchLevelOne() when done, as it includes some level setup stuff, including showing mainContent show
		},
		"screen009" : {  //screen number matching div id that this refers to
			"prevBtn" : false, //the div id of the previous screen (used for onscreen back button)
			"nextBtn" : false //false as we need to run launchLevelOne() when done, as it includes some level setup stuff, including showing mainContent show
		},
		"screen010" : {  //screen number matching div id that this refers to
			"prevBtn" : false, //the div id of the previous screen (used for onscreen back button)
			"nextBtn" : function() {
				nextScreen("screen010","screen011");
				saveToLocalStorage("padded","true");
				/*go to "cut screen" 
					- hide game buttons
					- turn off keyboard controls
				*/
				resetGameArea();
				globals.GameStage = "middle";
			}
		},
		"screen011" : { 
			"prevBtn" : function() {
				skipToScreen010Prep();
				nextScreen("screen011","screen010");
			},
			"nextBtn" : "screen011b"
		},
		"screen011b" : { 
			"prevBtn" : "screen011",
			"nextBtn" : "screen012"
		},
		"screen012" : { 
			"prevBtn" : "screen011b",
			"nextBtn" : "screen013"
		},
		"screen013" : { 
			"prevBtn" : "screen012",
			"nextBtn" : "screen014"
		},
		"screen014" : { 
			"prevBtn" : "screen013",
			"nextBtn" : "screen015"
		},
		"screen015" : { 
			"prevBtn" : "screen014",
			"nextBtn" : "screen016"
		},
		"screen016" : { 
			"prevBtn" : "screen015",
			"nextBtn" : "screen017"
		},
		"screen017" : { 
			"prevBtn" : "screen016",
			"nextBtn" : function() {
				nextScreen("screen017","screen018");
				//Set the focus to the first button
				document.getElementById("canYouHearChoiceA").focus();
			}
		},
		"screen018" : { 
			"prevBtn" : "screen017",
			"nextBtn" : "screen019"
		},
		"screen019" : { 
			"prevBtn" : "screen018",
			"nextBtn" : false /*Divergent choices*/
		},
		"screen019f" : { 
			"prevBtn" : false, /*No going back!*/
			"nextBtn" : false /*Action section*/
		},
		/* Annotated Template
		"screen002" : {  //screen number matching div id that this refers to
			"prevBtn" : "screen001", //false if the onscreen back button shouldn't show, otherwise the div id of the previous screen (used for onscreen back button)
			"nextBtn" : "screen003" //false if you don't want a simple skip screen button, otherwise div id of the next screen
		}, 
		Non annotated template
		"screen002" : { 
			"prevBtn" : "screen001", 
			"nextBtn" : "screen003" 
		}, 
		*/
	},
	"playerSettings": {
		//for people with epilepsy or suffer from visually triggered headaches
		"spin": false //access with globals.playerSettings.spin
	}
}; 
/* #gameArea
	width: 600px;
	height: 400px;
*/

function pageStart(){
	setTimeout(function(){
		if(globals.Screens.current == "screen001"){  //Only want to show screen002 if automatically if we're still on screen001 at that time, otherwise glitches occur
			nextScreen("screen001", "screen002");
			document.getElementById("loadGameBtn").focus();
		}
	}, 3000);
}

function startNewGame() {
	/*This will take player from opening screens, into a fairly blank screen briefly
		while browser full screen mode takes effect fully
		so that that is completely done before seemlessly moving into the story opening
	*/
	openFullscreen();
	globals.Screens.loadFrom = "screen003b";
	nextScreen("screen002","controlsInfo");
}

function showLoadGameScreen() {
	nextScreen("screen002","loadGameScreen");
	if(localStorage.getItem("Derek") == "true"){ //"true" as a string because localStorage stores everything as strings
		//enable loadHiDerekBtn
		document.getElementById("loadHiDerekBtn").disabled = false;
	}
	if(localStorage.getItem("padded") == "true"){ //"true" as a string because localStorage stores everything as strings
		//enable loadSection2Btn
		document.getElementById("loadSection2Btn").disabled = false;
	}
}

function loadSectionFromClean(section){
	/*Used by the buttons in the load game screen. Loads a given section from not having anything loaded and also makes sure player sees screens they should see every game session
	By this point, players have already seen the title card and screen002, but we still need:
		- Some form of epilepsy warning and spin effect opt out
		- Some form of reminder for phone users to put their phone in landscape mode
		- a choice of seeing the controls again
	Then after that, we load in whatever screen is at the start of the given section
	*/
	//use the parameter to know which section the player wishes to skip to, and therefore which screen id to remember for when the pre-game screens are finished and we're ready to skip on 
	if(section == 1){
		globals.Screens.loadFrom = "screen005";
	} else if(section == 2){
		globals.Screens.loadFrom = "screen010";
	}
	
	
	alert("Game will show after these reminders");
	openFullscreen();
	nextScreen("loadGameScreen", "controlsInfo");
}

function openFullscreen() {
//opens the browser in full screen - particularly wanted on mobile so that we have a bit more screen to work with
//found on https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_fullscreen
	var elem = document.getElementById("all");
	if (elem.requestFullscreen) {
		elem.requestFullscreen();
	} else if (elem.webkitRequestFullscreen) { /* Safari */
		elem.webkitRequestFullscreen();
	} else if (elem.msRequestFullscreen) { /* IE11 */
		elem.msRequestFullscreen();
	}
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen();
  }
}

function masterPrevBtnClick(){
//click event function for masterPrevBtn
	var screenLeaving = globals.Screens.current;
	if (typeof globals.Screens[screenLeaving].prevBtn === "string"){
	//if theres a string in the value for nextBtn then we...
		//...use the nextScreen function, passing the value in that string
		nextScreen(screenLeaving, globals.Screens[screenLeaving].prevBtn);
	} else {
		globals.Screens[screenLeaving].prevBtn();
	}
}

function masterNextBtnClick(){
//click event function for masterNextBtn
	//TODO: improve the logic here. (This feels bodgy as I'm writing it - probably need to make changes to nextScreen)
	var screenLeaving = globals.Screens.current;
	if (typeof globals.Screens[screenLeaving].nextBtn === "string"){
	//if theres a string in the value for nextBtn then we...
		//...use the nextScreen function, passing the value in that string
		nextScreen(screenLeaving, globals.Screens[screenLeaving].nextBtn);
	} else {
		globals.Screens[screenLeaving].nextBtn();
	}
}

function nextScreen(old, newScreen){  //"new" is a reserved word that we can't have as a parameter name
	hideViaClass(old);
	showViaClass(newScreen);
	//keep track of which screen is showing, in our globals
	globals.Screens.current = newScreen;
	/*	globals.Screens[newScreen] is equivalent to globals.Screens. whatever our newScreen value is 
		we could have gone with globals.Screens[globals.Screens.current] as in this case they'll have the same value but 
			... that would be silly to do here as that adds an extra thing for JS to look up and we've literally just set that value
	*/
	//handle a potential error that happens if globals doesn't have the value
	if (typeof globals.Screens[newScreen] === 'undefined' || globals.Screens[newScreen].prevBtn === 'undefined' || globals.Screens[newScreen].prevBtn === null) {
    // variable is undefined or null
		//I think we can get away with a silly error message like this, poking fun at ourselves
		alert("if you're seeing this, a developer hasn't added values needed for the screen transition");
	} else if (globals.Screens[newScreen].prevBtn == false){
	//the value is set to false - meaning button should be hidden
		//make sure that the prevous screen button (masterPrevBtn) is hidden
		hideViaClass("masterPrevBtn");
	} else {
		showViaClass("masterPrevBtn");
	}
	
	//Basically the same as for masterPrevBtn but for masterNextBtn
	if (typeof globals.Screens[newScreen] === 'undefined' || globals.Screens[newScreen].nextBtn === 'undefined' || globals.Screens[newScreen].nextBtn === null) {
    // variable is undefined or null
		//a slightly different error message - since it's likely to show straight after one for the prvious buttons - since if you've forgotten one it'slikely you've forgotten both
		alert("the developer should check the values for globals.Screens");
	} else if (globals.Screens[newScreen].nextBtn == false){
	//the value is set to false - meaning button should be hidden
		//make sure that the next screen button (masterNextBtn) is hidden
		hideViaClass("masterNextBtn");
	} else {
		showViaClass("masterNextBtn");
		//Set autofocus on the button so that if on PC the player can hit enter to go to next screen
		document.getElementById("masterNextBtn").focus();
	}
}

function keyTap(event) {
  //For letters keyCode seems to start at 65 and go up from there alphabetically (I guess it matches ASCII or Unicode rather than keyboard layout) I actually got the required keyCodes from just reading the alerts made by the test line below
  //alert("you pressed the key with keyCode: " + event.keyCode);
  
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
	//Don't do any of this function if the player settings show that the player does not want the rainbow spin effect
	/*We also have this check in the actual rotateRainbow function 
		(so that rotate button roates stickman but not the rainbow) 
		but it's a waste of resources to set a func on interval if not using it
	*/
	if (globals.playerSettings.spin == false){
		return;
	}
	//We don't want multiple of these intervals set, so this wipes any existing interval first. I tried code that checks for an interval instead of this approach, and it seemed great, until changing back and forward on screens causes false negatives on those checks
	clearInterval(rotateJustRainbowInterval);
	//starts off the continuous rotation using rotateRainbow(dir)
	rotateJustRainbowInterval = setInterval(function(){ rotateRainbow(dir); }, 50); //After playtesting, I made the interval 10ms longer than it originally was, to slow the movement down so that it's taking less of the players focus.
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
	//Don't do the rest of this function if the player settings show that the player does not want the rainbow spin effect
	if (globals.playerSettings.spin == false){
		return;
	}
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

function move(dir){  //dir = direction
	let moveAmount = 30; //the amount of px (pixels) that something will move by in one movement, if it can.
	//alert("Should move " + dir);  //a line for quick debugging purposes
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
	
	if (globals.GameStage == "start"){  //This bit is only useful for when the character is waking up in the recovery room - possibly even only on the first time that happens
		
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
			switch(iWalls){
				case 1:
					nextScreen("screen006", "screen007");
					break;
				case 2:
					nextScreen("screen007", "screen008");
					break;
				case 3:
					nextScreen("screen008", "screen009");
					break;
				case 4:
					nextScreen("screen009", "screen010");
					break;	
			}
		};
	} else {
		switch(checkMovement(attemptTopY, attemptLeftX, attemptBottomY, attemptRightX)){
			case "clear": //nothing detected
				document.getElementById("mockPC").style.left = attemptLeftX + "px";
				document.getElementById("mockPC").style.top = attemptTopY + "px";
				//Also move the swirly background with you
				document.getElementById("viewableArea").style.left = attViewX + "px";
				document.getElementById("viewableArea").style.top = attViewY + "px";
				break;
			case "open":  //an open door
				//TODO: how do we know where the door takes us??? surely we need some data for that or a function coming back to move the game onto the next place?
				alert("door is open");
				break;
			

			
		}
	}
}

function checkMovement(yTop, xLeft, yBase, xRight){
	/*	A more sophisticated version of isInBounds   (Todo: HERE!!)
		
		isInBounds is tightly coupled with the very simple starting room - it was only built with that in mind (intentionally: to keep the development of it simple at the time)
		isInBounds works great for the opening bit where:
			you are entirely locked into a room with four walls to bump into
			you are just sussing out where the walls are
			there is no possibility that the player can see the suroundings already
			there are no other objects, people or creatures in the room with you
			
		Note: isInBounds could made better for that start, and help transition to developing this, by being able to detect where the door is
			
			
		current limitations: 
			we currently have no way to set that there are open doorways at specific locations
				we don't yet recognise the difference between wall area and door area
					we don't yet show the difference between wall area and door area
					we don't yet display a different message when the player gets to a place where a door is (closed or open)
				we don't have a way of a recording or showing if a door is open
				we have no way to transition on to a new area when an open doorway is travelled through
			this doesn't cover objects or any other kind of thing restricting movement ...
				... as an area that can be approached from different angles
				... as an area that can be navigated around
				
	*/
	/*
	 eventually we want to loop through all of the bumpCoords  - globals.bumpCoords
	 for now I'll just check for the door, then when that's working I'll wrap it in a more generic for
	 Loop will be something like below commented code, but maybe a different path
		for(var item in globals.bumpCoords){
			
		}
		
	 and here's a ref for the data for the door	
		"doorToCorridor" : {
			"top": "149", //match bottom of "rightWallTop"
			"right": "663",  
			"bottom": "169",
			"left": "658",  //match bounds.right (NOT bounds.left) because this door (while locked) makes up part of the right boundary, and it's the left of the bumpCoords for this wall that the Player Character will collide with
			"state": "open" //default as an open door since we don't use these until they check on you (we could have a section where they try to feel for a door, but that would probably be repetitive and dull)
		},
		
		(yTop, xLeft, yBase, xRight)
	*/
	//Check for vertical collisions: if yTop (the top of what is moving) will be higher than the bottom of the door, at the same time as the base of what is moving is below the top of the door
	if ((yTop < globals.bumpCoords.doorToCorridor.bottom  && yBase > globals.bumpCoords.doorToCorridor.top )&&(xLeft < globals.bumpCoords.doorToCorridor.right  && xRight > globals.bumpCoords.doorToCorridor.left)){
		
		return globals.bumpCoords.doorToCorridor.state;
	};

	//if nothing  is found here it's clear (in theory anyway)
	return "clear";
}


function isInBounds(yTop, xLeft, yBase, xRight){
	/* Only for the starting room, while the doors are shut - a more complex and sophisticated version is in checkMovement
		1)original use - output true if the given co-ords are within the bounds of the play area, and false if not
		2)for a while before I altered this comment also - record which walls have been bumped into
		3) TODO: Make a visible effect occur whenever bumps happen
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
		makeVisible("northWall");
		globals.WallsBumped.N = true;
		return false;
	} else if (xRight > parseInt(globals.bounds.right)){ //globals.bounds.right is the right boundary - value is 600, right most x co-ords greater than 600 would be beyond the right boundary
		makeVisible("eastWall");
		globals.WallsBumped.E = true;
		return false;
	} else if (yBase > parseInt(globals.bounds.bottom)){ //globals.bounds.bottom is the bottom boundary - value is 400, y co-ords of the base greater than 400 would be beyond the bottom boundary
		makeVisible("southWall");
		globals.WallsBumped.S = true;
		return false;
	} else if (xLeft < parseInt(globals.bounds.left)){ //globals.bounds.left is the left boundary - value is 0, left most x co-ords less than 0 would be beyond the left boundary
		makeVisible("westWall");
		globals.WallsBumped.W = true;
		return false;
	};
	return true; //To get here none of the out of bounds conditions would have been met
}


/*by "via class" we mean by swapping css classes that handle showing or hiding things
Use in conjuction with hideViaClass(id) and css classes called "hidden" and "showing" that have css to hide/show things
*/
function showViaClass(id){
  document.getElementById(id).classList.remove("hidden");
  document.getElementById(id).classList.add("showing");
}

/*by "via class" we mean by swapping css classes that handle showing or hiding things
Use in conjuction with showViaClass(id) and css classes called "hidden" and "showing" that have css to hide/show things
*/
function hideViaClass(id){
	document.getElementById(id).classList.remove("showing");
	document.getElementById(id).classList.add("hidden");
}

function makeVisible(id){
	document.getElementById(id).classList.remove("invisible");
	document.getElementById(id).classList.add("visible");
}

function makeInvisible(id){
	document.getElementById(id).classList.remove("visible");
	document.getElementById(id).classList.add("invisible");	
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

function hazeStartsToClear(){
	document.getElementById("viewableArea").classList.remove("haze");
	document.getElementById("viewableArea").classList.add("mediumHaze");
}

function hazeClearsABitMore(){
	document.getElementById("viewableArea").classList.remove("mediumHaze");
	document.getElementById("viewableArea").classList.add("lowHaze");
}

function hazeClears(){
	document.getElementById("viewableArea").classList.remove("lowHaze");
	document.getElementById("viewableArea").classList.add("noHaze");
}

function hazeInstantClear(){
	document.getElementById("viewableArea").classList.remove("haze");
	document.getElementById("viewableArea").classList.add("noHaze");
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
	
	showViaClass("mainContent");
	rotatePC("dir");
	startRainbowRotate("cw");
	
	
	//startRotate("dir");
	//rotateRainbow("cw"); //clockwise rotation
}

function undoAwakening(){
//used if user clicks the previous button from the screen where you have the awakening
	//Need to end the rotation - otherwise if it's loaded again while the first is still loaded it will rotate twice as fast
	endRainbowRotate(); 
	nextScreen('screen003b', 'screen003');
	hideViaClass("mainContent");
}

function allowMovement(){
	//display the control buttons
	showViaClass("gameBtns");
	
	//Add the event listener for keytaps - we don't want this active before the game screen is shown!!
	document.addEventListener("keydown", keyTap);
}

function launchLevelOne(){
	//move onto the controls explanation div via nextScreen
	nextScreen('screen005', 'screen006');
	
	//stop the rainbow from rotating, to simulate that that the rotation stops for now (but it comes back when you move around)
	endRainbowRotate(); 
	
	//apply class="ExtraBorder" to gameArea
	document.getElementById("gameArea").classList.add("ExtraBorder");
	
	allowMovement();
}


function startEarlyEscapeAttempt(){
	//swap out the first choice screen with the screen with thoughts screen via nextScreen
	nextScreen('screen019', 'screen019f');
	//let them move
	allowMovement();
}

function skipToScreen010Prep(){
	showViaClass("mainContent");
	//apply class="ExtraBorder" to gameArea
	document.getElementById("gameArea").classList.add("ExtraBorder");
	//Set the WallsBumped values to true so that the bump messages can't get shown
	globals.WallsBumped.N = true;
	globals.WallsBumped.S = true;
	globals.WallsBumped.E = true;
	globals.WallsBumped.W = true;
	makeVisible("northWall");
	makeVisible("southWall");
	makeVisible("eastWall");
	makeVisible("westWall");
	
	allowMovement();
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
	//document.getElementById("gameArea").classList.remove("ExtraBorder");
	/*set the positions back to the starting place
		#mockPC 		left: 300px;	top: 195px;
		#viewableArea	left: 210px;	top: 62px;
	*/
	document.getElementById("mockPC").style.left = "300px";
	document.getElementById("mockPC").style.top = "275px";
	document.getElementById("viewableArea").style.left = "210px";
	document.getElementById("viewableArea").style.top = "142px";
}
s
function exitGame(){
	if(confirm("Exit back to title screens?")){
		resetGameArea();
		//send back to opening screen
		nextScreen("mainContent", "screen001");
		//a confirm popping up ends full screen on some/most browsers but won't fix scrolling issue on start screen, unlike specifically calling the closeFullscreen func
		closeFullscreen();
		pageStart();
	};
}

function showControlsPage(){
//TODO: UNTESTED should show the controls page as a "modal" over the other content
	// Get the modal
	var modal = document.getElementById("controlsInfo");
	/* Commented out: 
	adapted this function from a startup function in my TeaRounder project
	probably won't have a single button that opens the modal
	
	// Get the button that opens the modal
	var infoButton = document.getElementById("infoButton");
	// When the user clicks the button, open the modal 
	infoButton.onclick = function() {
		//modal.innerHTML = "<div>content from info.html</div>"; //This would be my preference rather than using a iFrame but I can't figure it out at time of writing
		modalIFrame.src = "info.html";
		modal.style.display = "block";
	}
	
	*/
	// When the user clicks on the x span, close the modal
	document.getElementsById("closeControls").onclick = function() {
	  modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	  if (event.target == modal) {
		modal.style.display = "none";
	  }
	}
	//make controlsInfo visible
	showViaClass("controlsInfo");
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

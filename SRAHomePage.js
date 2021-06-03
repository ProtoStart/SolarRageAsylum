/*This file is the JavaScript in use on the homepage/landing page of Solar Rage Asylum - only put functions in here when they are actually being used!*/

function codeUnlockFunc(){
	//alert("funky"); //test the function runs
	/* 	This is a dedicated function for the button with ID "tryCodeBtn"
		Currently, it is only for unlocking things that are hidden within the page already - it isn't intended to be secure, and everything can run on the client side.
		Main planned use: allowing access to stuff that isn't polished enough for feedback, but won't matter if curious people find it.
		Also: Easter eggs, cheat codes, level codes
	
		This needs to:
			get the contents of the input with id codeUnlock (DONE)
			test it against various secret codes (DONE for now, TODO: for long term should use a switch or a dictionary of keys - so it just looks up the value in a list and pulls off the correct option, rather than have a big string of ifs that will get ugly and hard to use) 
			do a particular thing if it matches a code (for certain things DONE)
			give a big "nope" if it's incorrect (DONE)
		
	*/
	//get the contents of the input with id codeUnlock - tested works
	var codeAttempt = document.getElementById("codeUnlock").value;
	//test it against various secret codes (if's will work to start)
	if (codeAttempt == ""){
		alert("You gotta type something fool!");
	} else if (codeAttempt == "hunter2"){
		alert("Nice password! (try demanding entry in three words but combined into one for 7 characters, all lower case");
	} else if (codeAttempt == "CAJJLLLBCK" || codeAttempt == "FLCIKLMODO" || codeAttempt == "GINLNNIIJL"){ //lemmings level codes fun 1 and fun 30 and mayhem 30 respectively
		alert("Level codes aren't implemented yet, but try niemtel backwards instead");
	} else if (codeAttempt == "letmein" || codeAttempt == "Iwannaplay"|| codeAttempt == "please let me in" || codeAttempt == "let me in please"){//display the hidden tab when "letmein" or "Iwannaplay" , "please let me in" or "let me in please" is used as a code, and the user confirms our agreement
		if (confirm("Are you okay playing a game, in such early stages that it's probably a bit of a mess, and might not even have anything playable?")){
			if (confirm("Wanna come into our testing area?")){
				hideAllXClassShowY("homePageTabs","mulysaehtotecnartne");
			};
		};
	} else if (codeAttempt == "uuddlrlrba" || codeAttempt == "wwssadadba" || codeAttempt == "upupdowndownleftrightleftrightba" || codeAttempt == "up up down down left right left right b a"|| codeAttempt == "UUDDLRLRBA"){//Up, Up, Down, Down, Left, Right, Left, Right, B, A - reference to "the Konami code"
		alert("Cheat code accepted! It doesn't do anything yet except tell you this: try letmein");
	} else if (codeAttempt == "I know where you hid the body"){
		alert("it's not hidden! it's right there in view source!"); //A joke I made up
	} else {
		alert("NOPE that code ain't right! There is no limit on attempts currently, so keep trying. Maybe get your friends to help guess??");
	}
}


/** Code for divTabs **/
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

function hideAllXClassShowY(x,y){
	//as it says on the tin - Hides all elements with the class given in x, and Shows the element with Id given in y
	var xElements = document.getElementsByClassName(x);
	
	var i;
	for (i = 0; i < xElements.length; i++) {
		hideViaClass(xElements[i].id);
	}
	
	showViaClass(y);
}

function deselectXClassViaClass(x){
	var xElements = document.getElementsByClassName(x);
	
	var i;
	for (i = 0; i < xElements.length; i++) {
		//document.getElementById(xElements[i].id).disabled = false;
		document.getElementById(xElements[i].id).classList.remove("Selected");
	}
}

/*by class we mean css class
Use in conjuction with css class called "Selected" that marks things for users as a currently selected thing
Typically also need  to deselect all items
*/
function selectViaClass(id){
	document.getElementById(id).classList.add("Selected");
	//document.getElementById(id).disabled = true;  //not disabling currently - it can effect the visuals, got it here commented so that if we wish to try that out, we'd simply uncomment the code on this line
}

function hardcodedHTMLDivTabs(tabDivClass, tabButtonClass, showDivId, selectedButtonId){
	/*This function is used for creating a Tab interface effect, where you have a div in the HTML for each tabs content - all with a class that you pass into tabDivClass, plus buttons that select each tab with a class that you pass into tabButtonClass. */
	//Call function to hide everything with class passed into tabDivClass and then show just the one with the id passed into showDivId
	hideAllXClassShowY(tabDivClass,showDivId);
	//we deselect all the buttons, and then select the one that was clicked afterwards
	//(saves this function having to know what was just clicked and what was previously selected)
	deselectXClassViaClass(tabButtonClass);
	selectViaClass(selectedButtonId);
}
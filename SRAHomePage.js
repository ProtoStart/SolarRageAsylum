/*This file is the JavaScript in use on the homepage/landing page of Solar Rage Asylum - only put functions in here when they are actually being used!*/
/** Unlock/cheat codes **/
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
	//This line undoes one of the gimmicky things this function does on certain words (adding a "lime" class to the mainContent div)
	document.getElementById("mainContent").classList.remove("lime");
	//get the contents of the input with id codeUnlock - tested works
	var codeAttempt = document.getElementById("codeUnlock").value;
	var codeAttemptLower = codeAttempt.toLowerCase();
	//test it against various secret codes (if's will work to start)
	if (codeAttempt == ""){
		alert("You gotta type something fool!");
	} else if (codeAttempt == "hunter2"){
		alert("Nice password! - but it's not correct - try demanding entry in three words but combined into one for 7 characters (in any combination of upper or lower case letters)");
	} else if (codeAttempt.includes("RHCP") || codeAttemptLower.includes("chili peppers")){
		alert("by the way I tried to say I'd be there, waiting for");
	} else if (codeAttemptLower.includes("rosebud")){ //Sims "rosebud" cheat
		alert("Your characters Simolean bank account set to having 1000 Simoleans. You won't actually be able to withdraw or spend them, so they are kinda useless!");
		saveToLocalStorage("simoleans","1000");
	} else if (codeAttempt == "CAJJLLLBCK" || codeAttempt == "FLCIKLMODO" || codeAttempt == "GINLNNIIJL"){ //lemmings level codes fun 1, fun 30 and mayhem 30 respectively
		alert("Level codes aren't implemented yet, but try niemtel backwards instead");
	} else if (codeAttemptLower.includes("letmein") ||codeAttempt == "Iwannaplay"|| codeAttemptLower.includes("let me in")){//display the hidden tab when "letmein", "Letmein" or "Iwannaplay" , or anything with the words "let me in"/ such as "please let me in" or "let me in please" is used as a code, and the user confirms our agreement. Added the "Letmein" variety because mobile browsers sometimes default to starting words with a capital letter and it's just annoying
		if (confirm("Wanna see our alpha testing area?")){
			if (confirm("The game in the alpha test area is often in a very unfinished messy state while stuff is being tested for browser compatibility. Still ok?")){
				hideAllXClassShowY("homePageTabs","mulysaehtotecnartne");
			};
		};
	} else if (codeAttemptLower.includes("uuddlrlrba") || codeAttemptLower.includes("wwssadadba") || codeAttemptLower.includes("upupdowndownleftrightleftright") || codeAttemptLower.includes("up up down down left right left right")){//Up, Up, Down, Down, Left, Right, Left, Right, B, A - reference to "the Konami code" - a few permutations allowed including use of includes so that there can be other things like start, and on the longer ones I've made it be forgiving of missing the end letters or getting them wrong
		alert("Cheat code accepted! It doesn't do anything yet except tell you this: try letmein");
	} else if (codeAttemptLower.includes("i know where you hid the body")){
		alert("it's not hidden! it's right there in view source! (this joke is probably vaguely amusing if you're a web developer)"); //An HTML joke I made up
	} else if (codeAttemptLower.includes("lime") || codeAttemptLower.includes("colour") || codeAttempt.includes("color")){
		alert("BEHOLD! here be the greatest colour");
		document.getElementById("mainContent").classList.add("lime");
	} else if (codeAttemptLower.includes("furious the monkey boy")){ //Age of Empires 2 reference
		alert("Raiding party!!"); 
	} else if (codeAttemptLower.includes("i r winner")){ //Age of Empires 2 reference
		alert("All hail, king of the losers!"); 
	} else if (codeAttemptLower.includes("padded")){
		/** LEVEL CODE TO SKIP TO THE INTRO **/
		if( saveToLocalStorage("padded","true")){
			alert("You've activated this code for this browser now, but level codes are still being implemented. "); 
		}
	} else {
		alert("NOPE that code ain't right! There is no limit on attempts currently, so keep trying. Maybe get your friends to help guess??");
	}
}

/** Local storage **/
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


/** ****  divTabs and related hide/show functions **********
	(divTabs being the tabbed layout effect created with hidden divs and buttons that fire off code that will show the matching div and hide the others)
**/
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
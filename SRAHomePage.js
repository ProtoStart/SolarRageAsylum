/*This file is the JavaScript in use on the homepage/landing page of Solar Rage Asylum - only put functions in here when they are actually being used!*/

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
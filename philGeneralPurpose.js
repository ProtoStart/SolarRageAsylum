/* This is a JavaScript file, with a bunch of potentially useful functions copied by u/PGDesign / Phil Ganney from working code of his own. Copy code from here to dedicated files written specifically for the project. Eventually I want to turn this into a library!

*/

//Global Variables (keeping to a minimum)
var data = {
	"Categories": {}
	};

function startUp(){
	//Typically call this function in the body onload attribute, so the basic html we start off with is there, and this can load in anything needed.
	//for my general use file, this is left with just commented out code for setting up a modal
	
   /* //MODAL - (Adapted w3schools code originally)

	// Get the modal
	var modal = document.getElementById("myModal");

	// Get the button that opens the modal
	var infoButton = document.getElementById("infoButton");

	// Get the <span> element that closes the modal
	var span = document.getElementsByClassName("close")[0];
	
	// Get the iFrame that I'm using as an easy way to have a reusable modal
	var modalIFrame = document.getElementById("myModalIFrame");

	// When the user clicks the button, open the modal 
	infoButton.onclick = function() {
		//modal.innerHTML = "<div>content from info.html</div>"; //This would be my preference rather than using a iFrame but I can't figure it out at time of writing
		modalIFrame.src = "info.html";
		modal.style.display = "block";
	}

	// When the user clicks on <span> (x), close the modal
	span.onclick = function() {
	  modal.style.display = "none";
	}

	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	  if (event.target == modal) {
		modal.style.display = "none";
	  }
	}
	*/
}

/* Get all the categories in an array from a dataset that is at the top of the page I keep thinking there must be a simpler way to do this, but haven't found anything*/
function getCategories(){
	var categoryArray = [];
	for (var category in data.Categories){	
		categoryArray.push(category);
	}
	return categoryArray;
}

//chosenCategory will be a string
function getCategory(chosenCategory){ 
//Get the array in the "mainSelects" property of the given category
	var outerArray = [];
	var newInnerArray = [];
	
	var unEscapedCategory = unescape(chosenCategory);
	
	for (var subset in data.Categories[unEscapedCategory].mainSelects){
	    newInnerArray = [];
	    for(var item in data.Categories[unEscapedCategory].mainSelects[subset]){//Not the best var naming but hey ho
	        newInnerArray.push(data.Categories[unEscapedCategory].mainSelects[subset][item]);
	    }
	    outerArray.push(newInnerArray);
	}
	return outerArray;
}

/*ACCORDION - a UI component with lots of text buttons in a vertical stack, tapping a button makes a div appear directly below it or dissapear if it's already there - great for lengthy info sections on mobile

(pasted in from w3schools, I've tested it and read through, I understand it and can't see any improvements I could make - I'd have probably written this using a named function, that I'd state in the html in onclick attributes but this seems easier to reuse, since it's more componentised.) */
function accordionSetup(){
	
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
	  acc[i].addEventListener("click", function() {
		/* Toggle between adding and removing the "active" class,
		to highlight the button that controls the panel */
		this.classList.toggle("active");

		/* Toggle between hiding and showing the active panel */
		var panel = this.nextElementSibling;
		if (panel.style.display === "block") {
		  panel.style.display = "none";
		} else {
		  panel.style.display = "block";
		}
	  });
	}
}

/*Creates a <select> tag (dropdowns) with an option for each item in an array given in the items param. The select tag will be given the id given in selectId, will be placed within the tag given by id in containerId, and will be given class given in selectClass. 

Requires: function addToSelect(items, selectId */
function createSelect(items, selectId, containerId, selectClass){
	//items should = [] if it's to be an empty select
	var containerElement = document.getElementById(containerId);
	containerElement.innerHTML += "<select id=\"" + selectId + "\" class=\"" + selectClass + "\">  </select>";
	
	if(items != []){
		addToSelect(items, selectId);
	}
}

//Adds an <option> tag for each item in the array parameter called items, to a select named in the selectId param. Both the visible text and value for each <option> will be created based on the same item in the array.
function addToSelect(items, selectId){
//<option value="item">item</option>
    var selectElement = document.getElementById(selectId);
    var indexes;
    for (indexes in items){
        selectElement.innerHTML += "<option value=\"" + items[indexes] + "\">" + items[indexes] + "</option>" ;
    }
}

/* Completely empties a <select> tag of all contents - used for emptying them so that they can be refilled 
*/
function emptySelect(selectId){
	//alert(selectId);
	document.getElementById(selectId).innerHTML = "";
}

function addButtons(clickEventName, buttonClass, buttonTextArray, idSuffix, containerDiv){
    /* To make:
		<button onclick="presetAddDrink('Hot Chocolate')">Hot Chocolate</button>
		inside an element called "categoriesContainer"
	   Pass in:
		("presetAddDrink", ["Hot Chocolate"],document.getElementById("categoriesContainer"))  
	*/  

    var indexes;
    for (indexes in buttonTextArray){
        containerDiv.innerHTML += "<button id=\"" + escape(buttonTextArray[indexes]) + idSuffix +"\" class=\"" + buttonClass + "\" onclick=\"" + clickEventName+ "('" + escape(buttonTextArray[indexes]) + idSuffix + "')\">" + buttonTextArray[indexes] + "</button>"
    }

}

//increase the value in innerHTML of a given element by id by the value in change
//lower limit of 1 hardcoded here intentionally by only setting the change if the attemptAmount is above 0 - there may be code that could be simplified here
//I've not set any upper limit, so presumably max is javascripts limits -I've tested manual tapping at least up to 350 and by changing start value to 999999 and tapping to 1000000. Thoroughly beyond requirements.
function changeAmount(id,change) {
  var attemptVal = (parseInt(document.getElementById(id).innerHTML)) + change;
  if (attemptVal > 0) {
    document.getElementById(id).innerHTML = attemptVal.toString();
    //also change the total amount
    var newTotal = (parseInt(document.getElementById("totalQuantity").innerHTML)) + change;
    document.getElementById("totalQuantity").innerHTML  = newTotal.toString();
  }
  if (attemptVal == 0){ 
		//Remove Item function needs the div ID for the item. div ID is based on whats displayed in the text, which is the same as the ID we pass in to this function but without the word "Amount" at the end
		var removeThing = id.slice(0, (id.length - 6));//find length of string, then take the part of the string from 0 to (length of string - the word we're ignoring)
		//https://www.w3schools.com/js/js_string_methods.asp
		removeItem(removeThing);
  }	  
}

function removeItem(itemID){
	if(confirm("Remove this item?")){
		//get the amount of items being removed, so that we can subtract this from the total
		var amountRemoved = parseInt(document.getElementById(itemID+"Amount").innerHTML);
		//Calculate the new total
		var newTotal = (parseInt(document.getElementById("totalQuantity").innerHTML)) - amountRemoved;
		//update the new total
		document.getElementById("totalQuantity").innerHTML  = newTotal.toString();
		//Remove the entire div for the list item - div ID is passed in
		//Div will be the only div of that ID within the div "list" 
		document.getElementById("list").removeChild(document.getElementById(itemID));	
	}
}
	
function categoryChange(categoryID){
	//UI function - user taps a category button, this handles the top level perspective of what happens then
	//Find all the tablinks (the buttons that have the category names on them)
	tablinks = document.getElementsByClassName("tablinks");
	//Remove the style class that gives an appearance of being selected, from all of the tablinks since we don't know which one it was on before
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" Selected", "");
	}
	//Empty the tab content area
	emptyTab();
	//Apply the style class that gives appearance of being selected to the one the user selected
	document.getElementById(categoryID).classList.add('Selected');
	
	/* The code for loading the tab content needs the category, not the categoryID, so we derive the category from the categoryID first - Need to take off the word "category" (last eight characters) of the categoryID to get the category
	Code snippet from where I've used slice before: var drink = id.slice(0, (id.length - 6));//find length of string, then take the part of the string from 0 to (length of string - the word we're ignoring)
		//https://www.w3schools.com/js/js_string_methods.asp*/
	
	var category = categoryID.slice(0,(categoryID.length - 8));//Take from character 0 to the one before the suffix "category" would start
	//Load the tab content for the category
	loadTab(category);
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

/*by class we mean css class
Use in conjuction with css class called "Selected" that marks things for users as a currently selected thing
Typically also need  to deselect all items
*/
function selectViaClass(id){
	document.getElementById(id).classList.add("Selected");
	//document.getElementById(id).disabled = true;  //not disabling - I don't like hw it effects visuals, and isn't worth coding a fix to have that
}

/*  */
function deselectXClassViaClass(x){
	var xElements = document.getElementsByClassName(x);
	
	var i;
	for (i = 0; i < xElements.length; i++) {
		//document.getElementById(xElements[i].id).disabled = false;
		document.getElementById(xElements[i].id).classList.remove("Selected");
	}
}

function hideXShowY(x,y){
	//General purpose function, multiple potential uses
	//y must be previously only hidden via our class "hidden" rather than some other way, for this function to work
	//for content area expansion buttons that dissappear once clicked - button would be x, a previously hidden element would be y
	//for a carousel y is the content coming into view on the carousel, x is the content going out
	showViaClass(y);
	hideViaClass(x);
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
function showAllXClass(x){
	//as it says on the tin - shows all elements with the class given in x
	var xElements = document.getElementsByClassName(x);
	
	var i;
	for (i = 0; i < xElements.length; i++) {
		showViaClass(xElements[i].id);
	}
}

function hardcodedHTMLDivTabs(tabDivClass, tabButtonClass, showDivId, selectedButtonId){
	hideAllXClassShowY(tabDivClass,showDivId);
	//we deselect all the buttons, and then select the one that was clicked afterwards
	//(saves this function having to know what was just clicked and what was previously selected)
	deselectXClassViaClass(tabButtonClass);
	selectViaClass(selectedButtonId);
}

function emptyTab(){
	//Basically just empty the div tabSelects. In future we might have to do more.
	document.getElementById("tabSelects").innerHTML = "";
}

/* Inserting user content into a list including some basic sanitizing
I've generalized this function from my TeaRounder project (where it was newDrink*/
function newThing(attemptThing, startAmount) { 
  
  //remove < and > symbols needed for html tags via a regex
  //I tried various other regexs to remove entire tags but they would take out too much or not always take out multiple tags - at this point in time it's more acceptable to keep the i from <i> showing, than to spend hours being a perfectionist over this rather inconsequential issue 
  //Regex key: / = pattern starts or ends, [] = any symbol inside, g = every case of this pattern 
  attemptThing = attemptThing.replace(/[<>]/g,"");
  
  //prevent adding empty lines
  if (attemptThing == ""){
      return;
  }
  //attemptThingID is used for element Id's on the HTML we're about to generate for other functions to use, attemptThing stays as what will be displayed to the user
  var attemptThingID = escape(attemptThing);

  //I initially thought this line might mean that drinks with spaces in them wouldn't work but they do
  //will still need some sanitizing
  var attemptThingAmountID = attemptThingID + "Amount";

  //avoid exact duplicates (to prevent odd looking behaviour that might occur after a user causes that to happen), if the drinks div has an element with the attemptThingID inside, then add 1 to the amount rather than carry on with the rest of this function
  if(document.getElementById("list").contains(document.getElementById(attemptThingID))){
      changeAmount(attemptThingAmountID,1);
      return;
  }

  //newHTML exists to allow us to write the entire div to the innerHTML in one go, whilst allowing this code to be in the easiest to read form I can think of. It's important that this code is easy to read for me making changes and to make it easy to check there are no bugs or locate them if needed
  var newHTML = "";
  newHTML += ("<div id=\"" + attemptThingID + "\" class=\"ThingLine\">");
	newHTML += ("<div class=\"ThingName\">" + attemptThing + "</div>");
	newHTML += ("<div class=\"ThingLineControls\">");
		newHTML += ("<div class=\"BtnLess\"> <button onclick=\"changeAmount('" + attemptThingAmountID + "',-1)\">-</button></div>");
		newHTML += ("<span id=\"" + attemptThingAmountID + "\" class=\"Amount\">" + startAmount + "</span>");
		newHTML += ("<button class=\"BtnMore\" onclick=\"changeAmount('" + attemptThingAmountID + "',1)\">+</button>");
		newHTML += ("£x.yz");
	newHTML += ("</div>");
  newHTML += ("</div>");

  //add to the total as well
  var newTotal = (parseInt(document.getElementById("totalQuantity").innerHTML)) + startAmount;
  document.getElementById("totalQuantity").innerHTML  = newTotal.toString();

  //Actually write newHTMl inside an already existing element
  document.getElementById("things").innerHTML += newHTML;
  //this ensure that the element "resetThings" isn't disabled (which it would be if there was nothing in the list
  document.getElementById("resetThings").disabled = ""; 
}

function resetList(){
    if(confirm("are you sure? This empties the entire list")){
        document.getElementById("list").innerHTML = "";
        document.getElementById("resetList").disabled = "disabled";
		document.getElementById("totalQuantity").innerHTML  = 0;
    }
}

function viewCell(cellID){
	//alert("we're still building this tool");
	hideAllXClassShowY("rightPanelView", "cellView");
}

/** Our good old trusty show and hide functions that we use everywhere!!

by "via class" we mean by swapping css classes that handle showing or hiding things
Use in conjuction with hideViaClass(id) and css classes called "hidden" and "showing" that have css to hide/show things
**/
function showViaClass(id){
  document.getElementById(id).classList.remove("hidden");
  document.getElementById(id).classList.add("showing");
}

function hideViaClass(id){
	document.getElementById(id).classList.remove("showing");
	document.getElementById(id).classList.add("hidden");
}

/*Our slightly less often used hide everything of a certain class, show this one specified thing, function*/
function hideAllXClassShowY(x,y){
	//as it says on the tin - Hides all elements with the class given in x, and Shows the element with Id given in y
	var xElements = document.getElementsByClassName(x);
	
	var i;
	for (i = 0; i < xElements.length; i++) {
		hideViaClass(xElements[i].id);
	}
	
	showViaClass(y);
}


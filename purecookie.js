// --- Config --- //
var purecookieTitle = "2 cookies"; // Title
var purecookieDesc = "By using this site you accept that we use:<br/>1 session cookie,<br/>1 cookie that tells this box: 'we don't need to ask about cookies again'<br/>"; // Description
var purecookieLink = '<a href="cookiePolicy.html" target="_blank">Full Policy here</a>'; // Cookiepolicy link
var purecookieButton = "Understood"; // Button text
// ---        --- //


function pureFadeIn(elem, display){
//a function for visually "fading in" a given element
  var el = document.getElementById(elem);
  el.style.opacity = 0;
  el.style.display = display || "block";

  (function fade() {
    var val = parseFloat(el.style.opacity);
    if (!((val += .02) > 1)) {
      el.style.opacity = val;
      requestAnimationFrame(fade);
    }
  })();
};
function pureFadeOut(elem){
//a function for visually "fading out" a given element
  var el = document.getElementById(elem);
  el.style.opacity = 1;

  (function fade() {
    if ((el.style.opacity -= .02) < 0) {
      el.style.display = "none";
    } else {
      requestAnimationFrame(fade);
    }
  })();
};

function setCookie(name,value,days) {
//Function name is self explanatory (use it to set a cookie).
/* Params:
		name & value: cookies are set in name:value pairs
		days: number of days from now to set the expiry date or put false if no expiry date
*/
    var expires = "";
    if (days) {
		//Creating a string for an expiry date
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
	//Actually set the cookie
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
//Literally a function that tries to get a given cookie - returns null if it doesn't find one
    var nameEQ = name + "="; //just stores the given name with an equals sign tacked on the end
    //get the list of cookies and convert from being separated by ; symbols to an array.
	var ca = document.cookie.split(';'); //CA presumably short for "cookie array". 
    //loop through ca using a counting variable called i - will start at 0 and go up 1 for each index of the array
	for(var i=0;i < ca.length;i++) {
		//get the next cookie from the array. (note for people not familiar with arrays: arrays store many values together in basically a numbered list, but for efficiency purposes the list starts from 0. ca[0] would get the first value in the ca array, ca[1] would get the second, ca[2] would get the third) 
        var c = ca[i]; //c presumably short for "cookie"
		// remove any spaces at the start of the cookie string, since they can be ignored.  (uses a while loop that is flattened to one line, to continuously chop off the first character in the var c until it isn't a space) 
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
		/* This next bit initially may seem like a crazy way of doing it, 
				it's the line that checks if c has the cookie, and if found comes out of the function with it. 
				but it needs to be careful of a potential situation where you're looking for a cookie with a name that fits into the end of another cookie name 
				(like if you where looking for "house", and there could be a value "boathouse" which you wouldn't want to get accidently)
			
			Breaking down the code:
				if () return ...;
					We have a single line if statement - if what is in brackets evaluates as true we do the rest of the line, if not skip on
				(c.indexOf(nameEQ) == 0)
					This will only be true if c has an exact match with no other characters before or after the name other than = and the value
					evaluates to true if c.indexOf(nameEQ) matches 0
						indexOf trys to find a parameter within the variable its run on, and if succesful comes back with the "index" it was found at (0 would be the first character) 
						- so c.indexOf(nameEQ) will only be 0 if nameEQ is found at the start of c - no other characters before it and we've already cut out any spaces
						c should represent a "key value pair" in this format name=value
						so that will mean that this is a complete exact match with what was searched for
				return c.substring(nameEQ.length,c.length)
					come out of the function returning just the "value" part of the key value pair held in the variable c
		*/
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
	/*	Only gets here if the bit return c.substring etc is never called
		So basically if it doesn't find it
	*/
    return null;
}
function eraseCookie(name) {  
//function for erasing a given cookie by setting the Max-Age value so low that the browser will remove it for being out of date
    document.cookie = name+'=; Max-Age=-99999999;';  
}

function cookieConsent() {
//This is where it checks for the cookie and puts the cookie popup if not there
  if (!getCookie('purecookieDismiss')) {
    document.body.innerHTML += '<div class="cookieConsentContainer" id="cookieConsentContainer"><div class="cookieTitle"><a>' + purecookieTitle + '</a></div><div class="cookieDesc"><p>' + purecookieDesc + ' ' + purecookieLink + '</p></div><div class="cookieButton"><a onClick="purecookieDismiss();">' + purecookieButton + '</a></div></div>';
	pureFadeIn("cookieConsentContainer");
  }
}

function purecookieDismiss() {
//a function for the dismiss button that purecookie adds - uses other functions to set the cookie and make the container fade out
  setCookie('purecookieDismiss','1',7);
  pureFadeOut("cookieConsentContainer");
}

//The all important line of code that makes sure that any of this actually gets run!
window.onload = function() { cookieConsent(); };
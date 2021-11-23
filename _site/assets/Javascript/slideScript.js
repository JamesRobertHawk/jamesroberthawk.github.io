//Automatic Slideshow - change image every 3 seconds

var myIndex = 0;
carousel();

function carousel() {
	var i;
	var x = document.getElementsByClassName("mySlides");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	myIndex++;
	if (myIndex > x.length) {myIndex = 1}
	x[myIndex-1].style.display = "block";
	

	
	setTimeout(carousel,4000);
}

function onSlide4Click(){
	window.location.href = "about.html";
}

function onSlide1Click(){
	window.location.href = "planeCrazy.html";
}

function onSlide2Click(){
	window.location.href = "theIndieGameEngine.html";
}

function onSlide3Click(){
	window.location.href = "slideToSurvive.html";
}

function onSlide5Click(){
	window.location.href = "artAssets.html";
}
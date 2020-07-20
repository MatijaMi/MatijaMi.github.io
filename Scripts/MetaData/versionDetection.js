function detectColorDataVersion(cameraModel){
	console.log(cameraModel);
	let requestURL= "https://github.com/MatijaMi/MatijaMi.github.io/Data/colorDataVersion.js"
	let request = new XMLHttpRequest();
	request.open('GET', requestURL);
	request.responseType = 'json';
	request.send();
	request.onload = function() {
		let cdv = request.response;
		console.log(cdv);
	}
	
}
//Reads the file uploaded by the user
function readFile(file) {
		//Get the input files
		var reader = new FileReader();
		//Once the .cr2 file has been read it gets saved as a byte array(==Uint8Array)
		reader.onload = function(){
			window.bytes = new Uint8Array(reader.result);
			//The meta data from the file gets read and the relevant parts get displayed in the website
			window.metaData=collectMetaData();
			initialiseSiteUI();
		};	
	  	reader.readAsArrayBuffer(file);
};
//Reads the file uploaded by the user
function readFile(file) {
		//Get the input files
		var reader = new FileReader();
		//Once the .cr2 file has been read it gets saved as a byte array(==Uint8Array)
		reader.onload = function(){
			bytes = new Uint8Array(reader.result);
			if(checkIfCR2(bytes.slice(0,12))){
				//The meta data from the file gets read and the relevant parts get displayed in the website
				metaData=collectMetaData();
				initialiseSiteUI();
			}else{
				bytes=[];
				alert("Please upload a .CR2 file");
				}
		};	
	  	reader.readAsArrayBuffer(file);
};

/*	Checks if the file is actually a .CR2 file by
	analyzing where the header of a CR2 file should be	*/
function checkIfCR2(header){
	var headerFormat =[73,73,42,0,16,0,0,0,67,82,2,0];
	
	for(let i =0; i<header.length;i++){
		if(header[i]!=headerFormat[i]){
			return false;
		}
	}
	return true;
}
/*	
	Function to download the decompressed and processed image, either already in RGB 
	Or as one of the CR2 formats (RGGB, YCbCr, YYYYCbCr)
*/
function downloadProcessedImage(type){
	var name =fileList[0].name + type+ ".txt";
	saveByteArray(downloadBytes,name);
	
}
//Function to download the jpeg saved in the first image file directory of the CR2 file
function downloadJpeg(){
	var name =fileList[0].name +".jpg";
	var blob = new Blob([jpeqBytes], {type: "octet/stream"});
	saveByteArray(blob, name);
}

//Function to download meta data in a readable format
function downloadMetaData(){
	var name =fileList[0].name +"MetaData.txt";
	var output="";
	for(let[key,value] of metaData){
		if(value instanceof Map){
			var map ="";
			for(let[key,invalue] of value){
				map = map+"("+key+":"+invalue+")";
			}
			output= output+"["+key+":"+map+"]\n";
		}else{
			if(typeof value=="string"){
				output= output+"["+key+":"+value.replace(/\0/g, '')+"]\n";
			}else{
				output= output+"["+key+":"+value+"]\n";
			}
		}
	}
	var blob = new Blob([output], {type: "text/plain"});
	saveByteArray(blob, name);
}

//Functions that actually saves the bytes and creates the download
function saveByteArray(data,name){
	var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);	
}

/*	
	Function to download the decompressed and processed image, either already in RGB 
	Or as one of the CR2 formats (RGGB, YCbCr, YYYYCbCr)	*/
function downloadProcessedImage(type){
	let name = fileName+type+ ".json";
	saveByteArray(downloadBytes,name);
	downloadBytes=[];
}
//Function to download the jpeg saved in the first image file directory of the CR2 file
function downloadJpeg(){
	let name =fileName +".jpg";
	/*var newImg=[];
	newImg.push("[");
	for(var i =0; i <jpeqBytes.length;i+=2){
		newImg.push(transformTwoBytes(jpeqBytes[i],jpeqBytes[i+1]));
	}
	newImg.push("]");
	jpeqBytes=newImg;*/
	let blob = new Blob([jpeqBytes], {type: "octet/stream"});
	saveByteArray(blob, name);
}

//Function to download meta data in a readable format
function downloadMetaData(){
	let name = fileName +"MetaData.txt";
	let output="";
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
	let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = name;
    a.click();
	a.href=null;
    window.URL.revokeObjectURL(url);
}

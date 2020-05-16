function startScan(file) {
		//Get the input files
		
			
		var reader = new FileReader();
		//Once the .cr2 file has been read it gets saved as a byte array(==Uint8Array)
		reader.onload = function(){
      		var arrayBuffer = reader.result;
			var bits = [];
			window.bytes = new Uint8Array(arrayBuffer);
			
			var metaData =collectMetaData();
			var sof3=metaData.get("SOF3");
			var output =[];
			output.push("<p>");
			output.push("<b>Camera Model: </b>" + metaData.get("modelName"));
			output.push("<p>");
			output.push("<b>Length of Raw: </b>" + metaData.get("RawLength") +" Bytes");
			output.push("<p>");
			output.push("<b>Slices:</b> " + metaData.get("Slices"));
			output.push("<p>");
			output.push("<b>Sample Precision: </b>" + sof3.get("SamplePrecision"));
			output.push("<p>");
			output.push("<b>Image Components: </b>" + sof3.get("ImageComponents"));
			output.push("<p>");
			output.push("<b>Number of Lines: </b>" + sof3.get("NumberOfLines"));
			output.push("<p>");
			output.push("<b>Samples per Line: </b>" + sof3.get("SamplesPerLine"));
			output.push("<p>");
			output.push("<b>Horizontal Sampling Factor: </b>" + sof3.get("HSF"));
			output.push("<p>");
			output.push("<b>Vertical Sampling Factor: </b>" + sof3.get("VSF"));
			output.push("<p>");
			var image0Offset = findIFDTagValue(16,17,1,false,false);
			var image0Length = findIFDTagValue(16,23,1,false,false);
			
			var imageWidth = findIFDTagValue(16,0,1,false,false);
			var imageHeight = findIFDTagValue(16,1,1,false,false);
			var data=bytes.slice(image0Offset,image0Offset+image0Length);
			var model = new String(metaData.get("modelName"));
			
			if(model.includes("EOS-1Ds Mark II")&& !model.includes("EOS-1Ds Mark III")){
			   setImage(data,imageWidth,imageHeight/5);
			   }else{
				   setImage(data,imageWidth,imageHeight);
			   }
			
			if(sof3.get("HSF")==1){
				document.getElementById("downloadR").style="display:block";
				 document.getElementById("downloadY").style="display:none";
				 document.getElementById("downloadYY").style="display:none";
			}else{
				if(sof3.get("VSF")==1){
				   	document.getElementById("downloadR").style="display:none";
				 	document.getElementById("downloadY").style="display:block";
				 	document.getElementById("downloadYY").style="display:none";
				   }else{
				   	document.getElementById("downloadR").style="display:none";
				 	document.getElementById("downloadY").style="display:none";
					document.getElementById("downloadYY").style="display:block";
				   }
			}
			
			document.getElementById("left").style="display:block";
			document.getElementById("right").style="display:block";
			document.getElementById("info").style="text-align:left";
			document.getElementById("info").innerHTML= '<ul>' + output.join('') + '</ul>';
			
		};
			
	  	reader.readAsArrayBuffer(file);
};

//Function that gets called when the file is submitted
//Function to collect data from IFD#0,IFD#3, EXIF and MakerNote-SubIFD
function collectMetaData(){
	//Variables for working with IFDZero
	var metaData = new Map();
	//The offset to IFD#0 is always 16
	const ifdZeroOffset = 16;
	const modelName = findIFDTagValue(ifdZeroOffset, 16,1,true,true);
	const makerName = findIFDTagValue(ifdZeroOffset,15,1,true,true);
	//Code for finding the EXIF Sub-IFD
	const exifOffset = findIFDTagValue(ifdZeroOffset,105,135,false,false);
	const makerNoteOffset = findIFDTagValue(exifOffset,124,146,false,false);
	const makerNoteLength = transformTwoBytes(bytes[makerNoteOffset],bytes[makerNoteOffset+1]);
	
	//TODO IMPLEMENT METHODS FOR MAKERNOTE VALUES(TO BE SEEN)
	//MakerNotes code
	const imageType = findIFDTagValue(makerNoteOffset,16,0,false,false);
	//IFD3 Code
	const ifdThreeOffset = transformFourBytes.apply(null,bytes.slice(12,16));
	const ifdThreeLength = transformTwoBytes(bytes[ifdThreeOffset],bytes[ifdThreeOffset+1]);
	const rawOffset = findIFDTagValue(ifdThreeOffset,17,1,false,false);
	const rawLength = findIFDTagValue(ifdThreeOffset,23,1,false,false);
	//TO BE SEEN
	//var colorBalanceOffset = findIFDTagValue(makerNoteOffset,1,64,false,false);
	
	var slices = findIFDTagValue(ifdThreeOffset,64,198,true,false);
	var width = slices[0]*slices[1]+slices[2];
	
	var hts = getDecodedHTs(rawOffset, bytes[rawOffset+4]*256 + bytes[rawOffset+5]);
	var sof3Offset = rawOffset+getDHTLength(rawOffset) + 4;
	var sof3Data = getSOF3Data(sof3Offset);
	var sof3Length = getSOF3Length(sof3Offset);
	
	
	var sosOffset = sof3Offset +sof3Length+2;
	var sosData = getSOSData(sosOffset);
	
	metaData.set("MakerName", makerName);
	metaData.set("modelName", modelName);
	metaData.set("ImageType", imageType);
	metaData.set("IFD3Offset", ifdThreeOffset);
	metaData.set("RawLength", rawLength);
	metaData.set("Slices", slices);
	metaData.set("HT1", hts[0]);
	metaData.set("HT2", hts[1]);
	metaData.set("SOF3", sof3Data);
	metaData.set("SOS", sosData);
	
	var sosLength = getSOSLength(sosOffset);
	var imageDataOffset = sosOffset+sosLength+2;
	
	//bytes=bytes.slice(imageDataOffset);
	return metaData;
}


function getBits(){
	window.bits =[];
	for(var i =0; i <bytes.length;i++){
		var byte = byteToString(bytes[i]);
		if(bytes[i]==255){
			i++;
		}
		bits.push(byte);
	}
}	

		
function decompressRaw(metaData){
	
	var result = decompress(metaData);
	bytes=result;
	//bytes= JSON.stringify(bytes);
	
} 


function saveByteArray(data,name){
	var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var blob = new Blob(data, {type: "octet/stream"}),
    url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
	
}

function setImage(data, x,y){
	var blob = new Blob([data], {type: 'image/jpeg'});
	// Use createObjectURL to make a URL for the blob
	var image = new Image();
	image.src = URL.createObjectURL(blob);
	console.log(x);
	console.log(y);
	image.width=300;
	image.height=300*(y/x);
	document.getElementById("image").innerHTML="";
	document.getElementById("image").appendChild(image);
}



//Function to collect data from IFD#0,IFD#3, EXIF and MakerNote-SubIFD
function collectMetaData(){
	var metaData = new Map();
	
	//The offset to IFD#0 is always 16 Bytes
	const ifdZeroOffset = 16;
	metaData.set("ModelName", findIFDTagValue(ifdZeroOffset, 16,1,true,true));
	metaData.set("MakerName", findIFDTagValue(ifdZeroOffset,15,1,true,true));
	
	var image0Offset = findIFDTagValue(ifdZeroOffset,17,1,false,false);
	var image0Length = findIFDTagValue(ifdZeroOffset,23,1,false,false);
	
	window.jpeqBytes=bytes.slice(image0Offset,image0Offset+image0Length);
	 
	//Code for finding the EXIF Sub-IFD data
	
	var exifOffset = findIFDTagValue(ifdZeroOffset,105,135,false,false);
	metaData.set("ExposureTime", findIFDTagValue(exifOffset,154,130,false,false));
	metaData.set("fNumber", findIFDTagValue(exifOffset,157,130,false,false));
	
	//MakerNotes code
	var makerNoteOffset = findIFDTagValue(exifOffset,124,146,false,false);
	metaData.set("WhiteBalance", getWhiteBalance(makerNoteOffset,metaData.get("ModelName")));
	metaData.set("colorSpace", findIFDTagValue(makerNoteOffset,180,0,false,false));//sRGB=1 AdobeRGB=2
	metaData.set("SensorInfo", getSensorInfo(makerNoteOffset));
	
	//IFD3 Code
	
	
	var ifdThreeOffset = transformFourBytes.apply(null,bytes.slice(12,16));
	metaData.set("IFD3Offset", ifdThreeOffset);
	
	var rawOffset = findIFDTagValue(ifdThreeOffset,17,1,false,false);
	var rawLength = findIFDTagValue(ifdThreeOffset,23,1,false,false);
	metaData.set("RawLength", rawLength);
	
	metaData.set("Slices", findIFDTagValue(ifdThreeOffset,64,198,true,false));
	
	var hts = getDecodedHTs(rawOffset, bytes[rawOffset+4]*256 + bytes[rawOffset+5]);
	metaData.set("HT1", hts[0]);
	metaData.set("HT2", hts[1]);
	
	var sof3Offset = rawOffset+getDHTLength(rawOffset) + 4;
	metaData.set("SOF3", getSOF3Data(sof3Offset));
	
	var sosOffset = sof3Offset +getSOF3Length(sof3Offset)+2;

	metaData.set("SOS", getSOSData(sosOffset));
	metaData.set("RawBitOffset", sosOffset+getSOSLength(sosOffset)+2);
		
	//Removing the bytes of the file that are not part of the pure raw bytes
	bytes=bytes.slice(metaData.get("RawBitOffset"));
	
	return metaData;
}

function showFile(){
		var sof3=metaData.get("SOF3");
		var output =[];
		output.push("<p>");
		output.push("<b>Camera Model: </b>" + metaData.get("ModelName"));
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
		
		var model = new String(metaData.get("modelName"));
		
		if(model.includes("EOS-1Ds Mark II")&& !model.includes("EOS-1Ds Mark III")){
			setImage(jpeqBytes,imageWidth,imageHeight/5);
		}else{
			setImage(jpeqBytes,imageWidth,imageHeight);
		}
		
		if(sof3.get("HSF")==1){
			document.getElementById("decodeR").style="display:";
			document.getElementById("decodeY").style="display:none";
			document.getElementById("decodeYY").style="display:none";
		}else{
			if(sof3.get("VSF")==1){
				document.getElementById("decodeR").style="display:none";
				document.getElementById("decodeY").style="display:";
				document.getElementById("decodeYY").style="display:none";
			}else{
				document.getElementById("decodeR").style="display:none";
				document.getElementById("decodeY").style="display:none";
				document.getElementById("decodeYY").style="display:";
			}
			}
		document.getElementById("loading").style="display:none"
		document.getElementById("dycc").style="display:none";
		document.getElementById("dyycc").style="display:none";
		document.getElementById("drggb").style="display:none";
		document.getElementById("drgb").style="display:none";
			
		document.getElementById("label").innerHTML="Upload a different file";
		document.getElementById("left").style="display:block";
		document.getElementById("right").style="display:block";
		document.getElementById("info").style="text-align:left";
		document.getElementById("info").innerHTML= '<ul>' + output.join('') + '</ul>';
		window.downloadBytes=[];
}


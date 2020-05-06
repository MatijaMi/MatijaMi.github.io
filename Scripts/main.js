var data = []; 
//Function that gets called when the file is submitted
function startScan() {

    var files = document.getElementById('fileInput').files;
    
	if (!files.length) {
      alert('Please select a file!');
      return;
    }
	
    	var file = files[0];
		var reader = new FileReader();
		//Once the .cr2 file has been read it gets saved as a byte array(==Uint8Array)
	reader.onload = function(){
      	var arrayBuffer = reader.result;
		var bits = [];
		window.bytes = new Uint8Array(arrayBuffer);
		//the metaData that might need to be collected
		collectMetaData();
    };
	
	  reader.readAsArrayBuffer(file);
  };

//Function to collect data from IFD#0,IFD#3, EXIF and MakerNote-SubIFD
function collectMetaData(){
	//Variables for working with IFDZero
	var metaData = new Map();
	var output=[];
	//The offset to IFD#0 is always 16
	const ifdZeroOffset = 16;
	//---------------------TEST WILL BE DELETED--------------------/////
	
	
	var image0Offset = findIFDTagValue(ifdZeroOffset,17,1,false,false);
	var image0Length = findIFDTagValue(ifdZeroOffset,23,1,false,false);
	//--------------------------------------------------------////
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
	
	//bytes=bytes.slice(image0Offset,image0Offset+image0Length);
	
	var sosLength = getSOSLength(sosOffset);
	var imageDataOffset = sosOffset+sosLength+2;
	
	bytes=bytes.slice(imageDataOffset);
	var result = decompress(metaData);
	
	
	for(let[key, value] of metaData){
		output.push(key+ ":"+value);
	}
	output.push("<p>");
	for(let[key, value] of sof3Data){
		output.push(key+ ":"+value);
	}
	output.push("<p>");
	output.push(result);
	output.push("<p>");
	
	var debytes =printBytesFromOffset(0,20);
	for(var i =0; i < debytes.length;i++){
		
		output.push(byteToString(debytes[i]));
		output.push("<p>");
	}
	/*
	
	output.push('<p>');
	var sof3 = getSOF3Data(sof3Offset);
	for(let[key,value] of sof3){
		output.push(key +"---" + value);
	}
	output.push('<p>');
	
	for(let[key,value] of sosData){
		output.push(key +"---" + value);
	}
	
	output.push("<p>")
	output.push("Start");
	var rawBits = rawToBits(imageDataOffset);
	output.push("End");
	*/
	document.getElementById("ifd0").innerHTML= '<ul>' + output.join('') + '</ul>';	
	
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



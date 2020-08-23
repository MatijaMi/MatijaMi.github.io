//Function to collect data from IFD#0,IFD#3, EXIF and MakerNote-SubIFD
function collectMetaData(){
	var metaData = new Map();
	//The offset to IFD#0 is always 16 Bytes
	const ifdZeroOffset = 16;
	metaData.set("ModelName", findIFDTagValue(ifdZeroOffset, 16,1,true,true));
	metaData.set("ColorDataVersion", detectColorDataVersion(metaData.get("ModelName")));
	
	const image0Offset = findIFDTagValue(ifdZeroOffset,17,1,false,false);
	const image0Length = findIFDTagValue(ifdZeroOffset,23,1,false,false);
	jpeqBytes=bytes.slice(image0Offset,image0Offset+image0Length);
	metaData.set("DateTime",findIFDTagValue(ifdZeroOffset,50,1,true,true));
	metaData.set("DPI", findIFDTagValue(ifdZeroOffset,26,1,true,false));
	
	//Code for finding the EXIF Sub-IFD data
	const exifOffset = findIFDTagValue(ifdZeroOffset,105,135,false,false);
	metaData.set("ExposureTime", findIFDTagValue(exifOffset,154,130,false,false));
	metaData.set("fNumber", findIFDTagValue(exifOffset,157,130,false,false));
	/*var if0len = bytes[ifdZeroOffset];
	var fb=bytes[ifdZeroOffset+2+12*(if0len)];
	var sb=bytes[ifdZeroOffset+2+12*(if0len)+1];
	var tb=bytes[ifdZeroOffset+2+12*(if0len)+2];
	var fob=bytes[ifdZeroOffset+2+12*(if0len)+3];
	var ifd0neOffset = transformFourBytes(fb,sb,tb,fob);
	var thumbOffset=findIFDTagValue(ifd0neOffset,1,2,false,false);
	var thumbLen=findIFDTagValue(ifd0neOffset,2,2,false,false);
	//jpeqBytes=bytes.slice(thumbOffset,thumbOffset+thumbLen);
	var ifdTwoOffset = transformFourBytes(bytes[ifd0neOffset+2+12*2],bytes[ifd0neOffset+2+12*2+1],bytes[ifd0neOffset+2+12*2+2],bytes[ifd0neOffset+2+12*2+3]);
	var tiffWidth = findIFDTagValue(ifdTwoOffset,0,1,false,false);
	var tiffHeight = findIFDTagValue(ifdTwoOffset,1,1,false,false);
	console.log(tiffWidth,tiffHeight);
	var tiffOffset = findIFDTagValue(ifdTwoOffset,17,1,false,false);
	var tiffLen = findIFDTagValue(ifdTwoOffset,23,1,false,false);
	jpeqBytes=bytes.slice(tiffOffset,tiffOffset+tiffLen);*/
	//IFD3 Code
	const ifdThreeOffset = transformFourBytes.apply(null,bytes.slice(12,16));
	metaData.set("IFD3Offset", ifdThreeOffset);
	
	const rawOffset = findIFDTagValue(ifdThreeOffset,17,1,false,false);
	const rawLength = findIFDTagValue(ifdThreeOffset,23,1,false,false);
	
	metaData.set("RawLength", rawLength);
	metaData.set("Slices", findIFDTagValue(ifdThreeOffset,64,198,true,false));
	//Some images don't have the slice tag because they do not use a sliced image
	if(metaData.get("Slices").length==0){
		metaData.set("Slices", [0]);
	}
	const hts = getDecodedHTs(rawOffset, bytes[rawOffset+4]*256 + bytes[rawOffset+5]);
	metaData.set("HT1", hts[0]);
	metaData.set("HT2", hts[1]);
	
	const sof3Offset = rawOffset+getDHTLength(rawOffset) + 4;
	metaData.set("SOF3", getSOF3Data(sof3Offset));
	
	const sosOffset = sof3Offset +getSOF3Length(sof3Offset)+2;

	metaData.set("SOS", getSOSData(sosOffset));
	metaData.set("RawBitOffset", sosOffset+getSOSLength(sosOffset)+2);
	
	//MakerNotes code
	const makerNoteOffset = findIFDTagValue(exifOffset,124,146,false,false);
	metaData.set("ModelID", getModelID(makerNoteOffset,metaData.get("ModelName"), metaData.get("SOF3").get("HSF")));
	metaData.set("WhiteBalance", getWhiteBalance(makerNoteOffset,metaData.get("ModelName")));
	metaData.set("BlackLevel", getBlackLevel(metaData.get("ModelID")));
	metaData.set("WhiteLevel", getWhiteLevel(metaData.get("ModelID")));
	metaData.set("ColorSpaceMatrix", getColorSpaceMatrix(metaData.get("ModelID")));
	metaData.set("colorSpace", findIFDTagValue(makerNoteOffset,180,0,false,false));//sRGB=1 AdobeRGB=2
	console.log(metaData.get("WhiteBalance"));
	metaData.set("SensorInfo", getSensorInfo(makerNoteOffset));
		
	
	//Removing the bytes of the file that are not part of the pure raw bytes
	bytes=bytes.slice(metaData.get("RawBitOffset"));
	
	return metaData;
}
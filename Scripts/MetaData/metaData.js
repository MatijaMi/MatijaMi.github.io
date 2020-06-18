//Function to collect data from IFD#0,IFD#3, EXIF and MakerNote-SubIFD
function collectMetaData(){
	var metaData = new Map();
	
	//The offset to IFD#0 is always 16 Bytes
	const ifdZeroOffset = 16;
	metaData.set("ModelName", findIFDTagValue(ifdZeroOffset, 16,1,true,true));
	metaData.set("MakerName", findIFDTagValue(ifdZeroOffset,15,1,true,true));
	
	var image0Offset = findIFDTagValue(ifdZeroOffset,17,1,false,false);
	var image0Length = findIFDTagValue(ifdZeroOffset,23,1,false,false);
	metaData.set("JpegHeight",findIFDTagValue(16,0,1,false,false));
	metaData.set("JpegWidth",findIFDTagValue(16,1,1,false,false));
	
	jpeqBytes=bytes.slice(image0Offset,image0Offset+image0Length);
	 
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
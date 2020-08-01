//Function to collect data from IFD#0,IFD#3, EXIF and MakerNote-SubIFD
function collectMetaData(){
	var metaData = new Map();
	//The offset to IFD#0 is always 16 Bytes
	const ifdZeroOffset = 16;
	metaData.set("ModelName", findIFDTagValue(ifdZeroOffset, 16,1,true,true));
	metaData.set("ColorDataVersion", detectColorDataVersion(metaData.get("ModelName")));
	metaData.set("MakerName", findIFDTagValue(ifdZeroOffset,15,1,true,true));
	
	const image0Offset = findIFDTagValue(ifdZeroOffset,17,1,false,false);
	const image0Length = findIFDTagValue(ifdZeroOffset,23,1,false,false);
	metaData.set("JpegHeight",findIFDTagValue(16,0,1,false,false));
	metaData.set("JpegWidth",findIFDTagValue(16,1,1,false,false));
	
	jpeqBytes=bytes.slice(image0Offset,image0Offset+image0Length);
	metaData.set("DateTime",findIFDTagValue(ifdZeroOffset,50,1,true,true));
	metaData.set("DPI", findIFDTagValue(ifdZeroOffset,26,1,true,false));
	//Code for finding the EXIF Sub-IFD data
	const exifOffset = findIFDTagValue(ifdZeroOffset,105,135,false,false);
	metaData.set("ExposureTime", findIFDTagValue(exifOffset,154,130,false,false));
	metaData.set("fNumber", findIFDTagValue(exifOffset,157,130,false,false));
	
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
	
	metaData.set("colorSpace", findIFDTagValue(makerNoteOffset,180,0,false,false));//sRGB=1 AdobeRGB=2
	metaData.set("SensorInfo", getSensorInfo(makerNoteOffset));
		
	
	//Removing the bytes of the file that are not part of the pure raw bytes
	bytes=bytes.slice(metaData.get("RawBitOffset"));
	
	return metaData;
}
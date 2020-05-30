//Functions to gather data from the SOF3 part

function getSOF3Length(sof3Offset){
	//Length is saved as short so two bytes are required to be read
	return bytes[sof3Offset+2]*256 + bytes[sof3Offset+3];
}



function getSOF3Data(sof3Offset){
	//The values in the sof3 have constant positions relative to offset
	var sof3 = new Map();
	const samplePrecision = bytes[sof3Offset+4];
	const numberOfLines = bytes[sof3Offset+5]*256+ bytes[sof3Offset+6];
	const samplesPerLine = bytes[sof3Offset+7]*256+ bytes[sof3Offset+8];
	const imageComponents = bytes[sof3Offset+9];
	var samplingFactor = bytes[sof3Offset+11];
	
	
	sof3.set("SamplePrecision", samplePrecision);
	sof3.set("NumberOfLines", numberOfLines);
	sof3.set("SamplesPerLine", samplesPerLine);
	sof3.set("ImageComponents", imageComponents);
	//HSF and VSF are 4 bits each saved in one byte
	if(samplingFactor==17){
		sof3.set("HSF",1);
		sof3.set("VSF",1);
		
	}else{
		if(samplingFactor==33){
			sof3.set("HSF",2);
			sof3.set("VSF",1);
		}else{
			sof3.set("HSF",2);
			sof3.set("VSF",2);
		}
	}
	return sof3;
}
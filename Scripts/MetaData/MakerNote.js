/* 	Finds the ID of the number, useful for finding black
	and white levels as well as camera color matrix */

function getModelID(makerNoteOffset,modelName,hsf){
	var modelID =(Math.pow(2,32)+findIFDTagValue(makerNoteOffset,16,0,false,false)).toString(16);
	if(modelName.includes("PowerShot")){
		return modelID.substr(1);// PowerShot cameras have 2 not needed characters at start
	}else{
		if(hsf>1){
			return modelID+"y";
		}else{
			return modelID;	
		}
	}
}

/*	Format for white balance is R-G-G-B,
	except for  the G9 where it is G-R-B-G */
function getWhiteBalance(makerNoteOffset, colorDataVersion){
	var wbOffset;
	var colorBalance=[];
	var colorDataOffset = findIFDTagValue(makerNoteOffset,1,64,false,false);
	if(isNaN(colorDataOffset)){
		colorDataOffset=findIFDTagValue(makerNoteOffset,41,0,false,false);
		var wbInfoTag=true;
	}
	
	if(wbInfoTag){
		wbOffset=8;
		for(let i =0; i <4; i++){
			var wbBytes=[];
			for(let j =0; j<4;j++){
				wbBytes.push(bytes[colorDataOffset+wbOffset+4*i+j]);
			}
			colorBalance.push(transformFourBytes.apply(null,wbBytes));
		}
	}else{
		wbOffset=getWhiteBalanceIndex(colorDataVersion);
		for(let i =0; i <4; i++){
			colorBalance.push(transformTwoBytes(bytes[colorDataOffset+(wbOffset+i)*2],bytes[colorDataOffset+(wbOffset+i)*2+1]));
		}
	}
	return colorBalance;
	
}

//Function to get some of the relevant sensor information in the MakerNote section
//In this case the dimensions of the sensor area
function getSensorInfo(mnOffset){
	var sensorInfoOffset = findIFDTagValue(mnOffset,224,0,false,false);
	var sensorWidth= transformTwoBytes(bytes[sensorInfoOffset+2],bytes[sensorInfoOffset+3]);
	var sensorHeight= transformTwoBytes(bytes[sensorInfoOffset+4],bytes[sensorInfoOffset+5]);
	//Format(10 Elements) : Witdth / Heigth / Left / Top / Right / Bottom Border/ Left/ Top/ Right /Bottom BlackMask
	var sensorInfo=[];
	sensorInfo.push(sensorWidth);
	sensorInfo.push(sensorHeight);
	for(let i =0; i<8;i++){
		sensorInfo.push(transformTwoBytes(bytes[sensorInfoOffset+(5+i)*2],bytes[sensorInfoOffset+(5+i)*2+1]));
	}
	return sensorInfo;
}


function getWhiteLevel(modelID){
	console.log(colorData.get(modelID)[1]);
	return colorData.get(modelID)[1];
}

function getBlackLevel(modelID){
	console.log(colorData.get(modelID)[0]);
	return colorData.get(modelID)[0];
}
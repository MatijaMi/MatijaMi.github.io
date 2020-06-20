//Still not clear how much of the MakerNote needs to actually be saved
//WhiteBalance is still needed but unclear how to find
function getWhiteBalance(mnOffset, model){
	var colorBalanceOffset = findIFDTagValue(mnOffset,1,64,false,false);
	var wbOffset;
	if(model.includes("EOS M")|| model.includes("PowerShot")){
		wbOffset=71;	
	}else{
		if(model.includes("20D")|| model.includes("350D")){
			wbOffset=25;	
		}else{
			if(model.includes("1D Mark II")|| model.includes("1Ds Mark II")){
				wbOffset=34;	
			}else{
				wbOffset=63;
			}
		}
	}
	//Format for white balance is R-G-G-B
	var colorBalance=[];
	for(let i =0; i <4; i++){
		colorBalance.push(transformTwoBytes(bytes[colorBalanceOffset+(wbOffset+i)*2],bytes[colorBalanceOffset+(wbOffset+i)*2+1]));
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
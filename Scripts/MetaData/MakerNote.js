/*	Format for white balance is R-G-G-B,
	except for  the G9 where it is G-R-B-G*/
function getWhiteBalance(makerNoteOffset, model){
	var wbOffset;
	var colorBalance=[];
	var colorDataOffset = findIFDTagValue(makerNoteOffset,1,64,false,false);
	if(isNaN(colorDataOffset)){
		colorDataOffset=findIFDTagValue(makerNoteOffset,41,0,false,false);
		var wbInfoTag=true;
	}
	if(model.includes("EOS M")|| model.includes("PowerShot")){
		wbOffset=71;
		if(model.includes("G9")){
			wbOffset=8;
			}
	}else{
		if(model.includes("20D")|| model.includes("350D")){
			wbOffset=25;	
		}else{
			if(model.includes("1D Mark III")){
				return "No Values";	
			}else{
				if(model.includes("1D Mark II")|| model.includes("1Ds Mark II")){
					wbOffset=54;	
				}else{
					wbOffset=63;
				}
			}
		}	
	}
	if(wbInfoTag){
		for(let i =0; i <4; i++){
			var wbBytes=[];
			for(let j =0; j<4;j++){
				wbBytes.push(bytes[colorDataOffset+wbOffset+4*i+j]);
			}
			colorBalance.push(transformFourBytes.apply(null,wbBytes));
		}
	}else{
		for(let i =0; i <4; i++){
			colorBalance.push(transformTwoBytes(bytes[colorDataOffset+(wbOffset+i)*2],bytes[colorDataOffset+(wbOffset+i)*2+1]));
		}
	}
	//console.log(colorBalance);
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

function getWhiteLevel(makerNoteOffset,){
	//TODO
}

function getBlackLevel(makerNoteOffset,model){
	//TODO
	var blackLevels=[];
	var colorDataOffset = findIFDTagValue(makerNoteOffset,1,64,false,false);
	var blOffset;
	if(model.includes("EOS M")|| model.includes("PowerShot")){
		blOffset=264;
		if(model.includes("G9")){
			blOffset=8;
			}
	}else{
		if(model.includes("20D")|| model.includes("350D")){
			blOffset=25;	
		}else{
			if(model.includes("1D Mark III")){
				return "No Values";	
			}else{
				if(model.includes("1D Mark II")|| model.includes("1Ds Mark II")){
					blOffset=196;	
				}else{
					blOffset=231;
				}
			}
		}	
	}
	for(let i =0; i <4; i++){
			blackLevels.push(transformTwoBytes(bytes[colorDataOffset+(blOffset+i)*2],bytes[colorDataOffset+(blOffset+i)*2+1]));
		}
	//console.log(blackLevels);
	return blackLevels;
	
	
}
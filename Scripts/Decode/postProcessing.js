function cropImage(image,metaData,colorFormat){
	let newImg=[];
	let sensorBorders =metaData.get("SensorInfo");
	let x0 = sensorBorders[2]*3;
	let y0 = sensorBorders[3];
	let height = sensorBorders[5];
	let width = sensorBorders[4]*3;
	for(let i =y0; i <height;i++){
		newImg.push(image[i].slice(x0,width));
	}
	return newImg;
}

function applyWhiteBalance(image,metaData){
	var whiteBalanceRatios = getWhiteBalanceRatios(metaData.get("WhiteBalance"));
	var newImg=[];
	for(var i =0; i<image.length;i++){
		var line =[];
		if(i%2==0){
			for(var j=0; j<image[i].length;j++){
				if(j%2==0){
					line.push(Math.round(image[i][j]*whiteBalanceRatios[0]));
				}else{
					line.push(Math.round(image[i][j]*whiteBalanceRatios[1]));
				}
			}
		}else{
			for(var j=0; j<image[i].length;j++){
				if(j%2==0){
					line.push(Math.round(image[i][j]*whiteBalanceRatios[2]));
				}else{
					line.push(Math.round(image[i][j]*whiteBalanceRatios[3]));
				}
			}
		}
		newImg.push(line);	
	}
	return newImg;	
}

function adjustColorLevels(image,metaData){
	
	
}

function correctGamma(image){
	
	
	
} 

function convertTosRGB(image, metaData){
	
	
	
	
}
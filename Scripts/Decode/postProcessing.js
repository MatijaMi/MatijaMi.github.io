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
	
	
	
}

function adjustColorLevels(image,metaData){
	
	
}

function correctGamma(image){
	
	
	
} 

function convertTosRGB(image, metaData){
	
	
	
	
}
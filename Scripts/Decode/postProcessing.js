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

function correctGamma(image){
	return image;
} 

function convertTosRGB(image, metaData){
	var sRGBtoXYZ=[[0.412453, 0.357580, 0.180423],
				   [0.212671, 0.715160, 0.072169],
				   [0.019334, 0.119193, 0.950227]];
	var XYZtoCam=arrayTo3x3(metaData.get("ColorSpaceMatrix"));
	var blackLevel = metaData.get("BlackLevel");
	var whiteLevel = metaData.get("WhiteLevel");
	image = prepareColors(image,blackLevel,whiteLevel);
	var camTosRGB=invert3x3(matrixNormalize(matrixMul(XYZtoCam,sRGBtoXYZ)));
	var newImg=[];
	for(var i =0; i<image.length;i++){
		var line =[];
		for(var j=0; j<image[i].length;j+=3){
			var camColors=[[image[i][j]],[image[i][j+1]],[image[i][j+2]]];
			var sRGBColors = clipColors(matrixMul(camTosRGB,camColors));//Optimization
			line.push(sRGBColors[0],sRGBColors[1],sRGBColors[2]);
		}
		newImg.push(line);	
	}
	return newImg;	
}

function arrayTo3x3(arr){
	var mat=[];
	for(var i =0;i<3;i++){
		var row=[];
		for(var j=0;j<3;j++){
			row.push(arr[i*3+j]);
		}
		mat.push(row);
	}
	return mat;
}

function prepareColors(image, blackLevel, whiteLevel){
	var newImg= [];
	for(var i=0;i<image.length;i++){
		var newLine=[];
		for(var j=0;j<image[i].length;j++){
			var prepared= (Math.min(Math.max(image[i][j],blackLevel),whiteLevel)-blackLevel)/(whiteLevel-blackLevel);
			newLine.push(prepared);
		}
		newImg.push(newLine);
	}
	return newImg;
}

function clipColors(arr){
	var clipped=[];
	for(var i =0; i <arr.length;i++){
		if(arr[i][0]>1){
			clipped.push(1);
		}else{
			if(arr[i][0]<0){
				clipped.push(0);
			}else{
				clipped.push(Math.round(arr[i][0]*10000)/10000);
			}
		}
	}
	return clipped;
}




















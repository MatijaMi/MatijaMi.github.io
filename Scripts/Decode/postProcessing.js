/* 	Applies the white balance multiplies from
	the metadata to the coresponding colors
	White Balance Format: R G G B */
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
		progressBarUpdate(i,Math.floor(image.length/100),"Applying White Balance");
	}
	return newImg;	
}

/* Using the matrices for changing color spaces,
	moves the colors from the camera color space to sRGB */
function convertTosRGB(image, metaData){
	var newImg=[];
	var blackLevel = metaData.get("BlackLevel");
	var whiteLevel = metaData.get("WhiteLevel");
	//Standard matrix for sRGB to XYZ transformation
	var sRGBtoXYZ=[[0.412453, 0.357580, 0.180423],
				   [0.212671, 0.715160, 0.072169],
				   [0.019334, 0.119193, 0.950227]];
	//Matrix for XYZ to Camera color space transformation
	var XYZtoCam=arrayTo3x3(metaData.get("ColorSpaceMatrix"));
	/*	The matrix for the actual transformation is achieved
		by multiplying the XYZtoCam and sRGBtoXYZ matrices, normalizing
		the rows so the sums of the elements is 1 and then getting 
		the inverse of that matrix	*/
	var camTosRGB=invert3x3(matrixNormalize(matrixMul(XYZtoCam,sRGBtoXYZ)));
	
	for(var i =0; i<image.length;i++){
		var line =[];
		for(var j=0; j<image[i].length;j+=3){
			/*For the conversion the colors need to have the 
			proper color levels and be normalized to a [0,1] range */
			var cR=normalizeColor(image[i][j],blackLevel,whiteLevel);
			var cG=normalizeColor(image[i][j+1],blackLevel,whiteLevel);
			var cB=normalizeColor(image[i][j+2],blackLevel,whiteLevel);
			//Faster matrix multiplication for this case
			for(var k =0;k<3;k++){
				var color=camTosRGB[k][0]*cR+camTosRGB[k][1]*cG+camTosRGB[k][2]*cB;
				line.push(Math.round(Math.max(Math.min(color,1),0)*100000));
			}
		}
		newImg.push(line);
		progressBarUpdate(i,Math.floor(image.length/100),"Converting to sRGB");
	}
	return newImg;	
}


function correctGamma(image){
	var d = new Date();
	var newImg = [];
	for(var i =0; i <image.length;i++){
		var line = [];
		for(var j=0; j<image[i].length;j++){
			var x = image[i][j]/100000;
			if(x<0.00304){
				x=x*12.92;
			}else{
				x=(1.055*Math.pow(x,1/2.4))-0.055;
			}
			line.push(Math.round(x*100000));
		}
		newImg.push(line);
	}
	var b = new Date();
	console.log(b.getTime()-d.getTime());
	return newImg;
} 

/*	Crops image in order  to remove black space
	outside of the sensor borders */
function cropImage(image,metaData){
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

/*	The XYZtoCam matrix is saved a an array with 9
	elements that need to be put in a 2D 3x3 array	*/
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

/*	Applies the proper color levels and
	normalized the color to a [0,1] range*/
function normalizeColor(color, blackLevel, whiteLevel){
	return (Math.min(Math.max(color,blackLevel),whiteLevel)-blackLevel)/(whiteLevel-blackLevel);
}

function adjustLevelsYCC(image,metaData){
	var newImage=[];
	var blackLevel= metaData.get("BlackLevel");
	var whiteLevel= metaData.get("WhiteLevel");
	for(var i =0; i <image.length;i++){
		var newLine=[];
		for(var j =0; j<image[i].length;j++){
			newLine.push(Math.round(normalizeColor(image[i][j],blackLevel,whiteLevel)*100000));
		}
		newImage.push(newLine);
	}
	return newImage;
}


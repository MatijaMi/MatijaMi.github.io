/*	Conversion from YCbCr to RGB
	R = Y + Cr | G = Y - 0.19 * Cb - 0.5 * Cr | B = Y +Cb
	Assuming the our Cb and Cr values are equal to 2*Cb and 1.6*Cr */

function YCCtoRGB(image){ 
	var newImg=[];
	for(var i = 0; i <image.length;i++){
		var line =[];
		for(var j =0; j <image[i].length;j+=3){
			var Y=image[i][j];
			var Cb=image[i][j+1];
			var Cr=image[i][j+2];
			
			var r =Y +Cr;
			var g =Y - 0.19*Cb - 0.5*Cr;
			var b =Y +Cb;
			line.push(r,g,b);
			}
		newImg.push(line);
		//Progress bar update
		progressBarUpdate(i/3,Math.floor(image.length/300),"Converting to RGB");
	}
	return newImg;
}

/*	Conversion from YCbCr to RGB
	R = Y + 0.049 * Cb + 5.598 * Cr 
	G = Y - 1.377 * Cb - 2.869 * Cr 
	B = Y + 7.080 * Cb + 0.025 * Cr
	Assuming the our Cb and Cr values are equal to 0.25*Cb and 0.25*Cr */
function YYYYCbCrtoRGB(image){
	var newImg=[];
	for(var i=0;i<image.length;i++){
		var line=[];
		for(var j =0; j <image[i].length;j+=3){
			var y =image[i][j];
			var cb =image[i][j+1];
			var cr =image[i][j+2];
			
			var r=y + 0.049 * cb + 5.598 * cr;
			var g=y - 1.377 * cb - 2.869 * cr;
			var b=y + 7.090 * cb - 0.025 * cr;
			line.push(r,g,b);
		}
		newImg.push(line);
		progressBarUpdate(i/3,Math.floor(image.length/300),"Converting to RGB");
	}
	return newImg;
}
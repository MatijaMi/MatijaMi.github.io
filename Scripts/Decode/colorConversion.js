/*	Conversion from YCbCr to RGB
	R = Y + Cr | G = Y - 0.19 * Cb - 0.5 * Cr | B = Y +Cb
	Assuming the our Cb and Cr values are equal to 2*Cb and 1.6*Cr */

function YCCtoRGB(image){
	for(var i = 0; i <image.length;i++){
		for(var j =0; j<image[i].length;j++){
			var Y=image[i][j][0];
			var Cb=image[i][j][1];
			var Cr=image[i][j][2];
			
			var r =Y +Cr;
			var g =Y - 0.19*Cb - 0.5*Cr;
			var b =Y +Cb;
			image[i][j][0]=r;
			image[i][j][1]=g;
			image[i][j][2]=b;	
		}
		if(i%(Math.floor(image.length/100))==0){
				postMessage(["PB",Math.floor(i/(Math.floor(image.length/100))),"Converting to RGB"]);
			}
	}
	return image;
}

/*	Conversion from YCbCr to RGB
	R = Y + 0.049 * Cb + 5.598 * Cr 
	G = Y - 1.377 * Cb - 2.869 * Cr 
	B = Y + 7.080 * Cb + 0.025 * Cr
	Assuming the our Cb and Cr values are equal to 0.25*Cb and 0.25*Cr */
function YYYYCbCrtoRGB(image){
	
	for(var i=0;i<image.length;i++){
		for(var j=0; j<image[i].length;j++){
			var y =image[i][j][0];
			var cb =image[i][j][1];
			var cr =image[i][j][2];
			
			image[i][j][0]=Number((y + 0.049 * cb + 5.598 * cr).toFixed(2));
			image[i][j][1]=Number((y - 1.377 * cb - 2.869 * cr).toFixed(2));
			image[i][j][2]=Number((y + 7.090 * cb - 0.025 * cr).toFixed(2));
		}
		
		if(i%(Math.floor(image.length/100))==0){
				postMessage(["PB",i/(Math.floor(image.length/100)),"Interpolating Image"]);
			}
	}
	return image;
}
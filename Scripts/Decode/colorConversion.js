/*	Conversion from YCbCr to RGB
	R = Y + Cr | G = Y - 0.19 * Cb - 0.5 * Cr | B = Y +Cb
	Assuming the our Cb and Cr values are equal to 2*Cb and 1.6*Cr */

function YCCtoRGB(image){ 
	var newImg=[];
	for(var i = 0; i <image.length;i+=3){
			var Y=image[i];
			var Cb=image[i+1];
			var Cr=image[i+2];
			
			var r =Y +Cr;
			var g =Y - 0.19*Cb - 0.5*Cr;
			var b =Y +Cb;	
			newImg.push(r,g,b);
		
		//Progress bar update
		if(i/3%(Math.floor(image.length/300))==0){
				postMessage(["PB",Math.floor(i/3/(Math.floor(image.length/300))),"Converting to RGB"]);
			}
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
	for(var i=0;i<image.length;i+=3){
			var y =image[i];
			var cb =image[i+1];
			var cr =image[i+2];
			
			var r=Number((y + 0.049 * cb + 5.598 * cr).toFixed(2));
			var g=Number((y - 1.377 * cb - 2.869 * cr).toFixed(2));
			var b=Number((y + 7.090 * cb - 0.025 * cr).toFixed(2));
			newImg.push(r,g,b);
		
		if(i/3%(Math.floor(image.length/300))==0){
				postMessage(["PB",i/3/(Math.floor(image.length/300)),"Converting to RGB"]);
			}
	}
	return newImg;
}
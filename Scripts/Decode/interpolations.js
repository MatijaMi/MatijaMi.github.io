/*	Interpolates the missing Cb and Cr values for every second sample
	by using the values from the previous and next sample */
function interpolateYCC(image){
	for(var i = 0; i <image.length;i++){
		if(i%(Math.floor(image.length/100))==0){
			postMessage(["PB",i/(Math.floor(image.length/100)),"Interpolating YCbCr"]);
		}
		for(var j =1; j<image[i].length;j++){
			var prevCb = image[i][j-1][1];
			var prevCr = image[i][j-1][2];
			if(j==(image[i].length-1)){
				image[i][j].push(prevCb);
				image[i][j].push(prevCr);
			}else{
				
				var nextCb= image[i][j+1][1];
				var nextCr=	image[i][j+1][2];
				image[i][j].push((prevCb+nextCb)/2);
				image[i][j].push((prevCr+nextCr)/2);
			}
			j++;
		}
	}
	return image;	
}

/* 	Interpolates the missing Cb and Cr to fill in the gaps,
	for Y2 horizontally, for Y3 vertically and 
	for Y4 horizontally from the interpolated values
	|Y1 Cb Cr | Y2 | Y1 Cb Cr | Y2 |..
	|	Y3    | Y4 | 	Y3 	  | Y4 |..
	|Y1 Cb Cr | Y2 | Y1 Cb Cr | Y2 |.. */
function interpolateYYYYCbCr(image){
	var newImg =[];
	for(var i=0;i<image.length;i++){
		if(i%2==0){
			var y,cb,cr;
			//Interpolation for even rows
			for(var j=0; j<image[i].length;j++){
				y= image[i][j][0];
				if(j%2==0){
					cb= image[i][j][1];
					cr= image[i][j][2];
				}else{
					
					if(j==(image[i].length-1)){
						cb=image[i][j-1][1];
						cr=image[i][j-1][2];
					}else{
						cb=(image[i][j-1][1]+image[i][j+1][1])/2;
						cr=(image[i][j-1][2]+image[i][j+1][2])/2;
					}
				}
				newImg.push(y,cb,cr);
			}
		}else{
			//Interpolation for odd rows, y3 and y4 cells at the same time, to save time
			var y3,y4,cb3,cr3,cb4,cr4,pcb,pcr;
			for(var j=0; j<image[i].length;j+=2){
				//y3
				y3=image[i][j][0];
				if(i==(image.length-1)){
					cb3=image[i-1][j][1];
					cr3=image[i-1][j][2];
						
					}else{
						cb3=(image[i-1][j][1]+image[i+1][j][1])/2;
						cr3=(image[i-1][j][2]+image[i+1][j][2])/2;
					}
				//y4
				if(j>0){
					y4=image[i][j-1][0];
					cb4=(pcb+cb3)/2;
					cr4=(pcr+cr3)/2;
					newImg.push(y4,cb4,cr4);
				}
				
				newImg.push(y3,cb3,cr3);
				
				pcb=cb3;
				pcr=cr3;
				
				if(j==image[i].length-2){
					y4=image[i][j+1][0];	
					newImg.push(y4,cb3,cr3);
				}
				
			}
		}
		if(i%(Math.floor(image.length/100))==0){
				postMessage(["PB",i/(Math.floor(image.length/100)),"Interpolating Image"]);
			}
	}
		
		
	return newImg;
}


/*	Just a simple linear bayer interpolation for the format:
	|R|G|R|G|
	|G|B|G|B|
	|R|G|R|G|
	|G|B|G|B|  */
	
function bayerInterpolation(image){
	var newImg =[];
	for(var i =0; i<image.length;i++){
		
			if(i==0){
				interpolateFirstLine(image,newImg);
				
			}else{
				if(i==image.length-1){
					interpolateLastLine(image,newImg);
				}else{
					interpolateLine(image,i,newImg);
				}
			}
		
		
		if(i%Math.floor(image.length/100)==0){
			postMessage(["PB",Math.min((i/Math.floor(image.length/100)),100),"Interpolating Values"])
		}
		}
	return newImg;
	}


function interpolateFirstLine(image,newImg){
	
	for(var i=0; i<image[0].length;i++){
		var r,g,b;
		if(i==0){
			r =image[0][0];
			g = (image[0][1]+image[1][0])/2;
			b = image[1][1];
			
		}else{
			if(i==image[0].length-1){
				r = image[0][image[0].length-2];
				g = image[0][image[0].length-1];
				b = image[1][image[1].length-1];
				
			}else{
				if(i%2==1){
					r = (image[0][i-1]+image[0][i+1])/2;
					g = image[0][i];
					b = image[1][i];
				}else{
					r= image[0][i];
					g= (image[0][i-1]+image[0][i+1] +image[1][i])/3;
					b= (image[1][i-1]+ image[1][i+1])/2;
				}
			}
		}
		newImg.push(r,g,b);
	}
	return newImg;
}
		
function interpolateLastLine(image,newImg){
	var l= image.length-1;
	for(var i=0; i<image[l].length;i++){
		var r,g,b;
		if(i==0){
			r =image[l-1][0];
			g =image[l][0];
			b = image[l][1];
			
		}else{
			if(i==image[l].length-1){
				r = image[l-1][image[l].length-2];
				g = (image[l][image[l].length-2]+ image[l-1][image[l-1].length-1])/2;
				b = image[l][image[l].length-1];
				
			}else{
				if(i%2==1){
					r = (image[l-1][i-1]+image[l-1][i+1])/2;
					g = (image[l][i-1]+image[l][i+1]+image[l-1][i])/3;
					b = image[l][i];
				}else{
					r= image[l-1][i];
					g= image[l][i];
					b= (image[l][i-1]+ image[l][i+1])/2;
				}
			}
		}
		
		newImg.push(r,g,b);
	}
	return newImg;
}

function interpolateLine(image, j,newImg){
	if(j%2==0){
		return  interpolateEvenLine(image,j,newImg);
	}else{
		return  interpolateOddLine(image,j,newImg);
	}	
}

function interpolateOddLine(image, j,newImg){
	for(var i=0; i<image[j].length;i++){
		var r,g,b;
		if(i==0){
			r = (image[j-1][0]+image[j+1][0])/2;
			g = image[j][0];
			b = image[j][1];
			
		}else{
			if(i==image[j].length-1){
				r= (image[j-1][image[j-1].length-2]+image[j+1][image[j+1].length-2])/2;
				g= (image[j][i-1]+ image[j-1][i]+image[j+1][i])/3;
				b=image[j][i];
				
			}else{
				if(i%2==1){
					r=(image[j-1][i-1]+image[j-1][i+1]+image[j+1][i-1]+image[j+1][i+1])/4
					g= (image[j][i-1]+image[j][i+1]+image[j-1][i]+image[j+1][i])/4;
					b=image[j][i];
				}else{
					r=(image[j-1][i]+image[j+1][i])/2;
					g=image[j][i];
					b=(image[j][i-1]+image[j][i+1])/2;
				}
			}
		}
		newImg.push(r,g,b);
	}
	return newImg;	
}

function interpolateEvenLine(image, j,newImg){
	for(var i=0; i<image[j].length;i++){
		var r,g,b;
		if(i==0){
			r= image[j][i];
			g= (image[j-1][i]+image[j+1][i]+image[j][i+1])/3;
			b= (image[j-1][i+1]+image[j+1][i+1])/2;
			
		}else{
			if(i==image[j].length-1){
				r=image[j][i-1];
				g=image[j][i];
				b=(image[j-1][i]+image[j+1][i])/2;
				
			}else{
				if(i%2==1){
					r=(image[j][i-1]+image[j][i+1])/2
					g=image[j][i];
					b=(image[j-1][i]+image[j+1][i])/2;
				}else{
					r=image[j][i];
					g=(image[j][i-1]+image[j][i+1]+image[j-1][i]+image[j+1][i])/4;
					b=(image[j-1][i-1]+image[j-1][i+1]+image[j+1][i-1]+image[j+1][i+1])/4;	
				}
			}
		}
		newImg.push(r,g,b);
	}
	return newImg;	
}

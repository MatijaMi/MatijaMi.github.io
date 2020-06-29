/*	Interpolates the missing Cb and Cr values for every second sample
	by using the values from the previous and next sample */
function interpolateYCC(image){
	var newImg = [];
	var y, cb, cr;
	for(let i=0; i <image.length;i++){
		var line=[];
		for(let j=0; j<image[i].length;j++){
			if(j%2==0){
				y = image[i][j][0];
				cb = image[i][j][1];
				cr = image[i][j][2];
			}else{
				y = image[i][j-1][0];
				var prevCb = image[i][j-1][1];
				var prevCr = image[i][j-1][2];
				if(j==(image[i].length-1)){
					cb=prevCb;
					cr=prevCr;
				}else{
					var nextCb = image[i][j+1][1];
					var nextCr = image[i][j+1][2];
					cb = (prevCb+nextCb)/2;
					cr = (prevCr+nextCr)/2;
				}
			}
			line.push(y,cb,cr);
		}
		newImg.push(line);
		progressBarUpdate(i,Math.floor(image.length/100),"Interpolating YCbCr");
	}
	return newImg;	
}

/* 	Interpolates the missing Cb and Cr to fill in the gaps,
	for Y2 horizontally, for Y3 vertically and 
	for Y4 horizontally from the interpolated values
	|Y1 Cb Cr | Y2 | Y1 Cb Cr | Y2 |..
	|	Y3    | Y4 | 	Y3 	  | Y4 |..
	|Y1 Cb Cr | Y2 | Y1 Cb Cr | Y2 |.. */
function interpolateYYYYCbCr(image){
	var newImg=[];
	for(let i=0;i<image.length;i++){
		var line =[];
		if(i%2==0){
			var y,cb,cr;
			//Interpolation for even rows
			for(let j=0; j<image[i].length;j++){
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
				line.push(y,cb,cr);
			}
		}else{
			//Interpolation for odd rows, y3 and y4 cells at the same time, to save time
			var y3,y4,cb3,cr3,cb4,cr4,pcb,pcr;
			for(let j=0; j<image[i].length;j+=2){
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
					line.push(y4,cb4,cr4);
				}
				
				line.push(y3,cb3,cr3);
				
				pcb=cb3;
				pcr=cr3;
				
				if(j==image[i].length-2){
					y4=image[i][j+1][0];	
					line.push(y4,cb3,cr3);
				}				
			}
		}
		newImg.push(line);
		//Progress bar update
		progressBarUpdate(i,Math.floor(image.length/100),"Interpolating Image");
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
	if(isGRBG(image)){
		image.shift();//Remove first line
	}
	for(let i =0; i<image.length;i++){
		var line=[];
		switch(i){
			case 0:
				line=interpolateFirstLine(image);
				break;
			case image.length-1:
				line =interpolateLastLine(image);
				break;
			default:
				line=interpolateLine(image,i);
				break;			
		}
		newImg.push(line);
		//Progress bar update
		progressBarUpdate(i,Math.floor(image.length/100),"Interpolating Values");
	}
	return newImg;
}


function interpolateFirstLine(image){
	var r,g,b;
	var line = [];
	for(let i=0; i<image[0].length;i++){
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
		line.push(r,g,b);
	}
	return line;
}
		
function interpolateLastLine(image){
	var l= image.length-1;
	var r,g,b;
	var line =[];
	for(let i=0; i<image[l].length;i++){
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
		line.push(r,g,b);
	}
	return line;
}

function interpolateLine(image, j){
	if(j%2==0){
		return  interpolateEvenLine(image,j);
	}else{
		return  interpolateOddLine(image,j);
	}	
}

function interpolateOddLine(image, j){
	var r,g,b;
	var line = [];
	for(let i=0; i<image[j].length;i++){
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
		line.push(r,g,b);
		
	}
	return line;	
}

function interpolateEvenLine(image, j){
	var r,g,b;
	var line =[];
	for(let i=0; i<image[j].length;i++){
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
		line.push(r,g,b);
	}
	return line;	
}

/* 	Some images have a GRBG CFA instead of RGGB, in order to
	find out which it is we compare the difference between all
	G1 and G2 values and the differnce between red and blue,
	If RGGB then the differnce between the greens should be smaller
	than betwenn red and blue */
function isGRBG(image){
	var R=0;
	var G1=0;
	var G2=0;
	var B=0;
	for(let i =0; i <image.length;i++){
		for(let j=0; j<image[i].length;j++){
			if(i%2==0){
				if(j%2==0){
					R=R+image[i][j];
				}else{
					G1=G1+image[i][j];
				}
			}else{
				if(j%2==0){
					G2=G2+image[i][j];
				}else{
					B=B+image[i][j];
				}
			}
		}
	}
	if(Math.abs(R-B)<Math.abs(G1-G2)){
		return true;
	}
	return false;
}

function coolInterpolation(image){
	
	
}
function interpolateYCC(image){
	for(var i = 0; i <image.length;i++){
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

function interpolateYYYYCbCr(image){
	console.log("FIRST AND SECOND INTERPOLATION");
	for(var i=0;i<image.length;i++){
		
		if(i%2==0){
			for(var j=1; j<image[i].length;j+=2){
				if(j==image[i].length-1){
					var cb=image[i][j-1][1];
					var cr=image[i][j-1][2];
					image[i][j].push(cb);
					image[i][j].push(cr);
				}else{
					var cb=(image[i][j-1][1]+image[i][j+1][1])/2;
					var cr=(image[i][j-1][2]+image[i][j+1][2])/2;
					image[i][j].push(cb);
					image[i][j].push(cr);
				}
			}
		}else{
			for(var j=0; j<image[i].length-1;j+=2){
				if(i==image.length-1){
					var cb=image[i-1][j][1];
					var cr=image[i-1][j][2];
					image[i][j].push(cb);
					image[i][j].push(cr);
				}else{
					var cb=(image[i-1][j][1]+image[i+1][j][1])/2;
					var cr=(image[i-1][j][2]+image[i+1][j][2])/2;
					image[i][j].push(cb);
					image[i][j].push(cr);
				}
			}
		}
	}
	console.log("THIRD");
	for(var i =1; i<image.length;i+=2){
		for(var j=1; j<image[i].length;j+=2){
			if(j==image[i].length-1){
					var cb=image[i][j-1][1];
					var cr=image[i][j-1][2];
					image[i][j].push(cb);
					image[i][j].push(cr);
				}else{
				var cb=(image[i][j-1][1]+image[i][j+1][1])/2;
				var cr=(image[i][j-1][2]+image[i][j+1][2])/2;
				image[i][j].push(cb);
				image[i][j].push(cr);
			}	
		}
	}
	return image;
}



function bayerInterpolation(image){
	var newImg =[];
	for(var i =0; i<image.length;i++){
		if(i%Math.floor(image.length/100)==0){
			postMessage(["PB",i/Math.floor(image.length/100),"Interpolating Values"])
		}
			if(i==0){
				newImg.push(interpolateFirstLine(image));
				
			}else{
				if(i==image.length-1){
					newImg.push(interpolateLastLine(image));
				}else{
					newImg.push(interpolateLine(image,i));
				}
			}
		}
	return newImg;
	}


function interpolateFirstLine(image){
	var line=[];
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
				b = image[1][image[0].length-1];
				
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
	var line=[];
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
	var line =[];
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
		line.push(r,g,b);
	}
	return line;	
}

function interpolateEvenLine(image, j){
	var line =[];
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
		line.push(r,g,b);
	}
	return line;	
}

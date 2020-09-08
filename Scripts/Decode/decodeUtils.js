/*	Given a position in the bit array finds the next value
	by checking if the sequence of the next bits is in the Huffman Table, 
	if it isn't it adds the next bit and checks again */
function findNextValue(huffTable, previousValue,bits){
	var currentCode=getNextBit(bits);
	while(!huffTable.has(currentCode)){
		currentCode=currentCode+getNextBit(bits);
	}
	//The next value is equal to the previous value + the difference value
	return previousValue+getDifferenceValue(getNextBits(huffTable.get(currentCode),bits));
}

function getNextBit(bits){
	var bit = bitPointer%8;
	var byte= bits[(bitPointer-bit)/8];
	var rest = 8-byte.length;
	bitPointer++;
	if(bit<rest){
		return "0";
	}else{
		return byte.charAt(bit-rest);
	}
}

/*	Given a sequence of bits, calculates their value based
	on the system used for difference values:
	-The first bit represents the sign, 1 is minus and 0 plus
	-If negative the value is equal to -1 + 2^lengthOfDifferenceCode+ bitsWithoutSign.toDecimal
	-If positive the value is equal to 2^(lengthOfDifferenceCode-1)+ bitsWithoutSign.toDecimal */
function getDifferenceValue(differenceBits){
	if(differenceBits.length>1){//If zero then there is no difference
		var firstBit = parseInt(differenceBits.charAt(0));
		var restBits = parseInt(differenceBits.substring(1),2);
		return 1-firstBit+(2*firstBit-1)*(1<<(differenceBits.length-firstBit))+restBits;
	}else{
		if(differenceBits.length==0){
			return 0;
		}else{//For length one it's either -1 or 1
			return parseInt(differenceBits)*2-1;
		}
	}
}

//Returns the next n bits
function getNextBits(n,bits){
	var str="";
	while(n>0){
		str=str+getNextBit(bits);
		n--;
	}
	return str;
}

function adjustPreviousValues(imageLines,i,nComponents,nOfFirst,oldPreviousValues){
	var previousValues=[];
		for(let comp=0; comp<nComponents;comp++){		
			if(nOfFirst==4){
				if(i%2==0){ //In YYYYCbCr the previous values get reset every 2 lines
					if(comp==0){
						previousValues[comp]=imageLines[i-2][comp];//Adjusting for additional Ys
					}else{
						previousValues[comp]=imageLines[i-2][comp+3];//Adjusting for additional Ys
					}
				}else{
					previousValues=oldPreviousValues;
				}	
			}else{
				if(nOfFirst==2 && comp>0){
					previousValues[comp]=imageLines[i-1][comp+1];//Adjusting for additional Ys
				}else{
					previousValues[comp]=imageLines[i-1][comp];	
				}
			}
		}
 		return previousValues;
}
/////////////////////////////////////////////////////////////////

/*	Depending on the number of components, returns an array with
	the proper Huffman Table for each component */
function setupHTS(sos,ht1,ht2,numberOfComponents){
	var hts=[];
	for(let k =0; k <numberOfComponents;k++){
		if(sos.get("DCAC"+k)==0){
			hts.push(ht1);
		}else{
			hts.push(ht2);
		}
	}
	return hts;
}
//Returns how the components and  how many of their parts are saved in the bits
function setupComponentParts(HSF,VSF){
	if(HSF==1){
		var compParts=[1,1,1,1];
	}else{
		if(VSF==1){
			var compParts=[2,1,1];
		}else{
			var compParts=[4,1,1];
		}
	}
	return compParts;
}

/*	Initialises the previous values
	R,G,B and Y : 2^(samplePrecision-1)
	Cb and Cr : 0 */
function setPreviousValues(nComponents,samplePrecision){
	var previousValues = [];
	for(let k =0; k<nComponents;k++){
		if(nComponents!=3 || k==0){
			previousValues[k]=Math.pow(2,samplePrecision-1);
		}else{
			previousValues[k]=0;
		}
	}
	return previousValues;
}

/*	Returns the number of entries in one sequence of 
	values before repeating(RGGB=2 or 4;YCC=4;YYYYCC=6) */
function getNumberOfEntries(nComponents,HSF,VSF){
	if(HSF==1){
		return nComponents;
	}else{
		if(VSF==1){
			return 4;
		}else{
			return 6;
		}
	}
}

function getDecodeMode(){
	var modes = ["pure", "normal","whiteBal","demosaiced","sRGB","full"];
	for(var i =0; i <modes.length; i++){
		if(document.getElementById(modes[i]).checked){
			return i;
		}
	}
}
//Function that sends a message to update the progress bar to the main thread
function progressBarUpdate(progress,total,message){
	if(progress%total==0){
			postMessage(["PB",progress,total,message]);
		}
}


//Still not clear how much of the MakerNote needs to actually be saved
//WhiteBalance is still needed but unclear how to find
function getWhiteBalance(mnOffset){
	
	
	var colorBalanceOffset = findIFDTagValue(mnOffset,1,64,false,false);
	var colorBalance=[];
	var r=transformTwoBytes(bytes[colorBalanceOffset+126],bytes[colorBalanceOffset+127]);
	var g=transformTwoBytes(bytes[colorBalanceOffset+130],bytes[colorBalanceOffset+131]);
	var b=transformTwoBytes(bytes[colorBalanceOffset+132],bytes[colorBalanceOffset+133]);
	var max;
	if(r>b){
		if(r>g){
			max=r;
		}else{
			max=g;
		}
	}else{
		if(b>g){
			max=b;
		}else{
			max=g;
		}
	}
	console.log(max);
	console.log(r);
	console.log(g);
	console.log(b);
	colorBalance.push((r/max).toFixed(2));
	colorBalance.push((g/max).toFixed(2));
	colorBalance.push((b/max).toFixed(2));
	return colorBalance;
	
}
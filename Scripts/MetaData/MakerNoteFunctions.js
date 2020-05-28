//Still not clear how much of the MakerNote needs to actually be saved
//WhiteBalance is still needed but unclear how to find
function getWhiteBalance(mnOffset){
	
	
	var colorBalanceOffset = findIFDTagValue(mnOffset,1,64,false,false);
	var colorBalance=[];
	var r=transformTwoBytes(bytes[colorBalanceOffset+126],bytes[colorBalanceOffset+127]);
	var g1=transformTwoBytes(bytes[colorBalanceOffset+128],bytes[colorBalanceOffset+129]);
	var g2=transformTwoBytes(bytes[colorBalanceOffset+130],bytes[colorBalanceOffset+131]);
	var b=transformTwoBytes(bytes[colorBalanceOffset+132],bytes[colorBalanceOffset+133]);
	var min;
	
	colorBalance.push(r);
	colorBalance.push(g1);
	colorBalance.push(g2);
	colorBalance.push(b);
	return colorBalance;
	
}
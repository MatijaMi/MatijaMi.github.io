//Still not clear how much of the MakerNote needs to actually be saved
//WhiteBalance is still needed but unclear how to find
function getWhiteBalance(mnOffset){
	
	
	var colorBalanceOffset = findIFDTagValue(mnOffset,1,64,false,false);
	console.log(colorBalanceOffset);
	
	console.log(transformTwoBytes(bytes[colorBalanceOffset+64],bytes[colorBalanceOffset+63]))
	console.log(transformTwoBytes(bytes[colorBalanceOffset+66],bytes[colorBalanceOffset+65]))
	console.log(transformTwoBytes(bytes[colorBalanceOffset+68],bytes[colorBalanceOffset+67]))
	console.log(transformTwoBytes(bytes[colorBalanceOffset+70],bytes[colorBalanceOffset+69]))
	
	for(var i =0; i<100;i++){
		console.log("Byte " +i +" " + bytes[colorBalanceOffset+i])
	}
	
}
function transformTwoBytes(byte1, byte2){
	return byte1 + byte2*256;
}

 function transformFourBytes(byte1,byte2,byte3,byte4){
	return byte1+ byte2*Math.pow(2,8) + byte3*Math.pow(2,16) + byte4*Math.pow(2,24);
	
}
function decompressRGGB(data, mData){
	var imageLines=decompressValues(data,mData);
	return imageLines;
}

function limitComponent(comp, sp){
	var maxValue =Math.pow(2,sp)-1;
	if(comp>maxValue){
		comp=comp%(maxValue+1);
	}else{
		if(comp<0){
			comp=comp+maxValue;
		}
	}
	return comp;
}

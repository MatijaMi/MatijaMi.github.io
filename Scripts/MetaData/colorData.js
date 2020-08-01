/*	Function that finds which version of the color data in the
	MakerNote section is used for the given camera */ 

function detectColorDataVersion(cameraModel){
	if(cameraModel.includes("Canon EOS-")){
		cameraModel=cameraModel.replace("Canon EOS", "").slice(0,-1);
	}else{
		if(cameraModel.includes("Canon EOS")){
			cameraModel=cameraModel.replace("Canon EOS ", "").slice(0,-1);
		}else{
			if(cameraModel.includes("PowerShot")){
				return 5;
			}
		}
	}
	return cdv.get(cameraModel);
}


function getWhiteBalanceIndex(colorDataVersion){
	switch(colorDataVersion){
		case 1:
			return 25;
		case 2:
			return 24;
		case 5:
			return 71;
		case 9: 
			return 71
		default:
			return 63;
	}
}

function getBlackLevelIndex(colorDataVersion){
	switch(colorDataVersion){
		case 1:
			return -1;
		case 2:
			return -1;
		case 3:
			return 196;
		case 4:
			return 231;
		case 5:
			return 264;
		case 6:
			return 479;
		case 7: 
			return 504;
		case 8: 
			return 326;
		case 9: 
			return 329;
	}
}
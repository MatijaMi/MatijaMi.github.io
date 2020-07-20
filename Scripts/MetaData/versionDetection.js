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
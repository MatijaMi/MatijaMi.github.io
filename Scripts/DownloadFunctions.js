function downloadYCC(){
	var name =fileList[0].name +"YCC.txt";
	saveByteArray(downloadBytes,name);
}

function downloadYYYYCC(){
	var name =fileList[0].name +"YYYYCC.txt";
	saveByteArray(downloadBytes,name);
}
function downloadRGGB(){
	var name =fileList[0].name +"RGGB.txt";
	saveByteArray(downloadBytes,name);
}

function downloadRGB(){
	var name =fileList[0].name +"RGB.txt";
	saveByteArray(downloadBytes,name);
	
}
function downloadJpeg(){
	var name =fileList[0].name +".jpg";
	var blob = new Blob([jpeqBytes], {type: "octet/stream"});
	saveByteArray(blob, name);
}

function downloadRaw(){
	
}

function downloadMetaData(){
	var name =fileList[0].name +"MetaData.txt";
	var output="";
	for(let[key,value] of metaData){
		if(value instanceof Map){
			var map ="";
			for(let[key,invalue] of value){
			map = map + "("+ key + " : " + invalue +") ";
		}
			output= output + "[" + key + " : " + map +"]\n";
		}else{
			if(typeof value=="string"){
				output= output + "[" + key + " : " + value.replace(/\0/g, '') + "]\n";
			}else{
				output= output + "[" + key + " : " + value+"]\n";
			}
		}
	}
	var blob = new Blob([output], {type: "text/plain"});
	saveByteArray(blob, name);
}


function saveByteArray(data,name){
	var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    url = window.URL.createObjectURL(data);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);	
}

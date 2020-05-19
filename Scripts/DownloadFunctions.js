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
	var image0Offset = findIFDTagValue(16,17,1,false,false);
	var image0Length = findIFDTagValue(16,23,1,false,false);
	var data=bytes.slice(image0Offset,image0Offset+image0Length);
	saveByteArray([data], "example.jpg");
}

function downloadRaw(){
	
}

function downloadMetaData(){
	
}


function saveByteArray(data,name){
	var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    var blob = new Blob(data, {type: "octet/stream"}),
    url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
	
}
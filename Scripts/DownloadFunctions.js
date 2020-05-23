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
	var blob = new Blob([jpeqBytes], {type: "octet/stream"});
	saveByteArray(blob, "example.jpg");
}

function downloadRaw(){
	
}

function downloadMetaData(){
	
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

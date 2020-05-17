importScripts('RGGB.js', 'YYCbCr.js', 'main.js','ByteTransformations.js'); 
var window=self;


onmessage = function(e) {
  console.log('Message received from main script');
	
  if(e.data[1]=="YCC"){
	  var workerResult =[decompressYCC(e.data[0],e.data[2],e.data[3])];
  }
  console.log('Posting message back to main script');
  postMessage(workerResult);
}
function matrixMul(mat1,mat2){
	var output=[];
	for(var i =0; i<mat1.length;i++){
		var row=[];
		for(var j =0; j< mat2[0].length;j++){
			var col =[];
			for(var k =0;k<mat2.length;k++){
				col.push(mat2[k][j]);
			}
			row.push(dotProd(mat1[i],col));
		}
		output.push(row);
	}
	return output;
}

function dotProd(arr1,arr2){
	var product=0;
	if(arr1.length==arr2.length){
		for(var i =0; i <arr1.length;i++){
			product+=arr1[i]*arr2[i];
		}
	}
	return product;
}

function matrixNormalize(mat){
	for(var i =0; i <mat.length;i++){
		var sum=0;
		for(var j=0;j<mat[i].length;j++){
			sum+=mat[i][j];
		}
		for(var j=0;j<mat[i].length;j++){
			mat[i][j]=mat[i][j]/sum;
		}
	}
	return mat;
}

function invert3x3(mat){
	var cofactor=toCofactor3x3(matrixOfMinors(mat));
	var det = determinant3x3(mat,cofactor);
	return scalarMul(1/det,transpose(cofactor));
}

function matrixOfMinors(mat){
	var mom =[[0,0,0],[0,0,0],[0,0,0]];
	for(var i =0; i <mat.length;i++){
		for(var j=0; j<mat[i].length;j++){
			mom[i][j]=determinant2x2(getNotCrossedOut(mat,i,j));
		}
	}
	return mom;
	
}

function determinant2x2(mat){
	return mat[0][0]*mat[1][1]-mat[0][1]*mat[1][0];
}

function determinant3x3(mat,cofactor){
	return mat[0][0]*cofactor[0][0]+ mat[0][1]*cofactor[0][1]+ mat[0][2]*cofactor[0][2];
}


function toCofactor3x3(mat){
	mat[0][1]=-mat[0][1];
	mat[1][0]=-mat[1][0];
	mat[1][2]=-mat[1][2];
	mat[2][1]=-mat[2][1];
	return mat;
}


function transpose(mat){
	var tmat=[[0,0,0],[0,0,0],[0,0,0]];
	for(var i =0; i <mat.length;i++){
		for(var j=0; j<mat[i].length;j++){
			tmat[j][i]=mat[i][j];
		}
	}
	return tmat;
}

function scalarMul(scal, mat){
	for(var i =0; i <mat.length;i++){
		for(var j=0; j<mat[i].length;j++){
			mat[i][j]=mat[i][j]*scal;
		}
	}
	return mat;
}


function getNotCrossedOut(mat,crossi,crossj){
	var notCrossed =[];
	for(var i =0; i <mat.length;i++){
		if(i!=crossi){
			for(var j=0; j<mat[i].length;j++){
				if(j!=crossj){
					notCrossed.push(mat[i][j]);
				}
			}
		}
	}
	return [[notCrossed[0],notCrossed[1]],[notCrossed[2],notCrossed[3]]];
}
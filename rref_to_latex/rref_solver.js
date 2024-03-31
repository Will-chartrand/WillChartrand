let global_matrix = [];
let n = 3;
let m = 3;


// ------------------------------------------
// 	 For HTML Interface
// ------------------------------------------

function init() {
	// Add onchange handler for 
	document.getElementById("n").onchange = updateMatrixDimensions;
	document.getElementById("m").onchange = updateMatrixDimensions;
	document.getElementById("matrix_submit").onclick = onMatrixSubmitted;
	generateMatrixHTML();
	update();
}

function updateMatrixDimensions() {
	n = document.getElementById("n").value;
	m = document.getElementById("m").value;
	generateMatrixHTML();   // Refresh the list html
}

function generateMatrixHTML() {
	let matrixHTML = "";

	for(i = 0; i < m; i++) {
		matrixHTML += "<ul style=\"display: inline-flex\">";
		for(j = 0; j < n; j++) {
			matrixHTML += "<li> <input class=\"matrix-entry-box\" type=\"text\" value=\"" + (global_matrix.length == n ? global_matrix[i][j] : 0) + "\" name=\"\" id=\"a" + i.toString() + j.toString() + "\"/> </li>";
		}
		matrixHTML += "</ul>";
		matrixHTML += "<br>";
	}

	document.getElementById("matrix_input").innerHTML = matrixHTML;

	update();   // Refresh the list html
}

function onMatrixSubmitted() {
	updateMatrix();
	global_matrix = rref(global_matrix);
	console.log(global_matrix)
	generateMatrixHTML();
}


function updateMatrix() {
	global_matrix = []
	console.log(document.getElementById("n").value);
	console.log(document.getElementById("m").value);

	for(let i = 0; i < m; i++) {
		global_matrix.push([])
		for(let j = 0; j < n; j++) {
			global_matrix[i].push(parseInt(document.getElementById("a" + i.toString() + j.toString()).value));
		}
		console.log(global_matrix[i]);
	}

	update();   // Refresh the list html
}


// ------------------------------------------
// 	 RREF Code
// ------------------------------------------

function roundMatrix(matrix) {
	for(let i = 0; i < matrix.length; i++) {
		for(let j = 0; j < matrix[0].length; j++) {
			matrix[i][j] = parseFloat(matrix[i][j].toFixed(2));
		}
	}
	return matrix;
}

function swapRows(matrix, i, j) {
	let temp = matrix[i];
	matrix[i] = matrix[j];
	matrix[j] = temp;
}

function multiplyRow(matrix, row, scalar) {
	for(let i = 0; i < matrix[row].length; i++) {
		matrix[row][i] != 0 ? matrix[row][i] *= scalar : 0;
	}
}

function addRows(matrix, sourceRow, destRow, scalar) {
	for(let i = 0; i < matrix[sourceRow].length; i++) {
		matrix[destRow][i] += scalar * matrix[sourceRow][i];
	}
}

function printMatrix(matrix) {
	latexStr = "$\\begin{bmatrix}\n"
	for(let row of matrix) {
		for(let entry of row){
			latexStr += parseFloat(entry.toFixed(2)) + " & ";
		}
		latexStr = latexStr.slice(0, -3) + " \\\\\n";
	}
	latexStr += "\\end{bmatrix}$";
	latexStr += "\n";

	return latexStr;
}

function rref(matrix) {
	let rrefLatex = "";
	
	let lead = 0;
	let operationCounter = 1;
	const rowCount = matrix.length;
	const columnCount = matrix[0].length;

	rrefLatex += printMatrix(matrix);

	for (let r = 0; r < rowCount; r++) {
		if (columnCount <= lead) {
			console.log(rrefLatex);
			document.getElementById("latex_output").value = rrefLatex;
			return roundMatrix(matrix);
		}

		let i = r;

		while (matrix[i][lead] === 0) {
			i++;
			if (rowCount === i) {
				i = r;
				lead++;
				if (columnCount === lead) {
					console.log(rrefLatex);
					document.getElementById("latex_output").value = rrefLatex;
					return roundMatrix(matrix);
				}
			}
		}

		if(i+1 != r+1){
			rrefLatex += "$\\xrightarrow{" + ("" + i+1 + " \\leftrightarrow " + r+1) + "}$\n";
			swapRows(matrix, i, r);
			rrefLatex += printMatrix(matrix);
			operationCounter++;

			if(operationCounter % 3 == 0){
				rrefLatex += "\n\\vspace{12pt}\n\n"
			}
		}

		const divisor = matrix[r][lead];
		if (parseFloat(divisor.toFixed(2)) != 0 && parseFloat(divisor) != 1) {
			rrefLatex += "$\\xrightarrow{" + ((Math.abs(divisor) == 1 ? parseFloat(divisor.toFixed(2)) : ("1/" + parseFloat(divisor.toFixed(2)))) + "R" + (r+1)) + "}$\n";
			multiplyRow(matrix, r, 1 / divisor);
			rrefLatex += printMatrix(matrix);
			operationCounter++;

			if(operationCounter % 3 == 0){
				rrefLatex += "\n\\vspace{12pt}\n\n"
			}
		}

		for (let i = 0; i < rowCount; i++) {
			if (i !== r) {
				rrefLatex += "$\\xrightarrow{" + ("R_" + (i+1) + " + " + ((matrix[i][lead] < 0) ? parseFloat(Math.abs(matrix[i][lead]).toFixed(2)) : ("-" + parseFloat(matrix[i][lead].toFixed(2)))) + "R_" + (r+1)) + "}$\n";
				addRows(matrix, r, i, -matrix[i][lead]);
				rrefLatex += printMatrix(matrix);
				operationCounter++;

				if(operationCounter % 3 == 0){
					rrefLatex += "\n\\vspace{12pt}\n\n"
				}
			}
		}
		lead++;
	}
	console.log(rrefLatex);
	document.getElementById("latex_output").value = rrefLatex;
	return roundMatrix(matrix);
	
}

function update() {
    // Clear list
    // document.getElementById("list").innerHTML = "";
    // Add all elements of items back to the list
    // for(let item in items) {
        //document.getElementById("list").innerHTML += `<div id="${item}Div"><input type="checkbox" onchange="checkBox(this)" id="${item}">${item}</div>`;
    // }
}



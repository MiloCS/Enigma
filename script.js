let shiftvalue = -2
let coords

let plugboardRows = ["QWERTYUIO", "PASDFGHJK", "LZXCVBNM"]
let PLUGBOARD_XSPACE = 50
let PLUGBOARD_YSPACE = 70
let PLUGBOARD_XOFFSET = 36
let PLUGBOARD_YOFFSET = 50

let PLUGBOARD_LETTERRADIUS = 15


window.onload = () => {
	let cinput = document.getElementById("cinput")
	let display = document.getElementById("display")


	cinput.oninput = () =>  {
		display.innerText = cipherize(cinput.value, shiftvalue)
	}

	//canvas setup
	setupCanvas()

}

function cipherize(text, shift) {
	let result = "";
	for (let i=0; i<text.length; i++) {
		result = result.concat(shiftChar(text.charCodeAt(i), shift))
	}
	return result
}

function shiftChar(charCode, shift) {
	if (!inRange(charCode, 65, 90) && !inRange(charCode, 97, 122)) {
		return String.fromCharCode(charCode)
	}
	let shifted = charCode + shift
	while ((inRange(charCode, 65, 90) && shifted < 65) || (inRange(charCode, 97, 122) && shifted < 97)) {
		shifted+=26
	}
	while ((inRange(charCode, 65, 90) && shifted > 90) || (inRange(charCode, 97, 122) && shifted > 122)) {
		shifted-=26
	}
	return String.fromCharCode(shifted)
}

function inRange(x, a, b) {
	return x >= a && x <= b
}

function getCanvasPosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return {x: x, y: y}
}


function getPlugBoardLetterFromCoords(coords) {
	tempx = coords.x - PLUGBOARD_XOFFSET
	tempy = coords.y - PLUGBOARD_YOFFSET

	xindex = Math.round(tempx/PLUGBOARD_XSPACE)
	yindex = Math.round(tempy/PLUGBOARD_YSPACE)

	return plugboardRows[yindex].charAt(xindex)
}


//canvas setup code here
function setupCanvas() {
	let canvas = document.getElementById('c')
	let ctx = canvas.getContext('2d')

	canvas.addEventListener("mousedown", (e) => {
		drawPlugboard(ctx, canvas)
		// ctx.beginPath()
		// let coord = getCanvasPosition(canvas, e)
		// ctx.arc(coord.x, coord.y, 10, 0, 2 * Math.PI)
		// ctx.stroke()
		coords = getCanvasPosition(canvas, e)
		console.log(getPlugBoardLetterFromCoords(coords))
	})
	canvas.addEventListener("mouseup", (e) => {
		drawPlugboard(ctx, canvas)
		coords = getCanvasPosition(canvas, e)
		console.log(getPlugBoardLetterFromCoords(coords))
		coords = null
	})
	canvas.addEventListener("mousemove", (e) => {
		drawPlugboard(ctx, canvas)
		if (coords) {
			ctx.beginPath()
			ctx.moveTo(coords.x, coords.y)
			newCoords = getCanvasPosition(canvas, e)
			ctx.lineTo(newCoords.x, newCoords.y)
			ctx.stroke()
		}
	})
	drawPlugboard(ctx, canvas)
}


function drawPlugboard(ctx, canvas) {
	ctx.fillStyle = "#8a6e37"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	for (let i=0; i<plugboardRows.length; i++) {
		letters = Array.from(plugboardRows[i])
		for (let j=0; j<letters.length; j++) {
			ctx.beginPath()
			centerX = j*PLUGBOARD_XSPACE+PLUGBOARD_XOFFSET
			centerY = i*PLUGBOARD_YSPACE+PLUGBOARD_YOFFSET
			ctx.fillStyle = "grey"
			ctx.arc(centerX + 3, centerY - 5, PLUGBOARD_LETTERRADIUS, 0, 2*Math.PI)
			ctx.fill()
			ctx.fillStyle = "black"
			ctx.fillText(letters[j], centerX, centerY)
		}
	}

}

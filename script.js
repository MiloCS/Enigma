let shiftvalue = -2
let coords
let currLen = 0

//plugboard values
let plugboardRows = ["QWERTYUIO", "PASDFGHJK", "LZXCVBNM"]
let PLUGBOARD_XSPACE = 50
let PLUGBOARD_YSPACE = 70
let PLUGBOARD_XOFFSET = 36
let PLUGBOARD_YOFFSET = 50
let PLUGBOARD_LETTERRADIUS = 15
let tempConnectedLetter = null
let tempLetterCoords = null
let plugboardRules = new Map()
let plugboardPairs = []
let plugboardCanvas
let plugboardContext

//lightboard values
let LIGHTBOARD_XSPACE = 45
let LIGHTBOARD_YSPACE = 65
let LIGHTBOARD_XOFFSET = 36
let LIGHTBOARD_YOFFSET = 30
let lightboardCanvas
let lightboardContext

let litupletter = ""

//rotor canvas values
let rotorsInUse = ["I", "II", "III"]

//generic main window code / reusable code

window.onload = () => {
	let cinput = document.getElementById("cinput")
	let display = document.getElementById("translated")


	cinput.oninput = () =>  {
		cinput.value = cinput.value.toUpperCase()
		display.innerText = plugboardize(cinput.value)
		
		if (cinput.value.length > currLen) {
			litupletter = cinput.value.charAt(cinput.value.length - 1)
			drawLightboard(lightboardContext, lightboardCanvas)
			clearLightboard(litupletter)
		}
		currLen = cinput.value.length
	}

	//canvas setup
	setupPlugBoardCanvas()
	setupLightBoardCanvas()
	setupRotorsCanvas()
}

//async functions for dealing with lighting up lightboard for a second and then making it dark again

function resolveAfter1Second() {
	return new Promise(resolve => {
	    setTimeout(() => {
	      resolve('resolved');
	    }, 500);
  });
}

async function clearLightboard(letter) {
	await resolveAfter1Second()
	if (litupletter == letter) {
		litupletter = null
	}
	drawLightboard(lightboardContext, lightboardCanvas)
}

//

function getCanvasPosition(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return {x: x, y: y}
}

//end of generic section

//cipherization section of code: old version of this code
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

///end of cipherization section


//plugboard section
function plugboardize(text) {
	let result = ""
	for (let i=0; i <text.length; i++) {
		letter = text.charAt(i)
		if (plugboardRules.has(letter)) {
			result = result.concat(plugboardRules.get(letter))
		}
		else {
			result = result.concat(letter)
		}
	}
	return result
}


function getPlugBoardLetterFromCoords(coords) {
	tempx = coords.x - PLUGBOARD_XOFFSET
	tempy = coords.y - PLUGBOARD_YOFFSET
	indices = getLetterIndices(coords)

	dist = Math.hypot(tempx - indices.x * PLUGBOARD_XSPACE, tempy - indices.y * PLUGBOARD_YSPACE)
	if (dist > PLUGBOARD_LETTERRADIUS) {
		return null
	}

	return plugboardRows[yindex].charAt(xindex)
}

function getLetterIndices(coords) {
	tempx = coords.x - PLUGBOARD_XOFFSET
	tempy = coords.y - PLUGBOARD_YOFFSET

	xindex = Math.round(tempx/PLUGBOARD_XSPACE)
	yindex = Math.round(tempy/PLUGBOARD_YSPACE)

	return {x: xindex, y: yindex}
}

function getClosestLetterCoords(coords) {
	indices = getLetterIndices(coords)
	return {x: indices.x * PLUGBOARD_XSPACE + PLUGBOARD_XOFFSET, y: indices.y * PLUGBOARD_YSPACE + PLUGBOARD_YOFFSET}
}


//canvas setup code here
function setupPlugBoardCanvas() {
	let canvas = document.getElementById('plugboard')
	let ctx = canvas.getContext('2d')

	plugboardCanvas = canvas
	plugboardContext = ctx

	canvas.addEventListener("mousedown", (e) => {
		drawPlugboard(ctx, canvas)
		// ctx.beginPath()
		// let coord = getCanvasPosition(canvas, e)
		// ctx.arc(coord.x, coord.y, 10, 0, 2 * Math.PI)
		// ctx.stroke()
		coords = getCanvasPosition(canvas, e)
		tempConnectedLetter = getPlugBoardLetterFromCoords(coords)
		tempLetterCoords = getClosestLetterCoords(coords)
	})
	canvas.addEventListener("mouseup", (e) => {
		drawPlugboard(ctx, canvas)
		coords = getCanvasPosition(canvas, e)
		otherConnectedLetter = getPlugBoardLetterFromCoords(coords)
		if (tempConnectedLetter == otherConnectedLetter) {
			console.log("rule cannot between same letter")
		}
		else if (plugboardRules.has(tempConnectedLetter) || plugboardRules.has(otherConnectedLetter)) {
			console.log("letter already in plugboard rules")
		}
		else if (tempConnectedLetter == null || otherConnectedLetter == null) {
			console.log("letter not selected")
		}
		else if (tempConnectedLetter != null && otherConnectedLetter != null) {
			plugboardRules.set(tempConnectedLetter, otherConnectedLetter)
			plugboardRules.set(otherConnectedLetter, tempConnectedLetter)
			plugboardPairs.push(getClosestLetterCoords(coords))
		}
		tempConnectedLetter = null
		coords = null
	})
	canvas.addEventListener("mousemove", (e) => {
		drawPlugboard(ctx, canvas)
		if (coords) {
			ctx.beginPath()
			ctx.moveTo(tempLetterCoords.x, tempLetterCoords.y)
			newCoords = getCanvasPosition(canvas, e)
			ctx.lineWidth = 5
			ctx.lineTo(newCoords.x, newCoords.y)
			ctx.stroke()
			ctx.beginPath()
			ctx.arc(tempLetterCoords.x, tempLetterCoords.y, PLUGBOARD_LETTERRADIUS, 0, 2 * Math.PI)
			ctx.stroke()
		}
	})
	drawPlugboard(ctx, canvas)
}


function drawPlugboard(ctx, canvas) {
	ctx.fillStyle = "#adadad"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.fill()

	for (let i=0; i<plugboardRows.length; i++) {
		letters = Array.from(plugboardRows[i])
		for (let j=0; j<letters.length; j++) {
			ctx.beginPath()
			centerX = j*PLUGBOARD_XSPACE+PLUGBOARD_XOFFSET
			centerY = i*PLUGBOARD_YSPACE+PLUGBOARD_YOFFSET
			ctx.fillStyle = "grey"
			ctx.arc(centerX, centerY, PLUGBOARD_LETTERRADIUS, 0, 2*Math.PI)
			ctx.fill()
			ctx.font = "1em Courier"
			ctx.fillStyle = "black"
			ctx.fillText(letters[j], centerX - 4, centerY + 6)
		}
	}

}

//end of plugboard code

//lightboard code
function setupLightBoardCanvas() {
	lightboardCanvas = document.getElementById('lightboard')
	lightboardContext = lightboardCanvas.getContext('2d')

	drawLightboard(lightboardContext, lightboardCanvas)
}

function drawLightboard(ctx, canvas) {
	ctx.fillStyle = "#aa8e57"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.fill()

	for (let i=0; i<plugboardRows.length; i++) {
		letters = Array.from(plugboardRows[i])
		for (let j=0; j<letters.length; j++) {
			ctx.beginPath()
			centerX = j*LIGHTBOARD_XSPACE+LIGHTBOARD_XOFFSET
			centerY = i*LIGHTBOARD_YSPACE+LIGHTBOARD_YOFFSET
			if (letters[j] != litupletter) {
				ctx.fillStyle = "darkgrey"
			}
			else {
				ctx.fillStyle = "white"
			}
			ctx.arc(centerX, centerY, PLUGBOARD_LETTERRADIUS, 0, 2*Math.PI)
			ctx.fill()
			ctx.fillStyle = "black"
			ctx.font = "1em Courier"
			ctx.fillText(letters[j], centerX - 4, centerY + 6)
		}
	}
}

//end of lightboard code


//rotors canvas code

function setupRotorsCanvas() {
	let rotorsCanvas = document.getElementById('rotors')
	let rotorsContext = rotorsCanvas.getContext('2d')

	drawRotors(rotorsContext, rotorsCanvas) 
}

function drawRotors(ctx, canvas) {
	ctx.fillStyle = "#adadad"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.fill()
	for (let i=0; i<rotorsInUse.length; i++) {
		drawRotor(ctx, canvas, rotorsInUse[i], i)
	}
}

function drawRotor(ctx, canvas, rotorNumber, position) {
	ctx.beginPath()
	ctx.fillStyle = "#888888"

	let centerX = 100 + position * 120
	let centerY = canvas.height/2
	let yOff = canvas.height/2.5


	ctx.fillRect(centerX - 13, centerY - yOff, 26, 2 * yOff)
	ctx.fill()

	ctx.fillStyle = "black"
	ctx.font = "1em Courier"
	ctx.fillText(rotorNumber, centerX + 15, centerY)
}

function drawReflector() {

}

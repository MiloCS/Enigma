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
//code related to the implementation of the plugboard
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
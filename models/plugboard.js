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

//gets the letter the coords are inside, or null if they aren't inside a letter
function getPlugBoardLetterFromCoords(coords) {
	let tempx = coords.x - PLUGBOARD_XOFFSET
	let tempy = coords.y - PLUGBOARD_YOFFSET
	let indices = getLetterIndices(coords)

	let dist = Math.hypot(tempx - indices.x * PLUGBOARD_XSPACE, tempy - indices.y * PLUGBOARD_YSPACE)
	if (dist > PLUGBOARD_LETTERRADIUS) {
		return null
	}

	return plugboardRows[indices.y].charAt(indices.x)
}

function getLetterIndices(coords) {
	let tempx = coords.x - PLUGBOARD_XOFFSET
	let tempy = coords.y - PLUGBOARD_YOFFSET

	let xindex = Math.round(tempx/PLUGBOARD_XSPACE)
	let yindex = Math.round(tempy/PLUGBOARD_YSPACE)

	return {x: xindex, y: yindex}
}

//this is different than getPlugBoardLetterFromCords because it returns the central coords of a letter, not the letter
function getClosestLetterCoords(coords) {
	let indices = getLetterIndices(coords)
	return {x: indices.x * PLUGBOARD_XSPACE + PLUGBOARD_XOFFSET, y: indices.y * PLUGBOARD_YSPACE + PLUGBOARD_YOFFSET}
}

//function for selecting a random line color so that lines can be varied a bit and distinguished
function selectRandomLineColor() {
	let rand = String(Math.floor(Math.random() * 50 + 10))
	return "#".concat(rand.repeat(3))
}


//canvas setup code here
function setupPlugBoardCanvas() {
	let canvas = document.getElementById('plugboard')
	let ctx = canvas.getContext('2d')

	plugboardCanvas = canvas
	plugboardContext = ctx

	canvas.addEventListener("mousedown", (e) => {
		tempColor = selectRandomLineColor()
		coords = getCanvasPosition(canvas, e)
		tempConnectedLetter = getPlugBoardLetterFromCoords(coords)
		tempLetterCoords = getClosestLetterCoords(coords)
		drawPlugboard(ctx, canvas, e)
	})
	canvas.addEventListener("mouseup", (e) => {
		let secondCoords = getCanvasPosition(canvas, e)
		let otherConnectedLetter = getPlugBoardLetterFromCoords(secondCoords)
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
			plugboardPairs.push({"first": getClosestLetterCoords(coords), "second":getClosestLetterCoords(secondCoords), "color": tempColor})
		}
		tempConnectedLetter = null
		coords = null
		drawPlugboard(ctx, canvas, e)
	})
	canvas.addEventListener("mousemove", (e) => {
		drawPlugboard(ctx, canvas, e)
	})
	drawPlugboard(ctx, canvas, new MouseEvent("dummy"))
}

function circleLetter(ctx, coords) {
	ctx.moveTo(coords.x, coords.y)
	ctx.beginPath()
	ctx.arc(coords.x, coords.y, PLUGBOARD_LETTERRADIUS, 0, 2 * Math.PI)
	ctx.stroke()
}

function lineBetween(ctx, coords1, coords2) {	
	ctx.lineWidth = 5
	ctx.beginPath()
	ctx.moveTo(coords1.x, coords1.y)
	ctx.lineTo(coords2.x, coords2.y)
	ctx.stroke()
}

function connectLetters(ctx, coords1, coords2, color) {
	ctx.strokeStyle = color
	circleLetter(ctx, coords1)
	lineBetween(ctx, coords1, coords2)
	circleLetter(ctx, coords2)
}


function drawPlugboard(ctx, canvas, e) {
	ctx.fillStyle = "#adadad"
	ctx.fillRect(0, 0, canvas.width, canvas.height)

	ctx.fill()

	plugboardPairs.forEach((pair) => {
		connectLetters(ctx, pair.first, pair.second, pair.color)
	})

	if (coords) {
		ctx.strokeStyle = tempColor
		lc = getClosestLetterCoords(coords)
		circleLetter(ctx, lc)
		newCoords = getCanvasPosition(canvas, e)

		endLetter = getPlugBoardLetterFromCoords(newCoords)
		if (endLetter != null) {
			nlc = getClosestLetterCoords(newCoords)
			circleLetter(ctx, nlc)
			lineBetween(ctx, lc, nlc)
		}
		else {
			ctx.fillStyle = "black"
			ctx.moveTo(newCoords.x, newCoords.y)
			ctx.beginPath()
			ctx.arc(newCoords.x, newCoords.y, 8, 0, 2 * Math.PI)
			ctx.fill()
			lineBetween(ctx, lc, newCoords)
		}
	}

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
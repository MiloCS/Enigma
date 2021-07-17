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


//main lightboard implementation
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

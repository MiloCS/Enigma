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

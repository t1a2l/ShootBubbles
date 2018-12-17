// Tal Rofeh 301905154
ShootBubbles = window.ShootBubbles || {};
ShootBubbles = function(){
	
	const FPS = 50;
    let timeFrame = 1000 / FPS;
	let totalTime = 0;
	let lastTimeStamp = 0;
	let radius; // Bubble radius
	let w, h; // Canvas width and height
	let bubbleArr = []; // Array that holds all the bubbles in the game
	let userPoints = 0; // The points of the player
	let givePointsArr = []; // Array that has letters that give points to the player
	let takePointsArr = []; // Array that has letters that take points from the player
	let numOfBubbles; // Number of bubbles in the game
	let givePointsNum; // Number of points given when clicking a bubble
	let takePointsNum; // Number of points taken when clicking a bubble
	let canvas; // The game canvas
	let context; // The game context
	let explosions = []; 
	let speedLow, speedHigh; // The minimum and maximum speed of the bubbles
	let GameOver = false; // Check if the game has ended (the player got less then zero points)
	
	
	let initModule = function(BubbleRadius, BubbleNumber, givePointsArray, givePointsNumber, takePointsArray, takePointsNumber, LowSpeed, HighSpeed){ // Init that game module
		canvas = document.getElementById("canvas");
		Points = document.getElementById('points')
		Points.innerHTML = "Points: " + userPoints;
		//canvas.width = window.innerWidth;
		//canvas.height = window.innerHeight;
		w = canvas.width;
        h = canvas.height;
		if(!BubbleRadius || BubbleRadius <= 0 || !Number.isInteger(BubbleRadius)) // Init bubble radius
		{
			radius = 50;
		}
		else
		{
			radius = BubbleRadius;
		}
		if(!BubbleNumber || BubbleNumber <= 0 || !Number.isInteger(BubbleNumber)) // Init number of bubbles
		{
			numOfBubbles = 10;
		}
		else
		{
			numOfBubbles = BubbleNumber;
		}
		bubbleArr.length = numOfBubbles; // Init bubble array length
		if(!givePointsArray || !Array.isArray(givePointsArray)) // Init array of letters that give points
		{
			givePointsArr = ['a', 'e', 'i', 'o', 'u'];
		}
		else
		{
			givePointsArr = givePointsArray;
		}
		if(!givePointsNumber || givePointsNumber < 0 || !Number.isInteger(givePointsNumber)) // Init number of points to give
		{
			givePointsNum = 5;
		}
		else
		{
			givePointsNum = givePointsNumber;
		}
		if(!takePointsArray || !Array.isArray(takePointsArray)) // Init array of letters that take points
		{
			takePointsArr = ['c', 'm', 'z', 'y', 'q'];
		}
		else
		{
			takePointsArr = takePointsArray;
		}
		if(!takePointsNumber || takePointsNumber < 0 || !Number.isInteger(takePointsNumber)) // Init number of points to take
		{
			takePointsNum = 2;
		}
		else
		{
			takePointsNum = takePointsNumber;
		}
		if(!LowSpeed || LowSpeed < 0 || !Number.isInteger(LowSpeed)) // Init minimum speed of bubble
		{
			speedLow = 0;
		}
		else
		{
			speedLow = LowSpeed;
		}
		if(!HighSpeed || HighSpeed < 0 || !Number.isInteger(HighSpeed)) // Init maximum speed of bubble
		{
			speedHigh = 1;
		}
		else
		{
			speedHigh = HighSpeed;
		}
		for(let i = 0; i < numOfBubbles; i++) // Init all bubbles
		{
			bubbleArr[i] = [];
			bubbleArr[i] = InitBubble(bubbleArr[i]);
		}
	
		canvas.addEventListener('click', (e) => { // Check if a bubble has been clicked on
			const mousePoint = {
				x: e.clientX,
				y: e.clientY
			};
			for(let i = 0; i < numOfBubbles; i++)
			{
				if (isIntersect(mousePoint, bubbleArr[i])) // If a bubble has been clicked
				{
					bubbleArr[i].clicked = true;
					let letter = bubbleArr[i].letter;
					// Check if player clicked a letter that give points
					if(givePointsArr.indexOf(letter) != -1 && takePointsArr.indexOf(letter) == -1) 
						userPoints = userPoints + givePointsNum;
					// Check if player clicked a letter that take points
					else if(givePointsArr.indexOf(letter) == -1 && takePointsArr.indexOf(letter) != -1) 
						userPoints = userPoints - takePointsNum;
					// Check if player clicked a letter that give and take points
					else if(givePointsArr.indexOf(letter) != -1 && takePointsArr.indexOf(letter) != -1)
						userPoints = userPoints + 0;
					else // If non of the above give 1 point
						userPoints++;
					Points.innerHTML = "Points: " + userPoints; // Show the result points on screen
				}
			}

		});
				
		mainLoop(0);
	}
		
	let mainLoop = function(timeStamp) { // mainLoop controls the FPS
		totalTime += timeStamp - lastTimeStamp;
        lastTimeStamp = timeStamp;
		while(totalTime > timeFrame) {
            update(timeFrame);
            totalTime -= timeFrame;
        }
		draw();
		if(GameOver == false) // While the player score is not negative continue playing
			requestAnimationFrame(mainLoop);
	}
	
	let update = function(timeFrame) { // Move the bubble acoording to the timeFrame
		for(let i = 0; i < numOfBubbles; i++)
		{
			// Bubble's distance to move up
			bubbleArr[i].distance = bubbleArr[i].distance + bubbleArr[i].speed * timeFrame; 
			bubbleArr[i].CordY = h - bubbleArr[i].distance; 
			if(bubbleArr[i].CordY <= -radius*2) // Bubble at the end of the screen - create new bubble instead
			{
				bubbleArr[i] = InitBubble(bubbleArr[i]);
			}
		}
		
		explosions.forEach(function(e, ind, explosions) { // Control the explosion effect
            if(e.over())
                explosions.splice(ind, 1);
            else
                e.update();
        });
    }
	    
	let draw = function(){ // Draw the bubbles
		context = canvas.getContext('2d');
		clearScreen();
		for(let i = 0; i < numOfBubbles; i++)
		{
			if(bubbleArr[i].clicked == false) // If no bubble has been clicked
			{
				context.beginPath();
				context.fillStyle = bubbleArr[i].color;
				context.arc(bubbleArr[i].CordX, bubbleArr[i].CordY, radius, 0, 2 * Math.PI, false);
				context.fill();
				context.font = "30px Georgia";
				context.fillStyle = 'white';
				context.textAlign = 'center';
				context.fillText(bubbleArr[i].letter, bubbleArr[i].CordX, bubbleArr[i].CordY);

			}
			else // If a bubble has been clicked
			{
				let e = new Explosion({x : bubbleArr[i].CordX, y : bubbleArr[i].CordY}); // Explode effect
				explosions.push(e);
				bubbleArr[i] = InitBubble(bubbleArr[i]); 
			}
		}
		explosions.forEach(e => e.draw(context));
		if(userPoints < 0) // If player points are negative
		{
			alert("Game over");
			GameOver = true;
			location.reload();
		}
	}
	
	let InitBubble = function(bubble){ // Init a bubble
		bubble.CordX = randomLocation();
		bubble.CordY = 0 + radius;
		bubble.color = randomColor();
		bubble.letter = randomLetter();
		bubble.speed = randomSpeed();
		bubble.distance = 0;
		bubble.clicked = false;
		return bubble;
	}
	
	let randomSpeed = function(){ // Get random speed acoording to min and max speed
		let BubbleSpeed = (Math.random() * (speedHigh-speedLow)) + speedLow;
		return BubbleSpeed;
	}
	
	let clearScreen = function(){ // Clear the canvas
		let context = this.canvas.getContext('2d');
		let w = this.canvas.width;
        let h = this.canvas.height;
		context.clearRect(0, 0, w, h);
    }
	
	let randomLocation = function(){ // Bubble random starting position
		let rand = Math.floor(Math.random() * w);
		return rand;
	}
	
	let randomColor = function(){ // Bubble random color
		let letters = '0123456789ABCDEF';
		let color = '#';
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		while(color == "#ffffff") // If the random color is white, try again
		{
			color = randomColor();
		}
		return color;
	}
	
	let randomLetter = function(){ // Bubble random letter
		let num = Math.floor((Math.random() * 26) + 97);
		let letter = String.fromCharCode(num);
		return letter;
	}
	
	function isIntersect(point, circle) { // Check if a bubble has been clicked
		return Math.sqrt((point.x-circle.CordX) ** 2 + (point.y - circle.CordY) ** 2) < radius;
	}

	return {initModule};
		
}();
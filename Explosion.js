Explosion = window.Explosion || {};
Explosion = function(options) {
    let {x, y} = options;
    let img = new Image();
    let width, height;
    img.src = "BubblePop.png";
    
    let frames = 13, currentFrame = 0, frameWidth;
    let ticksCount = 0, ticksPerUpdate = 4;
    
    img.onload = function() {
        frameWidth = img.width / frames;
    };
	
    let update = function(delta) {
        ticksCount++;
        if(ticksCount == ticksPerUpdate) {
            if(currentFrame < frames-1)
                currentFrame++;
            ticksCount = 0;
        }
		
	};
	
	let draw = function(context) {
		context.drawImage(img, currentFrame * frameWidth, 0, frameWidth, img.height, x, y, frameWidth, img.height);
	}
    
    
    let over = function() {
        return currentFrame == frames - 1;
    };
    return {update, draw, over};
};
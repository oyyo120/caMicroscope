function caDrawHelper(){
	this.version = 0.5;
}

caDrawHelper.prototype.getRect = function(start,end){
	if(start < end){
		return [start, end-start]
	}else{
		return [end, start-end]
	}
}

caDrawHelper.prototype.forRect = function(start,end){
	let [x,width] = this.getRect(start[0],end[0]);
	let [y,height] = this.getRect(start[1],end[1]);
	return [x,y,width,height];
}

caDrawHelper.prototype.forSquare = function(start,end){
	let dx = Math.abs(start[0] - end[0]);
	let dy = Math.abs(start[1] - end[1]);
	let length = Math.max(dx,dy); // Math.max(dx,dy);
	let x = start[0] < end[0] ? start[0]:start[0] - length;
	let y = start[1] < end[1] ? start[1]:start[1] - length;
	return [x,y,length,length];
}

caDrawHelper.prototype.drawRectangle = function(ctx, start, end, isSquare = false){
	// draw rect
	
	// create a new path
	const path = new Path();

	// starting draw rectangle
	let [x, y, width, height] = isSquare?this.forSquare(start,end):this.forRect(start,end);
	path.rect(x, y, width, height);
	
	// close path and set style
	path.closePath()
	path.stroke(ctx);
	path.fill(ctx);
	
	// return points and path 
	return {
		points:[
			[x,y],
			[x+width,y],
			[x+width,y+height],
			[x,y+height]
		],
		path:path
	};
}
caDrawHelper.prototype.drawMultiline = function(ctx,list){
	for (var i = 1; i < list.length; i++) {
		this.drawLine(ctx,list[i-1],list[i]);
	}
}
caDrawHelper.prototype.drawLine = function(ctx, start, end){
	// draw line
	ctx.beginPath();
	ctx.moveTo(start[0], start[1]);
	ctx.lineTo(end[0],end[1]);
	ctx.closePath()
	ctx.stroke();
}

caDrawHelper.prototype.drawPolygon = function(ctx, paths){
	// draw drawPolygon
	// create a new path
	const path = new Path();

	// starting draw drawPolygon
	path.moveTo(paths[0][0], paths[0][1]);
	for (var i = 1; i < paths.length-1; i++) {
		path.lineTo(paths[i][0],paths[i][1]);
	}

	// close path and set style
	path.closePath()
	path.stroke(ctx);
	path.fill(ctx);
	// return points and path
	return path
}
caDrawHelper.prototype.draw = function(ctx, image_data){
	for (let i = 0; i < image_data.length; i++) {
		const polygon = image_data[i];
		const style = polygon.properties.style;
		// other styles
		this.setStyle(ctx, style);
		// fill color
		ctx.fillStyle = hexToRgbA(style.color,0.3);
		// if there is path using path to draw
		if(polygon.geometry.path){
			polygon.geometry.path.strokeAndFill(ctx);
			continue;
		}

		// if no data 
		const points = polygon.geometry.coordinates[0];
		polygon.geometry.path = this.drawPolygon(ctx, points);
	}

}
caDrawHelper.prototype.setStyle = function(ctx,style){
	ctx.strokeStyle = style.color;
	ctx.lineJoin = style.lineJoin;
	ctx.lineCap = style.lineCap;
	ctx.lineWidth = style.lineWidth;
}
caDrawHelper.prototype.clearCanvas = function(canvas){
	let ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

var DrawHelper = new caDrawHelper();
OpenSeadragon.DrawHelper = DrawHelper;
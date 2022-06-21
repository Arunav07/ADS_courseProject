
// "Class" animatedCircle

import AnimatedObject from './AnimatedObject.js';
import { UndoBlock } from './UndoFunctions.js';

export default class AnimatedHighlightCircle extends AnimatedObject {
	constructor(objectID, foregroundColor, radius) {
		super();
		this.objectID = objectID;
		this.radius = radius;
		this.thickness = 4;
		this.foregroundColor = foregroundColor;
		this.x = 0;
		this.y = 0;
	}

	draw(context) {
		context.globalAlpha = this.alpha;
		context.strokeStyle = this.foregroundColor;
		context.lineWidth = this.thickness;
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		context.closePath();
		context.stroke();
	}

	createUndoDelete() {
		return new UndoDeleteHighlightCircle(
			this.objectID,
			this.x,
			this.y,
			this.foregroundColor,
			this.radius,
			this.layer,
			this.alpha,
			this.highlighted,
			this.highlightColor,
		);
	}
}

class UndoDeleteHighlightCircle extends UndoBlock {
	constructor(
		objectID,
		x,
		y,
		foregroundColor,
		radius,
		layer,
		alpha,
		highlighted,
		highlightColor,
	) {
		super();
		this.objectID = objectID;
		this.x = x;
		this.y = y;
		this.foregroundColor = foregroundColor;
		this.radius = radius;
		this.layer = layer;
		this.alpha = alpha;
		this.highlighted = highlighted;
		this.highlightColor = highlightColor;
	}

	undoInitialStep(world) {
		world.addHighlightCircleObject(this.objectID, this.foregroundColor, this.radius);
		world.setNodePosition(this.objectID, this.x, this.y);
		world.setLayer(this.objectID, this.layer);
		world.setAlpha(this.objectID, this.alpha);
		world.setHighlight(this.objectID, this.highlighted, this.highlightColor);
	}
}

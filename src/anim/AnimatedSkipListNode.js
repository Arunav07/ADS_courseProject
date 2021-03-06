
import AnimatedObject from './AnimatedObject.js';
import { UndoBlock } from './UndoFunctions.js';

const NINF = '\u2212\u221E'; // Negative infinity
const PINF = '\u221E'; // Positive infinity

export default class AnimatedSkipListNode extends AnimatedObject {
	constructor(objectID, label, w, h, backgroundColor, foregroundColor) {
		super();

		this.objectID = objectID;

		this.w = w;
		this.h = h;

		this.backgroundColor = backgroundColor;
		this.foregroundColor = foregroundColor;
		this.highlighted = false;

		this.label = label;
		this.labelPosX = 0;
		this.labelPosY = 0;
		this.labelColor = foregroundColor;
	}

	left() {
		return this.x - this.w / 2;
	}

	right() {
		return this.x + this.w / 2;
	}

	top() {
		return this.y - this.h / 2;
	}

	bottom() {
		return this.y + this.h / 2;
	}

	resetTextPosition() {
		this.labelPosY = this.y;
		this.labelPosX = this.x;
	}

	getTailPointerAttachPos(fromX, fromY, anchor) {
		switch (anchor) {
			case 0: // Top
				return [this.x, this.top()];
			case 1: // Bottom
				return [this.x, this.bottom()];
			case 2: // Left
				return [this.left(), this.y];
			case 3: // Right
				return [this.right(), this.y];
			default:
				return this.getClosestCardinalPoint(fromX, fromY);
		}
	}

	getHeadPointerAttachPos(fromX, fromY) {
		return this.getClosestCardinalPoint(fromX, fromY); // Normal anchor
	}

	setWidth(w) {
		this.w = w;
		this.resetTextPosition();
	}

	setHeight(h) {
		this.h = h;
		this.resetTextPosition();
	}

	getWidth() {
		return this.w;
	}

	getHeight() {
		return this.h;
	}

	draw(context) {
		const startX = this.left();
		const startY = this.top();

		if (this.highlighted) {
			context.strokeStyle = '#ff0000';
			context.fillStyle = '#ff0000';

			context.beginPath();
			context.moveTo(startX - this.highlightDiff, startY - this.highlightDiff);
			context.lineTo(startX + this.w + this.highlightDiff, startY - this.highlightDiff);
			context.lineTo(
				startX + this.w + this.highlightDiff,
				startY + this.h + this.highlightDiff,
			);
			context.lineTo(startX - this.highlightDiff, startY + this.h + this.highlightDiff);
			context.lineTo(startX - this.highlightDiff, startY - this.highlightDiff);
			context.closePath();
			context.stroke();
			context.fill();
		}
		context.strokeStyle = this.foregroundColor;
		context.fillStyle = this.backgroundColor;

		context.beginPath();
		context.moveTo(startX, startY);
		context.lineTo(startX + this.w, startY);
		context.lineTo(startX + this.w, startY + this.h);
		context.lineTo(startX, startY + this.h);
		context.lineTo(startX, startY);
		context.closePath();
		context.stroke();
		context.fill();

		context.textAlign = 'center';
		context.font = '12px Arial';
		context.textBaseline = 'middle';
		context.lineWidth = 2;

		this.resetTextPosition();
		context.fillStyle = this.labelColor;
		if (this.label === NINF || this.label === PINF) {
			context.font = '18px sans-serif';
		}
		context.fillText(this.label, this.labelPosX, this.labelPosY);
	}

	setTextColor(color) {
		this.labelColor = color;
	}

	getTextColor() {
		return this.labelColor;
	}

	getText() {
		return this.label;
	}

	setText(newText) {
		this.label = newText;
		this.resetTextPosition();
	}

	setHighlight(value) {
		if (value !== this.highlighted) {
			this.highlighted = value;
		}
	}

	createUndoDelete() {
		return new UndoDeleteSkipList(
			this.objectID,
			this.label,
			this.w,
			this.h,
			this.x,
			this.y,
			this.labelColor,
			this.backgroundColor,
			this.foregroundColor,
			this.layer,
			this.highlighted,
			this.highlightColor,
		);
	}
}

class UndoDeleteSkipList extends UndoBlock {
	constructor(
		objectID,
		label,
		w,
		h,
		x,
		y,
		labelColor,
		backgroundColor,
		foregroundColor,
		layer,
		highlighted,
		highlightColor,
	) {
		super();
		this.objectID = objectID;
		this.label = label;
		this.w = w;
		this.h = h;
		this.x = x;
		this.y = y;
		this.labelColor = labelColor;
		this.backgroundColor = backgroundColor;
		this.foregroundColor = foregroundColor;
		this.layer = layer;
		this.highlighted = highlighted;
		this.highlightColor = highlightColor;
	}

	undoInitialStep(world) {
		world.addSkipListObject(
			this.objectID,
			this.label,
			this.w,
			this.h,
			this.backgroundColor,
			this.foregroundColor,
		);
		world.setTextColor(this.objectID, this.labelColor);
		world.setNodePosition(this.objectID, this.x, this.y);
		world.setLayer(this.objectID, this.layer);
		world.setHighlight(this.objectID, this.highlighted, this.highlightColor);
	}
}

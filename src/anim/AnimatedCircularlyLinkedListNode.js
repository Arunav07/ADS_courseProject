
import AnimatedObject from './AnimatedObject.js';
import { UndoBlock } from './UndoFunctions.js';

export default class AnimatedCircularlyLinkedListNode extends AnimatedObject {
	constructor(objectID, label, w, h, linkPercent, backgroundColor, foregroundColor) {
		super();

		this.objectID = objectID;

		this.w = w;
		this.h = h;

		this.backgroundColor = backgroundColor;
		this.foregroundColor = foregroundColor;
		this.highlighted = false;

		this.linkPercent = linkPercent;
		this.nullPointer = false;

		this.label = label;
		this.labelPosX = 0;
		this.labelPosY = 0;
		this.labelColor = foregroundColor;
	}

	setNull(np) {
		if (this.nullPointer !== np) {
			this.nullPointer = np;
		}
	}

	getNull() {
		return this.nullPointer;
	}

	left() {
		return this.x - (this.w * (1 - this.linkPercent)) / 2;
	}

	right() {
		return this.x + (this.w * (this.linkPercent + 1)) / 2;
	}

	top() {
		return this.y - this.h / 2.0;
	}

	bottom() {
		return this.y + this.h / 2.0;
	}

	resetTextPosition() {
		this.labelPosX = this.x;
		this.labelPosY = this.y;
	}

	getTailPointerAttachPos() {
		return [this.x + this.w / 2.0, this.y];
	}

	getHeadPointerAttachPos(fromX, fromY) {
		if (fromX < this.x) {
			return this.getClosestCardinalPoint(fromX, fromY); // Normal anchor
		} else {
			return [this.x, this.bottom()]; // Curved pointer coming from the right, connect to bottom
		}
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
		context.lineWidth = 2;

		let startX;
		let startY;

		startX = this.left();
		startY = this.top();

		if (this.highlighted) {
			context.strokeStyle = '#FF0000';
			context.fillStyle = '#FF0000';

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

		startX = this.right() - this.w * this.linkPercent;
		startY = this.top();

		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(startX, startY + this.h);
		context.lineTo(startX, startY);
		if (this.nullPointer) {
			context.lineTo(this.right(), startY + this.h);
		}
		context.closePath();
		context.stroke();

		context.textAlign = 'center';
		context.font = '12px Arial';
		context.textBaseline = 'middle';
		context.lineWidth = 2;

		this.resetTextPosition();
		context.fillStyle = this.labelColor;
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
		return new UndoDeleteCircularlyLinkedList(
			this.objectID,
			this.label,
			this.w,
			this.h,
			this.x,
			this.y,
			this.linkPercent,
			this.backgroundColor,
			this.foregroundColor,
			this.labelColor,
			this.layer,
			this.nullPointer,
			this.highlighted,
			this.highlightColor,
		);
	}
}

class UndoDeleteCircularlyLinkedList extends UndoBlock {
	constructor(
		objectID,
		label,
		w,
		h,
		x,
		y,
		linkPercent,
		backgroundColor,
		foregroundColor,
		labelColor,
		layer,
		nullPointer,
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
		this.linkPercent = linkPercent;
		this.backgroundColor = backgroundColor;
		this.foregroundColor = foregroundColor;
		this.labelColor = labelColor;
		this.layer = layer;
		this.nullPointer = nullPointer;
		this.highlighted = highlighted;
		this.highlightColor = highlightColor;
	}

	undoInitialStep(world) {
		world.addCircularlyLinkedListObject(
			this.objectID,
			this.label,
			this.w,
			this.h,
			this.linkPercent,
			this.backgroundColor,
			this.foregroundColor,
		);
		world.setNodePosition(this.objectID, this.x, this.y);
		world.setLayer(this.objectID, this.layer);
		world.setNull(this.objectID, this.nullPointer);
		world.setTextColor(this.objectID, this.labelColor);
		world.setHighlight(this.objectID, this.highlighted, this.highlightColor);
	}
}

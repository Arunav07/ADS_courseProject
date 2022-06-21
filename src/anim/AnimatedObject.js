
export default class AnimatedObject {
	constructor() {
		this.objectID = -1;

		this.x = 0;
		this.y = 0;

		this.backgroundColor = '#FFFFFF';
		this.foregroundColor = '#000000';
		this.highlighted = false;

		this.label = '';
		this.labelColor = '#000000';

		this.layer = 0;
		this.alpha = 1.0;
		this.minHeightDiff = 3;
		this.range = 5;

		this.highlightIndex = -1;
		this.highlightIndexDirty = true;

		this.addedToScene = true;
	}

	setBackgroundColor(newColor) {
		this.backgroundColor = newColor;
	}

	setNull() {}

	getNull() {
		return false;
	}

	setAlpha(newAlpha) {
		this.alpha = newAlpha;
	}

	getAlpha() {
		return this.alpha;
	}

	setForegroundColor(newColor) {
		this.foregroundColor = newColor;
		this.labelColor = newColor;
	}

	getHighlight() {
		return this.highlighted;
	}

	getWidth() {
		// TODO:  Do we want to throw here?  Should always override this ...
		return 0;
	}

	getHeight() {
		// TODO:  Do we want to throw here?  Should always override this ...
		return 0;
	}

	setHighlight(value, color) {
		this.highlighted = value;
		this.highlightColor = color || '#ff0000';
	}

	centerX() {
		return this.x;
	}

	setWidth() {
		throw new Error('setWidth() should be implemented in a base class');
	}

	centerY() {
		return this.y;
	}

	getAlignLeftPos(otherObject) {
		return [otherObject.right() + this.getWidth() / 2, otherObject.centerY()];
	}

	getAlignRightPos(otherObject) {
		return [otherObject.left() - this.getWidth() / 2, otherObject.centerY()];
	}

	getAlignTopPos(otherObject) {
		return [otherObject.centerX(), otherObject.top() - this.getHeight() / 2];
	}

	getAlignBottomPos(otherObject) {
		return [otherObject.centerX(), otherObject.bottom() + this.getHeight() / 2];
	}

	alignLeft(otherObject) {
		// Assuming centering.  Overridden method could modify if not centered
		//  (See AnimatedLabel, for instance)
		this.y = otherObject.centerY();
		this.x = otherObject.right() + this.getWidth() / 2;
	}

	alignRight(otherObject) {
		// Assuming centering.  Overridden method could modify if not centered
		//  (See AnimatedLabel, for instance)
		this.y = otherObject.centerY();
		this.x = otherObject.left() - this.getWidth() / 2;
	}

	alignTop(otherObject) {
		// Assuming centering.  Overridden method could modify if not centered
		this.x = otherObject.centerX();
		this.y = otherObject.top() - this.getHeight() / 2;
	}

	alignBottom(otherObject) {
		this.x = otherObject.centerX();
		this.y = otherObject.bottom() + this.getHeight() / 2;
	}

	getClosestCardinalPoint(fromX, fromY) {
		let xDelta;
		let yDelta;
		let xPos;
		let yPos;

		if (fromX < this.left()) {
			xDelta = this.left() - fromX;
			xPos = this.left();
		} else if (fromX > this.right()) {
			xDelta = fromX - this.right();
			xPos = this.right();
		} else {
			xDelta = 0;
			xPos = this.centerX();
		}

		if (fromY < this.top()) {
			yDelta = this.top() - fromY;
			yPos = this.top();
		} else if (fromY > this.bottom()) {
			yDelta = fromY - this.bottom();
			yPos = this.bottom();
		} else {
			yDelta = 0;
			yPos = this.centerY();
		}

		if (yDelta > xDelta) {
			xPos = this.centerX();
		} else {
			yPos = this.centerY();
		}

		return [xPos, yPos];
	}

	centered() {
		return false;
	}

	pulseHighlight(frameNum) {
		if (this.highlighted) {
			const frameMod = frameNum / 7.0;
			const delta = Math.abs((frameMod % (2 * this.range - 2)) - this.range + 1);
			this.highlightDiff = delta + this.minHeightDiff;
		}
	}

	getTailPointerAttachPos() {
		return [this.x, this.y];
	}

	getHeadPointerAttachPos() {
		return [this.x, this.y];
	}

	identifier() {
		return this.objectID;
	}

	getText() {
		return this.label;
	}

	getTextColor() {
		return this.labelColor;
	}

	setTextColor(color) {
		this.labelColor = color;
	}

	setText(newText) {
		this.label = newText;
	}

	setHighlightIndex(hlIndex) {
		this.highlightIndex = hlIndex;
		this.highlightIndexDirty = true;
	}

	getHighlightIndex() {
		return this.highlightIndex;
	}
}

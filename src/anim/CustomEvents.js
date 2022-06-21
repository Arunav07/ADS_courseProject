
export default class EventListener {
	constructor() {
		this.events = [];
	}

	removeListener(kind, scope, func) {
		if (this.events[kind] == null) {
			return;
		}
		let scopeFunctions = null;
		let i;
		for (i = 0; i < this.events[kind].length; i++) {
			if (this.events[kind][i].scope === scope) {
				scopeFunctions = this.events[kind][i];
				break;
			}
		}
		if (scopeFunctions == null) {
			return;
		}
		for (i = 0; i < scopeFunctions.functions.length; i++) {
			if (scopeFunctions.functions[i] === func) {
				scopeFunctions.functions.splice(i, 1);
				return;
			}
		}
	}

	addListener(kind, scope, func) {
		if (this.events[kind] === undefined) {
			this.events[kind] = [];
		}
		let i;
		let scopeFunctions = null;
		for (i = 0; i < this.events[kind].length; i++) {
			if (this.events[kind][i].scope === scope) {
				scopeFunctions = this.events[kind][i];
				break;
			}
		}
		if (scopeFunctions === null) {
			this.events[kind].push({ scope: scope, functions: [] });
			scopeFunctions = this.events[kind][this.events[kind].length - 1];
		}
		for (i = 0; i < scopeFunctions.functions.length; i++) {
			if (scopeFunctions.functions[i] === func) {
				return;
			}
		}
		scopeFunctions.functions.push(func);
	}

	fireEvent(kind, event) {
		// TODO:  Should add a deep clone here ...
		if (this.events[kind] !== undefined) {
			for (let i = 0; i < this.events[kind].length; i++) {
				const objects = this.events[kind][i];
				const functs = objects.functions;
				const scope = objects.scope;
				for (let j = 0; j < functs.length; j++) {
					const func = functs[j];
					func.call(scope, event);
				}
			}
		}
	}
}

import storageManager from '../utils/storage';

export default class Service {
	constructor(id, props) {
		this.id = id;
		this.changes = {};
		Object.assign(this, props);
	}

	async init() {
		this.storage = this.getStorage();
	}

	async saveStorage() {
		try {
			let storage = await storageManager.get(this.id);

			if(!storage) storage = {};
	
			let updatedStorage = Object.assign({}, storage, this.changes);
			this.storage = await storageManager.set({[this.id]: updatedStorage});
			return true;
		} catch (err) {
			console.log('error while saving to local storage:', err);
			return false;
		}

	}

	async getStorage() {
		return storageManager.get(this.id)
			.then(res => res ? res : this.saveStorage());
	}

	get() {
		return JSON.stringify(this);
	}
}
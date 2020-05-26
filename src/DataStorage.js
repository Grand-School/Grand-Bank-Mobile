class DataStorage {
    constructor() {
        this.data = {};
        this.onDataChangeCollection = [];
    }    

    setData(data) {
        this.data = data;
    }

    getData() {
        return this.data;
    }

    getByKey(key) {
        return this.data[key];
    }

    includes(key) {
        return key in this.data;
    }

    put(key, value) {
        this.data[key] = value;
        this.onDataChangeCollection
            .filter(item => item.key === key)
            .forEach(item => item.callback(value));
    }

    onDataChange(key, callback, callbackKey) {
        this.onDataChangeCollection.push({ key, callback, callbackKey });
    }

    removeOnDataChange(key, callback, callbackKey) {
        this.onDataChangeCollection = this.onDataChangeCollection
            .filter(item => item.key !== key && callbackKey ? item.callbackKey !== callbackKey : item.callback !== callback);
    }
}

const INSTANCE = new DataStorage();
export default INSTANCE;
class DataStorage {
    constructor() {
        this.data = {};
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
}

const INSTANCE = new DataStorage();
export default INSTANCE;
class DBModel {
    constructor(db) {
        if (new.target === DBModel) {
            throw new Error("Cannot instantiate an abstract class - DBModel.");
        }
        this.db = db; // Simulated database instance
    }
    getInstance(_id = null) {
        if (_id) {
            return this.db.findById(_id);
        }
        return this;
    }

    release() {
        throw new Error("Abstract method 'release' must be implemented - DBModel.");
    }

    releaseCompact() {
        throw new Error("Abstract method 'releaseCompact' must be implemented - DBModel.");
    }
}

export default DBModel;
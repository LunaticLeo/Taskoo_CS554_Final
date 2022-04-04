const mongoCollections = require('../../config/mongoCollections');
const status = mongoCollections.status;
const check=require('../../lib/Check');
const { ObjectId } = require('mongodb');

let exportedMethods={
    async getStatus(){
        const resCollection = await status();

        const resList = await resCollection.find({}, { projection: { _id: 1, name: 1} }).toArray();
    
        return resList;
    },
    async getStatusbyId(id){
        check._id(id);
        id=ObjectId(id);
        const resCollection = await status();
        const resList = await resCollection.findOne({ _id: id });
        if (resList === null) throw 'No status with that id';
        return resList;
    }

};

module.exports = exportedMethods;
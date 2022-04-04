const mongoCollections = require('../../config/mongoCollections');
const positions = mongoCollections.positions;
const check=require('../../lib/Check');
const { ObjectId } = require('mongodb');

let exportedMethods={
    async getPositions(){
        const resCollection = await positions();
        const resList = await resCollection.find({}, { projection: { _id: 1, name: 1,level: 1} }).toArray();
        return resList;
    },

    async getPositionsbyId(id){
        check._id(id);
        id=ObjectId(id);
        const resCollection = await positions();
        const resList = await resCollection.findOne({ _id: id });
        if (resList === null) throw 'No positions with that id';
        return resList;
    }

};

module.exports = exportedMethods;
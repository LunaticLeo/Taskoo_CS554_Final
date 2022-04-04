const mongoCollections = require('../../config/mongoCollections');
const roles = mongoCollections.roles;
const check=require('../../lib/Check');
const { ObjectId } = require('mongodb');

let exportedMethods={
    async getRoles(){
        const resCollection = await roles();

        const resList = await resCollection.find({}, { projection: { _id: 1, name: 1} }).toArray();
    
        return resList;
    },
    async getRolebyId(id){
        check._id(id);
        id=ObjectId(id);
        const resCollection = await roles();
        const resList = await resCollection.findOne({ _id: id });
        if (resList === null) throw 'No roles with that id';
        return resList;
    }

};

module.exports = exportedMethods;
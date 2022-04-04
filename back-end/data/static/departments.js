const mongoCollections = require('../../config/mongoCollections');
const departments = mongoCollections.departments;
const check=require('../../lib/Check');
const { ObjectId } = require('mongodb');

let exportedMethods={
    async getDepartments(){
        const resCollection = await departments();

        const resList = await resCollection.find({}, { projection: { _id: 1, name: 1} }).toArray();
    
        return resList;
    },

    async getDepartmentbyId(id){
        check._id(id);
        id=ObjectId(id);
        const resCollection = await departments();
        const resList = await resCollection.findOne({ _id: id });
        if (resList === null) throw 'No departments with that id';
        return resList;
    }

};

module.exports = exportedMethods;
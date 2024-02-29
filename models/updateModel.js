const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
    message:String,
    ofRoute:{
        type:mongoose.Schema.Types.ObjectId,
    }    
},{timestamps:true});

const Update = mongoose.model('Update',updateSchema);
module.exports = Update;
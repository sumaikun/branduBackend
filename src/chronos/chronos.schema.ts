import * as mongoose from 'mongoose'

export const ChronosSchema = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    modified_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    title: {
        type:String,
        required:true,
    },
    supplier:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"Supplier",
        required:true,
    },
    description: {
        type:String,
        required:true,
    },
    automatical: {
        type:Boolean,
        required:true,
    },
    rules: [{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"Rule",
    }],
    executeHour: {
        type:String,
        required:true,
    },
},
{
  timestamps: true
});

ChronosSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});
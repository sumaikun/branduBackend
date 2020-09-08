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
    },
    description: {
        type:String
    },
    automatical: {
        type:Boolean
    },
    rules: [{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"Rule",
    }]
},
{
  timestamps: true
});

ChronosSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});
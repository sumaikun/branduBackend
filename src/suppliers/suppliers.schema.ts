import * as mongoose from 'mongoose'

export const SuppliersSchema = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    modified_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    name: {
        type:String,
        required:true,
        unique:true
    },
    city:{
        type:String,
        required:true,
    },  
    address:{
        type:String,
        required:true,
    },  
    vendorId:{
        type:String,
        required:true,
    },  
    phone:{
        type:String,
        required:true,
    },
    photoUrl:{
        type:String,
    },
    type:{
        type:String,
        required:true
    }
},
{
  timestamps: true
});


SuppliersSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});
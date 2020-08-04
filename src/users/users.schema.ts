import * as mongoose from 'mongoose'

export const UsersSchema = new mongoose.Schema({
    created_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    modified_by:{
        type:mongoose.Schema.Types.ObjectId || null,
        ref:"User",
    },
    nickname: {
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    name: {
        type:String,
        required:true,
    },
    lastName: {
        type:String,
        required:true,
    },
    documentType: {
        type:String,
        required:true,
    },
    documentNumber:{
        type:String,
        required:true,
    },
    address: {
        type:String
    },
    city: {
        type:String,
        required:true,
    },
    phone: {
        type:String       
    },
    cellPhone: {
        type:String
    },
    email: {
        type: String,
        required:true,
        unique:true,
        lowercase: true
    },
    password: {
        type:String,
        //select: false
    },
    role: {
        type:String,
        required:true,
    },
    photoUrl:{
        type:String,
    },
    state: {
        type:String,
        required:true,
    },
    suppliers: [{
        type:mongoose.Schema.Types.ObjectId || null,
          ref:"Supplier",
      }],
},
{
  timestamps: true
});

UsersSchema.set('toJSON', {
    virtuals: true,
    versionKey:false,
    transform: function (doc, ret) {   delete ret._id  }
});
const { Schema, model } = require('mongoose');


const ProfileSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    bio :{
        type: String,
        max: 1025,
    },

    social: {
        twitter: { type: String },
        linkedin: { type: String },
        facebook: { type: String },
        instagram: { type: String },
    }
},
{
    timestamps: true
});

module.exports = model('Profile', ProfileSchema);
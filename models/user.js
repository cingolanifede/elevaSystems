const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
	    unique: true,
        required: true
    },
    password: {
        type: String,
        default: 'user'
    },
    facebookId: String,
    rol: {
        type: String,
        default: 'admin'
    },
    empresaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    selected: {
        type: Boolean
    },
    active: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
});

UserSchema.methods.isValidPassword = async function (password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
    return compare;
};

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

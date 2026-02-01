const mongoose = require('mongoose');
// passport-local-mongoose may be a default export depending on the version, so handle both cases
const plmModule = require('passport-local-mongoose');
const plm = plmModule.default || plmModule;

const userSchema = mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String },
    displayName: { type: String },
    oauthId: { type: String },
    oauthProvider: { type: String },
    created: { type: Date, default: Date.now }
});

userSchema.plugin(plm);

module.exports = mongoose.model("User", userSchema);

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/curatingme');

var userInformationSchema = mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        unique: true,
    },
    uiName: {
        type: String,
    },
    uiEmail: {
        type: String,
        unique: true,
    }
});

var userLinksSchema = mongoose.Schema({
    objId: {
        type: String,
        required: true,
    },
    linkName: {
        type: String,
    },
    linkUrl: {
        type: String,
    }
});


var UserInformationModel = mongoose.model('userInformation', userInformationSchema, 'userInformation');
var UserLinksModel = mongoose.model('userLinks', userLinksSchema, 'userLinks');

module.exports = {
    UserInformationModel: UserInformationModel,
    UserLinksModel: UserLinksModel
};
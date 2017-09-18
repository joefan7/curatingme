var mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/curatingme')

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
    },
    uiBio: {
        type: String,
    }
    })

var UserInformationModel = mongoose.model('userInformation', userInformationSchema, 'userInformation')

module.exports = {
    UserInformationModel: UserInformationModel,
}
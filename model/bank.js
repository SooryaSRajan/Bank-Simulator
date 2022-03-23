//mongoose bank acccount schema
const mongoose = require('mongoose');

const BankSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    account: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    },
    cvv: {
        type: String,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
});

//export model
module.exports = mongoose.model(
    "Bank",
    BankSchema
);



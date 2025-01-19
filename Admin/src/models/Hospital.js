const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
    hospital_id: { type: Number, required: true, unique: true },
    hospital_name: { type: String, required: true },
    address: { type: String, required: true },
    contact_number: { type: String, required: true },
    blood_storage: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hospital', hospitalSchema);
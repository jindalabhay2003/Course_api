const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "A course must have a name"],
        unique: [true, "A Course name must be unique"]
    },
    imageUrl: {
        type: String
    },
    universityName: {
        type: String,
        required: [true, "A Course must have a university name"],
    },
    FacultyProfile: {
        type: String
    },
    duration: {
      type: Number,
      required: [true, 'A Course must have a duration']
    },
    price: {
      type: Number,
      required: [true,'A Course must have a price']
    },
    diploma: {
        type: String,
        required: [true,'A Course Faculty must have a certificate/diploma']
    },
    eligibility: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },

});


const Course = mongoose.model('Course',CourseSchema);

module.exports = Course;
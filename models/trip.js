const mongoose = require('mongoose');
const { Schema } = mongoose;

const tripSchema = new Schema(
    {
        // Trip title
        title: {
        type: String,
        required: true,
        trim: true,
        },
        // Destination (city, country, etc.)
        destination: {
        type: String,
        required: true,
        trim: true,
        },
        // Departure and return dates
        startDate: {
        type: Date,
        required: true,
        },
        endDate: {
        type: Date,
        required: true,
        },
        // Budget or cost
        price: {
        type: Number,
        min: 0,
        },
        // Image used for trip list card
        imageUrl: {
        type: String,
        default: '/images/img_1.jpg',
        },
        // notes
        notes: {
        type: String,
        trim: true,
        },
        owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        },
    },
    {
        timestamps: true, // createdAt / updatedAt will be added automatically
    }
);

module.exports = mongoose.model('Trip', tripSchema);

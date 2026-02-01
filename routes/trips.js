const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('../extensions/auth');


// Sample images (used when no upload is provided)
const sampleImages = [
    '/images/img_1.jpg',
    '/images/img_2.jpg',
    '/images/img_3.jpg',
    '/images/img_4.jpg',
    '/images/img_5.jpg',
    '/images/img_6.jpg'
];

// Upload destination and filename rules
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // .jpg / .png
        cb(null, uniqueSuffix + ext);
    },
});

// multer instance
const upload = multer({ storage: storage });


// GET /trips - list
router.get('/', requireAuth, async (req, res, next) => {
    try {
        const trips = await Trip.find({ owner: req.user._id }).sort({ startDate: 1 }).lean();
        res.render('trips', {
            title: 'Trips',
            active: 'trips',
            trips
        });
    } catch (err) {
        console.error('Error in /trips route:', err);
        next(err);
    }
});

// GET /trips/new - show form
router.get('/new', requireAuth, (req, res) => {
    res.render('trip-new', {
        title: 'Create Trip',
        active: 'new-trip'
    });
});

// GET /trips/:id - Trip detail
router.get('/:id', requireAuth, async function (req, res, next) {
    try {
        const trip = await Trip.findById(req.params.id).lean();

        if (!trip) {
        return res.status(404).render('error', {
            message: 'Trip not found',
            error: {},
        });
        }

        res.render('trip-single', {
        title: trip.title,
        active: 'trips',
        trip, // accessible in HBS as {{trip.xxx}}
        });
    } catch (err) {
        next(err);
    }
});

// POST /trips - create (image upload + random image fallback)
router.post('/', upload.single('image'), async (req, res, next) => {
    try {
        let imageUrl;

        if (req.file) {
        // If user uploaded an image
        imageUrl = '/uploads/' + req.file.filename;
        } else {
        // If no upload → pick a random sample image
        imageUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)];
        }

        await Trip.create({
        title: req.body.title,
        destination: req.body.destination,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        price: req.body.price || 0,
        imageUrl: imageUrl,
        notes: req.body.notes,
        owner: req.user._id
        });

        res.redirect('/trips');
    } catch (err) {
        next(err);
    }
});


// GET /trips/:id/edit - show edit form
router.get('/:id/edit', async (req, res, next) => {
    try {
        const trip = await Trip.findById(req.params.id).lean();
        if (!trip) {
        return res.status(404).render('error', { message: 'Trip not found', error: {} });
        }

        res.render('trip-edit', {
        title: `Edit: ${trip.title}`,
        active: 'trips',
        trip,
        });
    } catch (err) {
        next(err);
    }
});

// PUT /trips/:id - update (with image upload support)
router.put('/:id', upload.single('image'), async (req, res, next) => {
    try {
        // First fetch current Trip (to keep existing image if not replaced)
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
        return res.status(404).render('error', { message: 'Trip not found', error: {} });
        }

        // Default is to keep current image
        let newImageUrl = trip.imageUrl;

        // Replace only if a new image was uploaded
        if (req.file) {
        newImageUrl = '/uploads/' + req.file.filename;
        }

        const { title, destination, price, startDate, endDate, notes } = req.body;

        await Trip.findByIdAndUpdate(
        req.params.id,
        {
            title,
            destination,
            price,
            startDate,
            endDate,
            imageUrl: newImageUrl,
            notes,
        },
        { runValidators: true }
        );

        res.redirect(`/trips/${req.params.id}`);
    } catch (err) {
        next(err);
    }
});


// DELETE /trips/:id
router.delete('/:id', async (req, res, next) => {
    try {
        await Trip.findByIdAndDelete(req.params.id);
        res.redirect('/trips');
    } catch (err) {
        next(err);
    }
});

module.exports = router;

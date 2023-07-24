const router = require('express').Router();

const screensResults = [];

router.put('/:id/video_screens', (req, res, next) => {
    const video = {
        video_id: parseFloat(req.params.id),
        result: {
            screens: req.body.videoScreens,
        }
    }

    screensResults.push(video);
    res.status(200).json({message: 'Сохранено'}); 
});

module.exports = router;
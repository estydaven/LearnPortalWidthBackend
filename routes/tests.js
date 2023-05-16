const router = require('express').Router();

const correctAnswers = {
    0: [1, 2],
    1: 5,
    2: 9,
    3: 13,
    4: 17
}

let falseAnswers = [];
let trueAnswers = [];

router.put('/', (req, res, next) => {
    falseAnswers = [];
    trueAnswers = [];
    
    let userAnswers = req.body.answers;
    for (let i = 0; i < userAnswers.length; i++) {
        if (Array.isArray(correctAnswers[i]) && Array.isArray(userAnswers[i])) {
            let isEqual = JSON.stringify(correctAnswers[i]) === JSON.stringify(userAnswers[i]);
            
            if (isEqual) {
                trueAnswers.push(true);
            } else {
                falseAnswers.push(false); 
            }
        } else if (correctAnswers[i] == userAnswers[i]) {
            trueAnswers.push(true);
        } else {
            falseAnswers.push(false);
        }
    }

    if (userAnswers.length !== Object.keys(correctAnswers).length) {
        falseAnswers = [];
        trueAnswers = [];
        return res.status(400).json({message: 'Ответьте на все вопросы!'});
    }
    if (falseAnswers.length > 3) {
        return res.status(400).json({falseAnswers});
    } else {
        return res.status(200).json({trueAnswers}); 
    }
});

module.exports = router;
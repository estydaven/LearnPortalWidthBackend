const router = require('express').Router();

const correctAnswersFirst = {
    0: [2],
    1: [5],
    2: [11],
    3: [14],
    4: [17],
    5: [23],
    6: [26],
    7: [30],
    8: [33],
    9: [36],
    10: [41],
    11: [44],
    12: [49],
    13: [50],
    14: [56],
    15: [57],
    16: [63],
    17: [66],
    18: [68],
    19: [70],
    20: [74],
    21: [76],
    22: [80],
    23: [83],
    24: [88],
    25: [90],
    26: [92, 93],
    27: [98],
    28: [103],
    29: [105],
    30: [108],
}
const correctAnswersSecond = {
    0: [114],
    1: [118],
    2: [121],
    3: [123],
    4: [127],
    5: [131],
    6: [133],
    7: [136],
    8: [138],
    9: [143],
    10: [145],
    11: [150],
}

let falseAnswers = [];
let trueAnswers = [];

router.put('/', (req, res, next) => {
    falseAnswers = [];
    trueAnswers = [];
    
    let userAnswers = req.body.answers;
    
    for (let i = 0; i < Object.keys(correctAnswersFirst).length; i++) {
        if (Array.isArray(correctAnswersFirst[i]) && Array.isArray(userAnswers[i])) {
            const newArr = userAnswers[i].sort(( a, b ) =>  a - b);
            const isEqual = JSON.stringify(correctAnswersFirst[i]) === JSON.stringify(newArr);
            
            if (isEqual) {
                trueAnswers.push(true);
            } else {
                falseAnswers.push(false); 
            }
        } 
    }
    
    // if (Object.keys(userAnswers).length !== Object.keys(correctAnswersFirst).length) {
    //     falseAnswers = [];
    //     trueAnswers = [];
    //     return res.status(400).json({message: 'Ответьте на все вопросы!'});
    // }
    if (falseAnswers.length > 3) {
        return res.status(400).json({falseAnswers});
    } else {
        return res.status(200).json({trueAnswers}); 
    }
});

module.exports = router;
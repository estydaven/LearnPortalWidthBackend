const router = require('express').Router();

const correctAnswersFirst = {
    0: [1],
    1: [5],
    2: [9],
    3: [13],
    4: [17],
    // 0: [2],
    // 1: [5],
    // 2: [11],
    // 3: [14],
    // 4: [17],
    // 5: [23],
    // 6: [26],
    // 7: [30],
    // 8: [33],
    // 9: [36],
    // 10: [41],
    // 11: [44],
    // 12: [49],
    // 13: [50],
    // 14: [56],
    // 15: [57],
    // 16: [63],
    // 17: [66],
    // 18: [68],
    // 19: [70],
    // 20: [74],
    // 21: [76],
    // 22: [80],
    // 23: [83],
    // 24: [88],
    // 25: [90],
    // 26: [92, 93],
    // 27: [98],
    // 28: [103],
    // 29: [105],
    // 30: [108],
}
const correctAnswersSecond = {
    0: [113],
    1: [117],
    2: [120],
    3: [123],
    4: [126],
    // 0: [114],
    // 1: [118],
    // 2: [121],
    // 3: [123],
    // 4: [127],
    // 5: [131],
    // 6: [133],
    // 7: [136],
    // 8: [138],
    // 9: [143],
    // 10: [145],
    // 11: [150],
}

let falseAnswersTheory = [];
let trueAnswersTheory = [];
let falseAnswersRocket = [];
let trueAnswersRocket = [];

router.put('/tests_theory', (req, res, next) => {
    falseAnswersTheory = [];
    trueAnswersTheory = [];
    
    let userAnswersTheory = req.body.answersFirst;
    
    for (let i = 0; i < Object.keys(correctAnswersFirst).length; i++) {
        if (Array.isArray(correctAnswersFirst[i]) && Array.isArray(userAnswersTheory[i])) {
            const newArr = userAnswersTheory[i].sort(( a, b ) =>  a - b);
            const isEqual = JSON.stringify(correctAnswersFirst[i]) === JSON.stringify(newArr);
            
            if (isEqual) {
                trueAnswersTheory.push(true);
            } else {
                falseAnswersTheory.push(false); 
            }
        } 
    }
    
    if (Object.keys(userAnswersTheory).length !== Object.keys(correctAnswersFirst).length) {
        falseAnswersTheory = [];
        trueAnswersTheory = [];
        return res.status(400).json({message: 'Ответьте на все вопросы!'});
    }
    
    if (falseAnswersTheory.length > 3) {
        return res.status(400).json({falseAnswersTheory});
    } else {
        return res.status(200).json({trueAnswersTheory});
    }
});

router.put('/tests_rocket', (req, res, next) => {
    falseAnswersRocket = [];
    trueAnswersRocket= [];
    
    let userAnswersRocket = req.body.answersSecond;
    
    for (let i = 0; i < Object.keys(correctAnswersSecond).length; i++) {
        if (Array.isArray(correctAnswersSecond[i]) && Array.isArray(userAnswersRocket[i])) {
            const newArr = userAnswersRocket[i].sort(( a, b ) =>  a - b);
            const isEqual = JSON.stringify(correctAnswersSecond[i]) === JSON.stringify(newArr);
            
            if (isEqual) {
                trueAnswersRocket.push(true);
            } else {
                falseAnswersRocket.push(false); 
            }
        } 
    }

    if (Object.keys(userAnswersRocket).length !== Object.keys(correctAnswersSecond).length) {
        falseAnswersRocket = [];
        trueAnswersRocket= [];
        return res.status(400).json({message: 'Ответьте на все вопросы!'});
    }
    
    if (falseAnswersRocket.length > 3) {
        return res.status(400).json({falseAnswersRocket});
    } else {
        return res.status(200).json({trueAnswersRocket});
    }
});

module.exports = router;
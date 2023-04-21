const router = require('express').Router();
const bcrypt = require('bcrypt');
const users = [
    {
        id: 1,
        email: 'ex@gmail.com',
        password_hash: '$2b$10$LlwUiAW/XkT1ALBg.komhOujXlXjEKDsrB0S7WnJx0NAZppfRzaO.',
        name: 'Igor',
        avatar: null,
        available_pages: ['1'],
        available_tasks: ['1'],
    }
];

router.post('/signup', (req, res, next) => {
    users.push({
        id: users.length + 1,
        email: req.body.email,
        password_hash: bcrypt.hashSync(req.body.password, 10),
        name: req.body.name,
        avatar: null,
        available_pages: ['1'],
        available_tasks: ['1'],
    });

    res.status(201).json({message: 'Success!'});   
}) 

router.post('/login', async (req, res, next) => {

    let user = users.find(user => user.email === req.body.email);
    
    if (!user) {
        res.status(400).json({message: 'Введите правильный email!'});        
    } else {
        if (await bcrypt.compare(req.body.password, user.password_hash)) {
            delete user.password;
            req.session.user = user;
            res.status(200).json({user});           
        } else {
            res.status(400).json({message: 'Введите правильный пароль!'}); 
        }
    }
    
});

router.get('/session', (req, res, next) => {
    req.session.user = users[0]; // TODO удалить перед продом
    res.status(200).json({user: req.session.user || null});
})

router.put('/', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.available_pages.push(req.body.nextTab);    
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'}); 
})

router.put('/available-tasks', (req, res, next) => {
    const user = users.find(user => user.id === req.session.user.id);
    user.available_tasks.push(req.body.task);
    req.session.user = user;
    res.status(200).json({message: 'Сохранено'});    
})

router.delete('/session', async (req, res, next) => {
    await req.session.destroy();
    res.status(200).json({message: 'Пользователь разлогинен'});
})

module.exports = router;
module.exports = {
  checkAuth(req, res, next) {
    if (req.session.user) {
      next();
    } else {
      res.status(403).json({message: 'Пользователь не авторизирован'});
    }    
  }
}
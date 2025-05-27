const checkAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.session.user) {
      return res.redirect('/auth/login');
    }
    
    if (!roles.includes(req.session.user.role)) {
      return res.status(403).render('error', {
        message: 'У вас нет доступа к этой странице'
      });
    }
    
    next();
  };
};

module.exports = {
  checkAuth,
  checkRole
}; 
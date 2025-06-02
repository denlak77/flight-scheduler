const checkAuth = (req, res, next) => {
  console.log('Checking authentication for user:', req.session.user);
  if (!req.session.user) {
    console.log('User not authenticated, redirecting to login.');
    return res.redirect('/auth/login');
  }
  console.log('User authenticated.');
  next();
};

const checkRole = (roles) => {
  return (req, res, next) => {
    console.log('Checking role for user:', req.session.user, 'Required roles:', roles);
    if (!req.session.user) {
      console.log('User not authenticated, redirecting to login.');
      return res.redirect('/auth/login');
    }
    
    if (!roles.includes(req.session.user.role)) {
      console.log('User role', req.session.user.role, 'does not match required roles.');
      return res.status(403).render('error', {
        message: 'У вас нет доступа к этой странице'
      });
    }
    
    console.log('User role check passed.');
    next();
  };
};

module.exports = {
  checkAuth,
  checkRole
}; 
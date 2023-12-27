exports.requireRole = (role) => {
  return (req, res, next) => {
    if (req.isAuthenticated() && req.user[role] === true) {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };
};
var {User} = require('./../models/user');

var authenticate = (req, res, next) => {

  var token = req.header('x-auth');

  if(!token)
  {
    res.status(400).send('Please log in to perform this action');
  }
  User.findByToken(token).then((user) => {
    if (!user) {
      console.log('authentication failed')
      return Promise.reject();
    }

    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};

module.exports = {authenticate};

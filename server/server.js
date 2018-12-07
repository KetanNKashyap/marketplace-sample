require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
var {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {Car} = require('./models/car');
var {authenticate} = require('./middleware/authenticate');
const _ = require('lodash');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());


// TEST POST /users
// app.post('/users', (req, res) => {
//     var user = new User({email:'asdad@wqe.com', password:'qwewq3@@'})
//     user.save().then((doc) => {
//         console.log('saved')
//         res.send(doc);
//       }, (e) => {
//         res.status(400).send(e);
//       });
//     });

// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password'])
    var user = new User(body);
  
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });
  
  app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
  });
  
  app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
  
    User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send(user);
      });
    }).catch((e) => {
      res.status(400).send();
    });
  });
  
  app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
      res.status(200).send();
    }, () => {
      res.status(400).send();
    });
  });
  
  app.post('/users/tags', authenticate, (req, res) => {
  
    var tags = req.body.tags;
    console.log(tags)
    var user = req.user;
    user.tags = tags
    return user.save().then((doc) => {
      res.send(doc);
    }).catch((e) => {
      res.status(400).send();
    });
  });

  app.post('/cars', authenticate, (req, res) => {
    console.log(req.body.start)
    var car = new Car({
      build: req.body.build,
      model: req.body.model,
      year:  req.body.year,
      featured: req.user.tags.includes("beta"),
      start: req.body.start,
      end: req.body.end,
      _user: req.user._id
    });
    car.save().then((doc) => {
      req.user.tags.includes("beta") ? res.send('Car has been listed successfully in the marketplace'): res.send('Car shall be listed in the marketplace post approval');
    }, (e) => {
      res.status(400).send(e);
    });
  });

  app.get('/cars', authenticate, (req, res) => {
    Car.find({
      _user: req.user._id
    }).then((cars) => {
      res.send({cars});
    }, (e) => {
      res.status(400).send(e);
    });
  });

  app.get('/cars/:featured', authenticate, (req, res) => {
    var featured = req.params.featured;
    Car.find({
      featured: featured === "featured" ?true:false,
      _user: req.user._id
    }).then((cars) => {
      if (!cars) {
        return res.status(404).send();
      }
      res.send({cars});
    }).catch((e) => {
      res.status(400).send();
    });
  });

  app.listen(port, () => {
    console.log(`Started up at port ${port}`);
  });
  























// app.get('/longUrl/:shortURL', (req, res)=> {

//     //Search for the shortURL in the DB to get the longURL
//     const longURL = 'flipkart.com'

//     //Send the long URL back
//     res.send('flipgggkartss.com')
// });


// app.post('/shorten', (req, res)=> {

//    const longUrl = req.body.longUrl;
//    // const {longUrl} = req.body
//     //res.send(longUrl)

//     // Create short code for the URL
//     const shortCode = 'nbxwkv'

//     //Append it to the domain
//     var newURL = 'localhost:3000/' + shortCode

//     //Send back the new short url
//     res.send(newURL)
// });


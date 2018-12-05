var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/db-marketplace', function(error){
    if(error) console.log(error);

        console.log("connection successful");
});

//mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};

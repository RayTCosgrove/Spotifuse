const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/spotifuse', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log("Connected to spotifuse database. ")
})
.catch( error => {
    console.log('Error: ', error)
})

module.exports = mongoose;
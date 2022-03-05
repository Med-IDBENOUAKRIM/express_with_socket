const mongoose = require('mongoose');


exports.connectToDataBase = url => {
    mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(() => console.log('DB is Connected'))
    .catch(() => console.log('DB is NOT Connected'))
}
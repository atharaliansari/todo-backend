const express = require('express');
const mongoose = require('mongoose');
const Route = require('./routes/authRoute');

const App = express();
App.use(express.json());

const cors = require('cors');
App.use(cors());


App.use('/', Route);



mongoose.connect(process.env.MONGO_URI)

    .then(() => {
        App.listen(4000, () => { console.log('DB Connected and Server started') })
    })
    .catch((err) => {
        console.log(err, 'Mongo db connection error');
    });


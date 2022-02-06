const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./Routers/authRouter');
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://<username>:<password>@cluster0.xiqe8.mongodb.net/<yourDatabase>?retryWrites=true&w=majority`);
        app.listen(PORT, () => console.log(`Server started on Port ${PORT}`));
    } catch (e) {
        console.log(e);
    } 
}

start();
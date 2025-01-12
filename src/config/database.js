const mongoose = require('mongoose')

const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://rahuljhakumar25:nn7Q6B9mUvUKFM5V@namastenode.u8i3w.mongodb.net/DevTinder');
};

module.exports = connectDB;
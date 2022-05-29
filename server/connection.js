const mongoose = require("mongoose");

const connectDB = ()=>{
    mongoose.connect("mongodb://localhost:27017/FaceRecognitionSnameGame",{
        useNewUrlParser: true,
        useUnifiedTopology:true
    }).then((con)=>{
        console.log(`Mongo DB Connected: ${con.connection.host}`);
    })
}

module.exports = connectDB
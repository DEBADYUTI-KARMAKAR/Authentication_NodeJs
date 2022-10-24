const { default: mongoose } = require("mongoose");

const {MONGODB_URL}=process.env;

exports.connect =()=>{
    mongoose.connect(MONGODB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        
    }).then(console.log('Database connected successfully')) 
    .catch((err)=>{
        console.log(err);
        process.exit(1);
    }
    );
    
}
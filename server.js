const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');


mongoose.connect(process.env.MONGO_URL)
.then(()=> console.log('connected'))
.catch((err)=> console.log('failed'))



const port = process.env.PORT || 3001

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})
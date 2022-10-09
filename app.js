require('express-async-error');
const express = require('express');
const cors = require('cors');
const app = express();
const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter')
const productRouter = require('./routers/productRouter');
const cartRouter = require('./routers/cartRouter');
const profileRouter = require('./routers/profileRouter');
const morgan = require('morgan');
const authorize = require('./middlewares/authorize');

app.use(cors());
app.use(express.json())
app.use(morgan('dev'));


app.use('/api/user',userRouter);
app.use('/api/category',categoryRouter);
app.use('/api/product',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/profile',profileRouter)
app.use('/api/authorize',authorize);


app.use((err,req,res,next)=>{
  return res.status(400).send('Something failed!!!');
})




module.exports = app;



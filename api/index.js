import express from 'express';
import authRouter from './routes/authRoutes.js';

const app = express();
const PORT= 8080;

//routing
app.use('/api/auth',authRouter)


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
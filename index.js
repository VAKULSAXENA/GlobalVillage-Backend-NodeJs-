const express=require('express');
const port=3000;
const app =express();

require('./db');
require('./models/User');

const authRoutes=require('./routes/authRoutes');
app.use(express.json());
app.use(authRoutes);

app.get('/',(req,res)=>{
    res.send("Hello World")
})

app.listen(port,()=>console.log(`server running on port ${port}`))
const express = require('express');

var app = express();
app.listen(4000);

app.get('/',(req,res)=>{
    res.send('你好!');
})
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static(__dirname + '/flowfield'));

app.get('', (req, res)=>{
    res.sendFile(__dirname + '/flowfield/index.html');
});

app.listen(PORT, ()=>{
    console.log('Listening on port ' + PORT);
});
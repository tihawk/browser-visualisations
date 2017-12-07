const express = require('express');
const directory = require('serve-index');
const app = express();
const PORT = 1337;

app.use(express.static(__dirname + '/public'));
app.use(directory(__dirname + '/public'));

app.listen(PORT, ()=>{
    console.log('Listening on port ' + PORT);
});
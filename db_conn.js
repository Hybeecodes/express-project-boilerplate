const mongoose = require('mongoose');
const DB_NAME = "";
mongoose.connect(`mongodb://localhost/${DB_NAME}`).then(()=> {
    console.log("Connected to DB");
}).catch((err) => {
    console.error(err);
})
/* ------------------------- ---Multer ----- ---------------------- */
const multer = require('multer');
const path = require('path');
/* Setting a static folder named public */
//app.use(express.static('./public')); Já está à frente
/* Set multer storage engine */
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req,file,callBack){
        /* Callback function (error, fileName) */
        callBack(null,file.fieldname + '-' + Date.now() + path.extname()); 
    }
});


/* Initialize the upload variable through multer set*/
var upload = multer({
    storage: storage
}).single('image'); // single because we're trying to upload a single image at the time



/* -----------------------------Multer end-def ---------------------*/
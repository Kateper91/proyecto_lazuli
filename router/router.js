const { Router } = require("express");
const router  = new Router();

router.get('/', (req, res)=>{
    res.render('index');
});

router.get('/presentacion', (req,res)=>{
    res.render('presentacion')
});

router.get('/login', (req, res)=>{
    res.render('login');
});

router.get('/register', (req, res)=>{
    res.render('register');
});

router.get('/productos', (req, res)=>{
    res.render('productos');
});

router.get('/lexington', (req, res)=>{
    res.render('lexington')
});

router.get('/nosotros',(req,res)=>{
    res.render('nosotros')
});

 router.get ('*' , (req, res)=>{
    res.render('error')
}); 


module.exports = router;
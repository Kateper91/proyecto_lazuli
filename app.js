const express = require('express');
const app = express();
const path = require ('path');
const port = 3000 ;
const hbs = require('hbs');


app.use (express.urlencoded({extended:false}));
app.use(express.json());

//invocamos a dotenv
const dontenv = require('dotenv');
dontenv.config({path:'./env/.env'});

//directorio public
app.use(express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));


//Establecer motor de plantillas
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials')

//Invocamos a bcryptjs
const bcrypt = require('bcryptjs');

//variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

//Invocamos al modulo de conexion de la BD
const connection = require ('./database/db');

//estableciendo rutas
app.use (express.static ('public'));
app.use(require('./router/router'));

//registracion
app.post ('/register', async (req,res)=>{
    const user = req.body.user;
    const name = req.body.name;
    const mail = req.body.mail;
    const pass = req.body.pass;
    const phone = req.body.phone;
    const address = req.body.address;
    const city = req.body.city;
    const country = req.body.country;
    let passwordHaash = await bcrypt.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, name:name, mail:mail, pass:passwordHaash, phone:phone, address:address, city:city, country:country}, async(error, results)=> {
        if (error){
             console.log(error);
        }else{
            res.send ("Registro realizado correctamente");
        }
    });
});

//autenticacion
app.post('/auth', async(req, res) =>{
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcrypt.hash(pass, 8);
    if(user && pass) {
        connection.query ('SELECT * FROM users WHERE user = ? ' , [user], async (error, results, fields)=>{
            if(results.length == 0 || !(await bcrypt.compare(pass, results[0].pass))){
                res.send ("el usuario y / o contraseña  ingresados no son validos")
            }else{
                res.send('Login correcto');
            }
            })
        };
    });


//auth pages
app.get('/', (req, res)=>{
    if(req.session.loggedin){
        res.render('index',{
            login:true,
            name:req.session.name
        });
    }else{
        res.render('index', {
            login:false,
            name: req.session.name
        })
    }
})

//cambio de contraseña
app.post ('/update', async (req,res)=>{
        const user = req.body.user;
        const pass = req.body.Pass;
        let passwordHaash = await bcrypt.hash(pass, 8);
        if(user && pass) {
            connection.query ('UPDATE users SET pass WHERE user = ? ', {user:user, pass:passwordHaash}, async (error, results)=>{
                if(error){
                    console.log(error)
                }else{
                    res.send('Contraseña actualizada');
                }
            })
        };
})




app.listen(port, ()=>{
    console.log ('Servidor funcionando en http://localhost:3000')
})

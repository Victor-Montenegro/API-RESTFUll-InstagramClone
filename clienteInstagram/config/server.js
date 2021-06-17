//exigindo modulos 
const express = require('express');
const bodyParser = require(`body-parser`);
const consign = require(`consign`);
const expressSession = require(`express-session`);

//chamando a função express
const app = express();

//configurando os middlewares 
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(express.static(`./application/public`));

app.use(expressSession({
    secret: `2389uewhdsvk`,
    resave: false,
    saveUninitialized: false
}));

//configurando responsabilidade das views para o EJS e a localização das views 
app.set(`view engine`,`ejs`);
app.set(`views`,`./application/views`);


//automaticando os arquivos de controllers | models | routes | dataBase
consign().include(`config/database.js`)
         .then(`application/controllers`)
         .then(`application/models`)
         .then(`application/routes`)
         .into(app);

//tratando possiveis erros internos da aplicação
app.use((error,req, res, next) =>{

    res.status(500).render(`errors/500`);
    console.log(error);
    next();
});

//tratando possiveis erros externos da aplicação
app.use((error,req, res, next) =>{

    res.status(404).render(`errors/404`);
    console.log(error);
    next();
});


// exportando server
module.exports = app;
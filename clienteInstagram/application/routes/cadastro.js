//configurando a route '/cadastrar'
const {check} = require('express-validator');

module.exports = app =>{

    app.get(`/cadastrar`, (req, res) =>{

        app.application.controllers.cadastro.cadastrar(app, req, res);
    })

    app.post(`/cadastrando`, 
    check('email')
        .isEmail()
        .withMessage(`E-mail e obrigatorio!`),
    check(`usuario`)
        .isLength({ min: 1 })
        .withMessage(`Usuario e obrigatorio!`),
    check('senha')
        .isLength({ min: 5 })
        .withMessage(`A senha deve ter no minimo 5 caracteres!`),
    (req,res) =>{
        
        app.application.controllers.cadastro.cadastrando(app, req, res);
    });
}
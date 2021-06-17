const {check} = require('express-validator');

// configurando a route "/"
module.exports = app =>{

    app.get(`/`, (req,res) =>{
            
        app.application.controllers.index.login(app,req,res);
    });

    app.post(`/autentificar`, 
        check(`usuario`)
        .isLength({ min: 1})
        .withMessage(`Informe o nome do usuario`), 
        check(`senha`)
            .isLength({ min:5})
            .withMessage(`Infome uma senha valida!`),
            (req,res) =>{

                app.application.controllers.index.autentificar(app,req,res);

            });
}
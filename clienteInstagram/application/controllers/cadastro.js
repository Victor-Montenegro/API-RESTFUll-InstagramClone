const {validationResult} = require('express-validator');

module.exports.cadastrar = (app,req,res) => {




    res.render(`cadastro/cadastrar`,{errors: null, params:{}});
}

module.exports.cadastrando = (app,req,res) => {

    // tratando erros do usuario
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            
            res.status(400).render(`cadastro/cadastrar`,{ errors: errors.array(), params: req.body});
            return 
        }
    
    const dadosUsuario = req.body;

    //instanciando banco de dados e model
    const connection = app.config.database;
    const usuarioModel = new app.application.models.UsuariosDAO(connection);

    usuarioModel.novoUsuario(dadosUsuario,res);
}
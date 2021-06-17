//exigindo modulos 
const {validationResult} = require('express-validator');

module.exports.login = (app,req,res) => {

    res.render(`index/padrao`,{errors: null, params: {}});
}

module.exports.autentificar = (app,req,res) => {

    //trantando erros do usuarios
    const errors = validationResult(req);
        if(!errors.isEmpty()){
            
            res.status(400).render(`index/padrao`,{ errors: errors.array(), params: req.body});
            return 
        }
    
    const dadosUsuario = req.body;

    //istanciando banco de dados e model de Usuarios
    const connection = app.config.database;
    const usuariosModel = new app.application.models.UsuariosDAO(connection);

    usuariosModel.autentificar(dadosUsuario,req,res);

}
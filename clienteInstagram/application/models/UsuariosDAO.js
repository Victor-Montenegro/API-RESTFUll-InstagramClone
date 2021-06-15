const ObjectIdDB = require(`mongodb`).ObjectId;
const bcrypt = require( 'bcrypt' ); 

function UsuariosDAO(connection){
    this._connection = connection;
}

//função para inserir novo usuario 
UsuariosDAO.prototype.novoUsuario = function(dadosUsuario,res){

    //criptografando senha do usuario
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(dadosUsuario.senha, salt);
    dadosUsuario.senha = hash;
    // continuar a implementar a logica para inserção no banco
    const dados = {
        operacao: `insert`,
        usuario: dadosUsuario,
        collection: `usuarios`,
        callback: (err,result) =>{
            if(err){
                res.status(500).render(`errors/500`);
                console.log(err);
            }else{

                res.redirect(`/`);
            }
        }
    }
    // this._connection(dados);

    
}


// bcrypt.compare(myPlaintextPassword, hash, function(err, result) {
//     // result == true
// });

module.exports = () =>{

    return UsuariosDAO
}
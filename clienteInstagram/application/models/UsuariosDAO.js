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

    //configurando os parametros para inserção de dados no banco 
    const dados = {
        operacao: `insert`,
        usuario: dadosUsuario,
        collection: `usuarios`,
        callback: (err,result) =>{
            if(err){
                res.status(500).render(`errors/500`);
                console.log(err);
            }else{

                res.send(`
                <!DOCTYPE HTML>
                <html lang="pt-br">
                    <head>
                        <meta charset="UTF-8">
                
                        <title>Instagram Clone - WEB</title>
                        
                        <!-- JQuery -->
                        <script src="http://code.jquery.com/jquery-3.1.1.min.js"></script>
                
                        <!-- bootstrap - link cdn -->
                        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
                    
                        <!-- incluindo css -->
                        <link href="css/style.css" rel="stylesheet">

                        <script>
                            setTimeout(()=>{

                                window.location.href = 'http://localhost:3000/';
                            },4000);
                        </script>
                    </head>
                
                    <body>
                
                        <div class="container home">
                            <div class="row">
                                <div class="col-md-2"></div>
                                
                                <div class="col-md-4">
                                    <img src="images/celulares.jpg" class="img-responsive img-center"/>
                                </div>
                                
                                <div class="col-md-4 painel-login">
                                    <div class="panel panel-default">
                                        <div class="panel-body">
                                            <div class="row">
                                                <div class="col-md-12">
                
                                                    <img src="images/logo1.jpg" class="img-responsive img-center" />
                                                    <br />

                                                    <div class=" alert-success" 
                                                        
                                                        <ul> 
                                                            <li>Cadastro realizado com sucesso!</li>
                                                            <li>Redirecionando para a pagina de login!</li>
                                                        </ul>

                                                    </div>
                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                
                                <div class="col-md-2"></div>
                            </div>
                        </div>
                        
                    </body>
                </html>
                `);
            }
        }
    }

    //realizando conexão com o banco
    this._connection(dados);
    
}

UsuariosDAO.prototype.autentificar = function(dadosUsuario,req,res){

    const dados = {
        operacao: `find`,
        usuario: {usuario: dadosUsuario.usuario},
        collection: `usuarios`,
        callback: (err,result)=>{

            try {

                if(err){
                    console.log(err)
                }

                result.toArray((err,result)=>{

                    if(result.length == 0){
                        // console.log(result);
                        res.status(404).render(`index/padrao`,{errors: [{msg:`Usuario ou senha invalidos!`}],params:dadosUsuario});
                        return
                    }else{

                        let autentificao = bcrypt.compareSync(dadosUsuario.senha, result[0].senha);
                        if(autentificao){
                           req.session.usuario = result[0].usuario;
                           res.redirect(`/home`);
                        }
                    }
                    
                })
                
            } catch (error) {
                res.status(500).render(`errors/500`);
                console.log(error);
            }
        }
    };
    // console.log(dados)
    this._connection(dados)
}

module.exports = () =>{

    return UsuariosDAO
}
//exigindo modulos
const express = require('express');
const mongoClient = require(`mongodb`).MongoClient;
const objectIdDB = require(`mongodb`).ObjectId;
const bodyParser = require('body-parser');
const multiparty = require(`connect-multiparty`)
const {body, validationResult} = require('express-validator');
const fs = require(`fs`);
// chamando a função express
const app = express();

//configurando middlewares para tratar tipos de dados vindo da requisição x-www-form-urlencoded | JSON | files 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(multiparty())

//configurando middleware response para a permissção do request do browser para a nossa API
app.use((req,res,next) => {

    //dando acesso aos dominios/aplicações cliente as response do servidor pela propriedade Access-Control-Allow-Origin
    res.setHeader("Access-Control-Allow-Origin", "*");
    // ira configurar quais que são os metodos() que a origem/aplicação/dominio cliente  podem requitar 
    res.setHeader("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    // irá habilitar que a requisição efetuada pela origem tenha cabençahos reescritos atraves do content-type
    res.setHeader("Access-Control-Allow-Headers", "content-type"); // --> devemos informar  para o cabeçalho do nosso request que irá receber um JSON no body da requisição, ou seja, que vamos modificar/reescrever o contenty-type como JSON, por isso devemos permitir a modificação do content-type
    // habilitar as credenciais do dominio
    res.setHeader("Access-Control-Allow-Crentials", true);

    next();
});

// port do server
const port = 3000;

// configurando banco de dados
const mongoURL = 'mongodb://localhost:27017';

const dbName = `ApiPublicacao`;

var createConnection = (data) =>{

    mongoClient.connect(mongoURL,function(err,client){
        const db = client.db(dbName);
        console.log(`conexao realizada!`);
        query(db,data);

        client.close();

    });
}

//função que realiza a interação com banco de find | insert | update | delete 
function query(db,data){
    const collection = db.collection(data.collection)

    switch(data.operacao){

        case `find`:
            collection.find(data.usuario,data.callback);
            break
        case `insert`:
            collection.insertOne(data.usuario,data.callback);
            break;
        case `update`:
            collection.update(data.usuario,data.update,data.options,data.callback);
            break;
    };

}

//inserindo uma publicacao caso banco esteja vazio
const teste = {
    operacao: 'find',
    usuario: {},
    collection: 'publicacao',
    callback: function(err,records){
        records.toArray(function(err,result){
            if(result.length == 0){
                let primeira = {
                    operacao: 'insert',
                    usuario: {
                        titulo: "Pinguins!",
                        url_imagem: "1624276520569_imagem2.jpg", 
                        donoPublicacao: "admin"
                    },
                    collection: 'publicacao',
                    callback: function(err,records){}
                }
                createConnection(primeira)
            }
        })
    }
}

createConnection(teste)

//iniciando servidor na porta 3000
app.listen(port);
console.log(`servidor ON na porta ${port}`);

//configuração da route "/"
app.get(`/`, (req, res) => {

    res.send(`bem vindo! Faça suas publicações na /api |  passando chave valor EX: {titulo: "hello word",png_imagem: hello.png}`);
})

//configurando a route "/api" para realizar inserção de dados atraves do "POST"
app.post(
    '/api',
    body(`titulo`).notEmpty(),
    body(`arquivo`).custom((value, {req}) =>{
        if(req.files.arquivo === undefined){
            throw new Error("É obrigatorio uma imagem!");
        }
            return true;
    }),
    (req, res) => {
        

        // validando request do client
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            
            res.status(400).json({errors: errors.array()});
            return;
        }


        //instanciando localização temporaria do arquivo
        const path_origem = req.files.arquivo.path;
        
        //criando um identificador unico para o nome da imagem
        const date = new Date().getTime();
        const url_imagem = `${date}_${req.files.arquivo.originalFilename}`;
        const path_destino = `./uploads/${url_imagem}`;

        fs.rename(path_origem,path_destino, function(err){

            if(err){
                res.status(500).json(err);
            }else{
                const dadoAnexo = {
                    titulo: `${req.body.titulo}`,
                    url_imagem: url_imagem, 
                    donoPublicacao: req.body.donoPublicacao
                };
                
                //confgurando a inserção de dados para o banco dedados
                const dados = { 
                    operacao: `insert`,
                    usuario: dadoAnexo,
                    collection: `publicacao`,
                    callback: (err,records)=>{
                        if(err){
                            res.status(500).json({err});
                        }else{
                            res.status(200).json(records);
                        }
                    }
                };

                createConnection(dados);
            }

        });
        
        
});

// configurando route "/api" para a consulta de todas as  publicações via "GET"
app.get('/api', (req, res)=>{

    //configurando a consulta das publicações no banco
    const dados = { 
        operacao: `find`,
        usuario: {},
        collection: `publicacao`,
        callback: (err,records)=>{
            if(err){
                res.status(500).json(err);
            }else{

                records.toArray((err,records)=>{
                    
                    if(records.length == 0){
                        res.status(400).json({mensagem:`nao existe publicação`})
                        return
                    }
                    res.status(200).json(records)
                })
            }
        }
    };

    createConnection(dados)
})

//configurando route "/api/:id" para a consulta de uma publicação especifica via "GET"
app.get(`/api/:id`, (req,res)=>{

    const dados = {
        operacao: `find`,
        usuario: {_id: objectIdDB(req.params.id)},
        collection: `publicacao`,
        callback: (err,records) =>{
            if(err){
                res.status(500).json(err);
            }else{

                records.toArray( (err,records)=>{
                    
                    if(err){
                        res.status(500).json(err)
                    }else{

                        if(records.length == 0){
                            res.status(400).json({mensagem: `publicacao nao existe!`});
                        }else{

                            res.status(200).json(records);
                        }
                    }
                })
            }
        }

    };

    createConnection(dados)
})

//configurando route "/api/:id" para a atualização de comentarios dentro da publicação via "PUT"
app.put(
    `/api/:id`,
    body(`comentario`).notEmpty(),
    (req,res) =>{

        
        // tratando dados recebidos
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({errors:errors});
            return
        }

        //recebendo dados da requisição
        const dadosComentarios = req.body;
        
        //configurando o update de dados para o banco de dados
        const dados = {
            operacao: `update`,
            usuario: {_id: objectIdDB(req.params.id)},
            update: {
                $push: {
                    comentarios: {
                        id_comentario : new objectIdDB(),
                        comentario: dadosComentarios.comentario,
                        usuario: dadosComentarios.usuario
                    }
                }
            },
            options: options = {
                multi: true
            },
            collection: `publicacao`,
            callback: (err,result) =>{
                if(err){
                    res.status(500).json(err);
                }else{
                    res.status(200).json(result);
                }
            }
        }
        createConnection(dados);
    });

// configurando route "/api/:id" para a remoção de comentarios dentro da publicação 
app.delete(`/api/:id`, (req,res)=>{

    //configurando a remoção de comentarios para o banco de dados
    const dados = {
        operacao: `update`,
        usuario: {},
        update: {
            $pull: { 
                comentarios: {
                    id_comentario: objectIdDB(req.params.id)
                }
            }
        },
        options: {
            multi: true
        },
        collection: `publicacao`,
        callback: (err, records) =>{

            if(err){

                res.status(500).json(err)
            }else{

                res.status(200).json(records)
            }
        }
    };

    createConnection(dados);
});

//busca a imagem da publicacao 
app.get(`/api/imagem/:imagem`, (req, res) =>{

    //capturando url da imagem
    const url_imagem = req.params.imagem;
    //chamando funcao que localizará o arquivo/imagem
    fs.readFile(`./uploads/${url_imagem}`,(err,imagem)=>{
        if(err){
            res.status(400).json({mensagem:'imagem não encontrada'});
        }else{
            //configurando o header do response para sinalizar que o tipo e uma imagem/jpg
            res.writeHead(200,{'content-type': 'image/jpg'});
            res.end(imagem);
        }
    });
});

//middleware que irá tratar possiveis erros nos status externos
app.use(function(error,req, res, next){

    res.status(404).json({mensagem:"erro, nao foi possivel achar a pagina!"});

    next();
});

//middleware que irá tratar possiveis erros nos status internos
app.use(function(error,req, res, next){

    res.status(500).json({mensagem:"erro no servidor!"});

    next();
});


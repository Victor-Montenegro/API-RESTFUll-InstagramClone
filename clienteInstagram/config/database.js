//exigindo modulos de criação do banco
const clientMongoDB = require(`mongodb`).MongoClient;
const assert = require(`assert`);

//configurando banco de dados mongodb
// url de conexao do banco
const url = `mongodb://localhost:27017`;

// nome do banco de dados
const nameDB = `instagramUsuarios`;
const client = new clientMongoDB(url);

//conectando com banco de dados
const createConnection = (data) =>{

    client.connect(err =>{

        assert.equal(null,err);
        console.log(`conexao criada`);

        const db = client.db(nameDB);

        //função de interação com o banco
        query(data,db);

        client.close();
    });
};

//função de interação com o banco
function query(data,db){

    console.log(data);
    // const collection = db.collection(data.collection);

    // switch(data.operacao){
    //     case `find`:
    //         collection.find(data.usuario,data.callback)
    //         break;
    //     case `insert`:
    //         collection.insert(data.usuario,data.callback)
    //         break;
    // }
}

module.exports = () =>{

    return createConnection
}
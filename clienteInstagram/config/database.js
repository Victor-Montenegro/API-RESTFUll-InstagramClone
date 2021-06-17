//exigindo modulos de criação do banco
const clientMongoDB = require(`mongodb`).MongoClient;
const assert = require(`assert`);

//configurando banco de dados mongodb
// url de conexao do banco
const url = `mongodb://localhost:27017`;

// nome do banco de dados
const nameDB = `instagramUsuarios`;

//conectando com banco de dados
const createConnection = (data) =>{

    const client = new clientMongoDB(url);
        
    client.connect(err =>{

        assert.equal(null,err);
        console.log(`conexao criada`);

        const db = client.db(nameDB);

        //função de interação com o banco
        if(query(data,db)){
            
            client.close()
            console.log(`conexao fechada`)
        }

    });
};

//função de interação com o banco
function query(data,db){

    const collection = db.collection(data.collection);
    console.log(data)
    switch(data.operacao){
        case `find`:
            collection.find(data.usuario,data.callback)
            console.log(`fim de find`)
            return true;
            break;
        case `insert`:
            collection.insertOne(data.usuario,data.callback)
            return true;
            break;
    }
    
}

module.exports = () =>{

    return createConnection
}
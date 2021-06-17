//exigindo server
const app = require(`./config/server`);

const port = 8080;

app.listen(port, ()=>{
    console.log(`servidor ON na porta ${port}`)
})
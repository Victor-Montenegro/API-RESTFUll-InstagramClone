// configurando a route "/"
module.exports = app =>{

    app.get(`/`, (req,res) =>{

        app.application.controllers.index.login(app,req,res);
    });
}
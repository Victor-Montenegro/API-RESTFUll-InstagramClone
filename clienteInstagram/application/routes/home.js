module.exports = app =>{

    app.get(`/home`,(req,res) =>{

        app.application.controllers.home.index(app,req,res);
    });
}
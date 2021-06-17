module.exports.index = (app,req,res) => {

    if(!req.session.usuario){
        res.send(`

            <html>
                <head>
                    <script>
                        setTimeout(()=>{
                            window.location.href = 'http://localhost:8080/';
                        },4000);
                    </script>
                </head>
                <body>
                    <div class ="alert-success">
                        <ul>
                            <li>Por favor, realize o login!</li>
                            <li>redirecionando para a pagina de login!</li>
                        </ul>
                    </div>
                </body>
            </html>
            
        `)
    }

    res.render(`home/padrao`,{user:req.session.usuario});
}
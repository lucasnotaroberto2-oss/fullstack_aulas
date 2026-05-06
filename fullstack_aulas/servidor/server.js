require("colors");
var http = require("http");
var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(express.static("./public"));
var server = http.createServer(app);
server.listen(3000);
console.log("servidor rodando...".rainbow);
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.set('view engine', 'ejs')
app.set('views', './views');


//inserção do banco de dados
var mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://lucas_queiroz:mWf8kjkacgNGxfEI@cluster0.v0wgphd.mongodb.net/?appName=Cluster0"
const client = new MongoClient(uri, { useNewUrlparser : true })

var dbo = client.db("exemplo_bd");
var usuarios = dbo.collection("usuarios")

// 🟢 FORM GET
app.get('/inicio', (req, res) => {
    const text = req.query.text;
    const num = req.query.num; //get usa o query
    const date = req.query.date;
    const color = req.query.color;
    const password = req.query.password;

    console.log("GET:");
    console.log(text, num, date, color, password);

    res.send("Dados recebidos via GET");
});
// 🟣 FORM POST
app.post('/inicio', (req, res) => {
    const text = req.body.text;
    const num = req.body.num; //post usa o body
    const date = req.body.date;
    const color = req.body.color;
    const password = req.body.password;
    console.log("POST:");
    console.log(text, num, date, color, password);
    res.send("Dados recebidos via POST");
});
// 🔴 CADASTRO
app.post('/cadastro', (req, res) => {
    const nome = req.body.nome1;
    const login = req.body.login1;
    const senha = req.body.senha1;
    console.log("CADASTRO:");
    console.log(nome, login, senha);
    res.render('resposta', {
        resposta: "cadastrado com sucesso"
        
    });
});

app.post("/cadastrar_usuario",function(req,res){
    var data = { db_nome : req.body.nome,db_login : req.body.login,db_senha : req.body.senha } //construção dos dados para inserir no banco de dados
    usuarios.insertOne(data,function(err){ //insertOne cria as informações dentro do banco de dados
        if(err){
            res.render("resposta_usuario.ejs",{resposta : "erro ao cadastrar usuario"})
        }
        else{
            res.render("resposta_usuario.ejs",{resposta : "usuario cadastrado com sucesso"}) //o arquivo sempre manda a resposta no arquivo ejs
        };
    });
})
//o nome das variaveis precisam ser iguais no html e no javascript
//a versão do mongo precisa ser a versão 4.12(npm install mongo@12)
//é preciso fazer a instalação do ejs antes de rodar o servidor, caso contrario a pagina ejs não abre
app.post("/logar_usuario",function(req,res){
    var data = { 
        db_login : req.body.login,
        db_senha : req.body.senha 
    }
    usuarios.find(data).toArray(function(err, items) { //find procura as informações no banco de dados
        console.log(items);
        if (items.length == 0) {
            res.render('resposta_usuario.ejs', {resposta: "Usuário/senha não encontrado!"})
        }else if (err) {
            res.render('resposta_usuario.ejs', {resposta: "Erro ao logar usuário!"})
        }else {
            res.render('resposta_usuario.ejs', {resposta: "Usuário logado com sucesso!"})        
        };
    });
})
//o comando render sempre procura por arquivos ejs, independente se estiver com o ".ejs" ou não
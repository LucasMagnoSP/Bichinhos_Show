var express = require("express");
const port = 5000;
const app = express();
const oracledb = require('oracledb');
const chalk = require('chalk');
const moment = require("moment/moment");
 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.set('views', './views');

//HOME
  app.get("/", (req, res) => { 
    res.render('index');
  });
//

//PROFILE
app.post('/profile',(req,res)=>{ // OK

  req.
  res.render('profile', data)
})

//

//ADOTADOS
  app.get('/adotados',(req,res)=>{
    let sql = `select JSON_OBJECT(*) from adotados`
    const objarry = new Array;
    querry(req,res,sql).then(result =>{
        for (let i in result.rows) {
            objarry.push(JSON.parse(result.rows[i]))
            moment.locale('pt-br')
            objarry[i].ADOCAO = moment(objarry[i].ADOCAO).fromNow();
        }
        res.render('adotados',{data : objarry})
    })
  })
//
//ADOÇÃO
  app.get("/adocao", (req, res) => {
    res.render('adocao');
  });
  app.post('/adocao',(req,res)=>{
    let especieSql
    if(req.body.inputEspecie == 'cachorros'){
       especieSql = 'Cachorro'
    }else{
       especieSql = 'Gato'
    }
    let sql = `INSERT INTO ${req.body.inputEspecie}(nome,especie,sexo,idade,deficiencia,raca,cor,peso) VALUES ('${req.body.inputNome}','${especieSql}','${req.body.inputSexo}','${req.body.inputIdade}','${req.body.inputDeficiencia}','${req.body.inputRaca}','${req.body.inputCor}',${req.body.inputPeso})`
    querry(req,res,sql).then(result =>{
      res.render('adocaosucess')
    })
  })
//
///CACHORROS
  app.get('/cachorros',(req,res)=>{
    let sql = `select JSON_OBJECT(*) from cachorros`
    const objarryCa = new Array;
    querry(req,res,sql).then(result =>{
        for (let i in result.rows) {
            objarryCa.push(JSON.parse(result.rows[i]))
        }
        res.render('cachorros',{data : objarryCa})
    })
  })
//
//GATOS
  app.get('/gatos',(req,res)=>{
    let sql = `SELECT JSON_OBJECT(*) FROM gatos`
    querry(req,res,sql).then(result =>{
        const objarryGatos = new Array;
        for (let i in result.rows) {
            objarryGatos.push(JSON.parse(result.rows[i]))
        }
        res.render('gatos',{data : objarryGatos})
    })
  })

  app.post('/gatos',(req,res)=>{
    res.render('profile')
  })
//
//PESQUISA
  app.get('/search',(req,res)=>{
    res.render(`search`)
  })
  app.post('/search',(req,res)=>{
    let sql = `SELECT JSON_OBJECT(*) FROM ${req.body.pettype} WHERE LOWER(${req.body.inputFiltro}) LIKE LOWER('%${req.body.searchInsert}%')`
    querry(req,res,sql).then(result=>{
      if(result.rows.length == 0) return res.render('search') 
      const objarry = new Array;
      for (let i in result.rows) { 
          objarry.push(JSON.parse(result.rows[i]))
      }
      res.render('result',{data : objarry})
    })
  })
//
//PEGAR TODOS OS DADOS DO BANCO
async function querry(req, res , sql) {
  try {
      connection = await oracledb.getConnection({
          user: "lucas",
          password: '1234',
          connectString: "localhost:1521"
      });
      console.log(chalk.bgBlack.green('CONECTADO AO BANCO DE DADOS'));
      result = await connection.execute(sql);
      await connection.execute('commit')
  } catch (err) {
      return res.send(err.message);
  } finally {
      if (connection) {
          try {
          await connection.close();
          console.log(chalk.bgBlack.red('CONN FINALIZADA'));
          } catch (err) {
              console.error(err.message);
          }
      }
      console.log(chalk.bgBlack.blue(chalk.bgGreen.bold('Operaçao Realizada : ')+sql));
      return result;
  }
}
//
//LISTEN
  app.listen(port, () => {
    console.log(`Aplicação iniciada com sucesso na porta -> ${port}`);
  });
//
var express = require("express");
const port = 5000;
const app = express();
const oracledb = require('oracledb');
const chalk = require('chalk')
 
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
    let sql = `INSERT INTO ${req.body.inputEspecie}(nome,especie,sexo,idade,deficiencia,raca,cor,peso)
    VALUES ('${req.body.inputNome}','${especieSql}','${req.body.inputSexo}','${req.body.inputIdade}','${req.body.inputDeficiencia}','${req.body.inputRaca}','${req.body.inputCor}',${req.body.inputPeso})`
    insert(req,res,sql).then(result =>{
      res.render('adocao')
    })
  })

  async function insert(req, res, sql) {
    try {
        connection = await oracledb.getConnection({
            user: "lucas",
            password: '1234',
            connectString: "localhost:1521"
        });
        console.log(chalk.bgBlack.green('CONECTADO AO BANCO DE DADOS'));
        await connection.execute(sql);
    }catch (err) {
        return res.send(err.message);
    }finally {
        if (connection) {
          try {
              await connection.execute('commit')
              console.log(chalk.bgBlack.blue('O COMANDO ' + sql + ' FOI EFETUADO COM SUCESSO'));
              await connection.close();
              console.log(chalk.bgBlack.red('CONN FINALIZADA'));
          } catch (err) {
              console.error(err.message);
            }
      }
    }
  }
//
///CACHORROS
  app.get('/cachorros',(req,res)=>{
    const objarryCa = new Array;
    allcachorros(req).then(result =>{
        for (let i in result.rows) {
            objarryCa.push(JSON.parse(result.rows[i]))
        }
        res.render('cachorros',{data : objarryCa})
    })
  })
  async function allcachorros(req, res) {
    try {
        connection = await oracledb.getConnection({
            user: "lucas",
            password: '1234',
            connectString: "localhost:1521"
        });
        console.log(chalk.bgBlack.green('CONECTADO AO BANCO DE DADOS'));
        result = await connection.execute(`select JSON_OBJECT(*) from cachorros`);
    }catch (err) {
        return res.send(err.message);
    }finally {
        if (connection) {
            try {
                await connection.close();
                console.log(chalk.bgBlack.red('CONN FINALIZADA'));
            } catch (err) {
                console.error(err.message);
            }
        }
        console.log(chalk.bgBlack.blue('RETORNANDO DADOS OBTIDOS DA TABLE'));
        return result;
    }
  }
//
//GATOS
  app.get('/gatos',(req,res)=>{
    allgatos(req).then(result =>{
        const objarryGatos = new Array;
        for (let i in result.rows) {
            objarryGatos.push(JSON.parse(result.rows[i]))
        }
        res.render('gatos',{data : objarryGatos})
    })
  })
  async function allgatos(req, res) {
    try {
        connection = await oracledb.getConnection({
            user: "lucas",
            password: '1234',
            connectString: "localhost:1521"
        });
        console.log(chalk.bgBlack.green('CONECTADO AO BANCO DE DADOS'));
        result = await connection.execute(`select JSON_OBJECT(*) from gatos`);
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
        console.log(chalk.bgBlack.blue('RETORNANDO DADOS OBTIDOS DA TABLE'));
        return result;
    }
  }
//
//PESQUISA
  app.get('/search',(req,res)=>{
    res.render(`search`)
  })
  app.post('/search',(req,res)=>{
    let sql = `SELECT JSON_OBJECT(*) FROM ${req.body.pettype} WHERE LOWER(${req.body.option}) LIKE LOWER('%${req.body.searchInsert}%')`
    console.log(sql)
    searchMethod(req,res,sql)
  })
  function searchMethod(req,res,sql){
    search(req,res,sql).then(result=>{
        if(result.rows.length == 0) return res.render('search') 
        const objarry = new Array;
        for (let i in result.rows) { 
            objarry.push(JSON.parse(result.rows[i]))
        }
        res.render('result',{data : objarry})
    })
  }
  async function search(req,res,sql) {
    try {
        connection = await oracledb.getConnection({
            user: "lucas",
            password: '1234',
            connectString: "localhost:1521"
        });
        console.log(chalk.bgBlack.green('\n\nCONECTADO AO BANCO DE DADOS'));
        result = await connection.execute(sql);
      
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
        console.log(chalk.bgBlack.blue('RETORNANDO DADOS OBTIDOS DA TABLE'));
        return result;
    }
  }
//
//LISTEN
  app.listen(port, () => {
    console.log(`Aplicação aberta com sucesso na porta -> ${port}`);
  });
//
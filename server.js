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
// MOSTRAR TODOS OS CACHORROS
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
  app.get('/cachorros',(req,res)=>{
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;
    const objarryCa = new Array;
    const resl = {}
    allcachorros(req).then(result =>{
        for (let i in result.rows) {
            objarryCa.push(JSON.parse(result.rows[i]))
        }
        result = null;
        
        if(endIndex < objarryCa.length){
            resl.next = {
                page: page + 1,
                limit: limit,
            }
        }
        if(startIndex > 0){
            resl.previous = {
                page: page - 1,
                limit: limit,
            }
        }
        resl.results = objarryCa.slice(startIndex, endIndex);

        // const resl = objarryCa.slice(startIndex, endIndex);
        // console.log("page " + page)
        // console.log("limite " + limit)
        console.log(resl)
        res.render('cachorros',{data : resl.results})
    })
  })
//

//MOSTRAR TODOS GATOS
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
  app.get('/gatos',(req,res)=>{
    allgatos(req).then(result =>{
        const objarryGatos = new Array;
        for (let i in result.rows) {
            objarryGatos.push(JSON.parse(result.rows[i]))
        }
        result = null;
        res.render('gatos',{data : objarryGatos})
    })
  })
//

//PESQUISA
  app.get('/search',(req,res)=>{
    res.render(`search`)
  })
  app.post('/search',(req,res)=>{
    var insertpet = req.body.petid
    var tipo = req.body.type
    var insert = (req.body.insert).substring(0, 1).toUpperCase() + (req.body.insert).substring(1)
    var sql
    if(tipo == 'nome') (insertpet == 'cachorro') ? sql = `SELECT JSON_OBJECT(*) FROM cachorros WHERE nome = (:bv1)` : sql = `SELECT JSON_OBJECT(*) FROM gatos WHERE nome = (:bv1)`  
    if(tipo == 'raca') (insertpet == 'cachorro') ? sql = `SELECT JSON_OBJECT(*) FROM cachorros WHERE raca = (:bv1)` : sql = `SELECT JSON_OBJECT(*) FROM gatos WHERE raca = (:bv1)`
    if(tipo == 'cor') (insertpet == 'cachorro') ? sql = `SELECT JSON_OBJECT(*) FROM cachorros WHERE cor = (:bv1)` : sql = `SELECT JSON_OBJECT(*) FROM gatos WHERE cor = (:bv1)`
    searchMethod(req,res,insert,sql)
  })
  function searchMethod(req,res,insert,sql){
    search(req,res,insert,sql).then(result=>{
        if(result.rows.length == 0) return res.render('search') 
        const objarry = new Array;
        for (let i in result.rows) {
            objarry.push(JSON.parse(result.rows[i]))
        }
        result = null;
        res.render('result',{data : objarry})
    })
  }
  async function search(req,res,insert,sql) {
    try {
        connection = await oracledb.getConnection({
            user: "lucas",
            password: '1234',
            connectString: "localhost:1521"
        });
        console.log(chalk.bgBlack.green('\n\nCONECTADO AO BANCO DE DADOS'));
        const binds = [insert];
        result = await connection.execute(sql,binds);
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
    console.log(`The application started
    successfully on port ${port}`);
  });
//
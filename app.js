const express = require('express')
const app = express()
const bodyParser = require('body-parser')
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'Sketch',
  password: 'abdel996',
  database: 'citationDB'
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('form')
  });


app.get('/citation',(req, res) => {
    connection.query('SELECT q.* , a.auteurName FROM quotes q JOIN auteur a ON q.auteurID = a.id ',(err,rows,fields) =>{
      if(!err){
      
        res.render('index',{cit : rows})
        // console.log(rows)
      }
      else 
        console.log(err)
    })
})

app.get('/citation/:id',(req, res) => {
  connection.query('SELECT q.* , a.auteurName FROM quotes q JOIN auteur a ON q.auteurID = a.id  WHERE q.id = ?',[req.params.id],(err,rows,fields) =>{
    if(!err){
      
      
      res.render('index',{cit : rows})
    }
    else 
      console.log(err)
  })
})

app.post('/citation', function (req, res, next) {

  let id = null;
  let text = req.body.Citation;
  let auteur = req.body.Auteur;
  let source = req.body.Source;


  
      var author={
          id : id,
          auteurName: auteur
      }

      connection.query('INSERT INTO auteur SET ?', author, function (err, result) {
      
          if (!err) {

              var data = {
                  id: id,
                  auteurID: result.insertId,
                  source: source,
                  citation: text
              }
            
              connection.query('INSERT INTO quotes SET ?', data, function (err, result) {
                  if (!err) {

                      res.redirect('/citation');
                      
                  }
              })
          }
      })


  
})

app.get('/delete/:id', function(req,res){
  //By ZNITI
  let citId = req.params.id

  connection.query('DELETE FROM quotes WHERE id = "' + citId + '"',(err,result) =>{
    if(!err){
      connection.query('DELETE FROM auteur WHERE id = "' + citId + '"',(err,result) =>{
        if(!err)
          res.redirect('/citation')
        else
          res.send(err)
      })
    } 
    else
    res.send(err)

  })

} )

app.get('/update/:id', function(req,res){

  let citId = req.params.id

  connection.query("SELECT * FROM quotes WHERE id = '" + citId + "' ",(err,result) =>{
    if(!err){
      res.render('update.ejs',{test : result})
      
      
    }
    else {
      res.send(err)
    }
  })
  


})

app.post('/update/:id',(req,res)=>{

  let id = req.params.id ;
  let text = req.body.Citation;
  let auteur = req.body.Auteur;
  let source = req.body.Source;


  console.log(id)
  connection.query("UPDATE quotes SET citation = '" + text + "', source = '" + source + "' WHERE id = '" + id + "'",(err,result) =>{
    if(!err){
      connection.query("UPDATE auteur SET auteurName = '" + auteur + "' WHERE id = '" + id + "'",(err,result) =>{
        if(!err) {
          res.redirect("/citation")
        } else {
          console.log(2)
        }

    })
  }
  else{
    console.log(1)

  }

})

})


connection.connect((err) => {
  if(!err)
      console.log('DB connection succeded.')
  else
      console.log('DB connection failed \n Error :' + JSON.stringify(err,undefined, 2))
})




app.listen(3000, () => console.log('Listening on port 3000...'))

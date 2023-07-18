const express =require('express');
const bodyparser = require('body-parser')
const bcrypt=require('bcrypt-nodejs')
const cors=require('cors')
const knex = require('knex')
const db=knex({
    client: 'pg',
    connection:{
    host: '127.0.0.1',
    user: 'postgres',
    password:'test',
    database:'smart_brain'
    } 
});

const app = express();

app.use(bodyparser.json());
app.use(cors());


app.get('/',(req, res)=>
{
    res.send(database.users);
})

app.post('/signin', (req,res)=>{
    const {email,password}=req.body;
    if(!email||!password)
    {
       return  res.status(400).json("incorrect form submission");
    }
    db.select('email','hash').from('login')
    .where('email', '=' , email)
    .then(data=>{
       const isvalid= bcrypt.compareSync(password,data[0].hash);
       if(isvalid){
        db.select('*').from('users')
        .where('email','=',email)
        .then(user=>{
            res.json(user[0])
        })
        .catch(err=>res.status(400).json("unable to get user"))
       }
       else{
        res.status(400).json("wrong inputs")
       }
    })
    .catch(err=>res.status(400).json("wrong inputs"))
})

app.post('/register',(req,res)=>{
    const {email, name, password}=req.body;
    if(!email||!name||!password)
    {
       return  res.status(400).json("incorrect form submission");
    }
    const hash = bcrypt.hashSync(password); 
    db.transaction(trx=>{
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            trx('users').returning('*').insert({
                email:loginEmail[0].email,
                name: name,
                joined: new Date()
            }).then(user =>{
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err=> res.status(400).json("unable to register"))
}) 

app.get('/profile/:id',(req, res)=>{
    const {id}=req.params;
    db.select('*').from('users').where({id:id}).then(user=>{
        if(user.length){
        res.json(user[0]);
        }
        else
        {
            res.status(400).json('not found')
        }
    })
})

app.put('/image',(req, res)=>{
    const {id}=req.body;
    db('users').where('id','=',id).increment('entires',1)
    .returning('entires')
    .then(entires =>{
        res.json(entires[0].entires);
    })
    .catch(err => res.status(400).json("unable to get entries"))
})




app.listen(3000,()=>{
    console.log("app running");
})

/*

/ --> res = this is working
/signin --> post = success/fail
/register --> post = user
/profile/:userId --> get = user
/image --> put = user

*/
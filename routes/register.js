const express = require('express');
const router = express.Router();
const db = require('../db_connection/dbconnection')
const axios = require('axios')

const randoms = ()=>{
  let chars = '0123456789abcdefghijklmnopqrstuvwxyz'
  let chars_lenght = 24
  let text = ''
  for( var i=0; i < chars_lenght; i++ ){
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text
}

const randoms_check = (results)=>{
  let credential_switch = true
  let credential_map_switch = true
  let credential = ''
  while(credential_switch){
    credential = randoms()
    for(i=0; i<results.length; i++){
      if(results[i].credential===credential){
        i = results.length
        credential_map_switch = false
      }
    }
    if(credential_map_switch===true){
      credential_switch = false
    }
  }
  return credential
}

const register_credential = (dbs,callback) =>{
  let credential_qur = 'select userid from member where credential = ?'
  return db.query(credential_qur,[dbs.credential],(err,results)=>{
    if(!err){
      callback(results[0].userid)
    }else{
      callback(null)
    }
  })
}

router.post('/', (req, res, next)=> {
  let dbs = req.query
  let reg_qur = 'insert into member(name, userid, credential,password ) VALUES(?,?,?,?)'
  let check_qur = 'select * from'+
  '(select count(*) as nameCnt from member where name = ? )a,'+
  '(select count(*) as idCnt from member where userid = ?)b'
  register_credential(dbs,(data)=>{
    let credential = randoms_check(data)
    db.query(check_qur,[dbs.name,dbs.userid,dbs],(err, results)=>{
      if(!err){
        if(results[0].nameCnt>=1){
          res.json({type : "name",value : dbs.name})
        }else if(results[0].idCnt>=1){
          res.json({type : "userid",value : dbs.userid})
        }else{
          db.query(reg_qur,[dbs.name,dbs.userid,credential,dbs.password],(err, results)=>{
            if(!err){
              res.send("ok")
            }else{
              console.log(err)
            }
          })
        }
      }else{
        console.log(err)
      }
    })
  })
});


module.exports = router;

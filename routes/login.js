const express = require('express');
const router = express.Router();
const db = require('../db_connection/dbconnection')

router.post('/', (req, res)=> {
  let dbs = req.query
  let login_qur = 'select name, credential, profile_image from member where userid = ? and password = ?'
  let requrl = 'http://'+req.get('host')+'/image/'
  db.query(login_qur,[dbs.userid,dbs.password],(err,results)=>{
    if(!err){
      if(results.length===0){
        res.json("fail")
      }else{
        res.json({
          name : results[0].name,
          credential : results[0].credential,
          profile_image : requrl+results[0].profile_image,
        })
      }
    }else{
      console.log("실패")
    }
  })
})

module.exports = router;
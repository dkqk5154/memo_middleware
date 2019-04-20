const express = require('express');
const router = express.Router();
const db = require('../db_connection/dbconnection')
const multer = require('multer')
const upload_path = '../node-express/images/upload'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, upload_path)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname)
  }
})
const upload = multer({ storage: storage })

const register_credential = (dbs,callback) =>{
  let credential_qur = 'select userid from member where credential = ?'
  return db.query(credential_qur,[dbs.credential],(err,results)=>{
    if(!err){
      callback(results[0])
    }else{
      callback('fail')
    }
  })
}


router.post('/', (req, res)=> {
  let dbs = req.query
  let confirm_qur = 'select * from member where userid = ? and password = ?'
  register_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      db.query(confirm_qur,[userid,dbs.password],(err,results)=>{
        if(!err){
          if(results.length===0){
            res.send("fail")
          }else{
            res.send("ok")
          }
        }else{
          console.log("실패")
        }
      })
    }
  })
})

router.post('/counter',(req,res)=>{
  let dbs = req.query
  let couter_qur = 'select count(*) as count from board where userid = ?'
  register_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      db.query(couter_qur,[userid],(err,results)=>{
        if(!err){
          console.log(results[0].count)
          res.send(results[0].count+'')
        }
      })
    }
  })
})

router.post('/update/name',(req, res)=>{
  let dbs = req.query
  let update_name_qur = 'update member set name=? where userid=?'
  register_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      db.query(update_name_qur,[dbs.name,userid],(err,results)=>{
        if(!err){
          res.send(true)
        }else{
          console.log("실패")
        }
      })
    }
  })
})

router.post('/update/profile',upload.single('file'),(req, res)=>{
  let dbs = req.query
  let image_name = req.file.filename
  let requrl = 'http://'+req.get('host')+'/image/'
  let update_profile_qur = 'update member set profile_image = ? where userid = ?'
  register_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      db.query(update_profile_qur,[image_name,userid],(err,results)=>{
        if(!err){
          res.json({
            status : true,
            profile_image : requrl+image_name
          })
        }else{
          res.json({
            status : false,
            profile_image : 'fail'
          })
        }
      })
    }
  })
})


module.exports = router;
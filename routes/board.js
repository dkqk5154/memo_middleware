const express = require('express');
const router = express.Router();
const db = require('../db_connection/dbconnection')

const board_credential = (dbs,callback)=>{
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
  board_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      let board_qur = ' set @rownum:=0; '
      +'  select @rownum:=@rownum+1 as row,b.* from '
      +'  (select no,title,content,register_date,update_date from board where userid = ?)b '
      +'  limit 0,10 '
      db.query(board_qur,[userid],(err,results)=>{
        if(!err){
          res.json(results)
        }else{
          res.send('err')
        }
      })
    }
  })
})

router.post('/list', (req, res)=> {
  let dbs = req.query
  board_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      let list_qur = ' set @rownum:=?; '
      +'  select @rownum:=@rownum+1 as row,b.* from '
      +'  (select no,title,content,register_date,update_date from board where userid = ?)b '
      +'  limit ?,? '
      let rownum = Number(dbs.view_count)
      let limit = Number(dbs.view_board_list)
      db.query(list_qur,[rownum,userid,rownum,limit],(err,results)=>{
        if(!err){
          res.json(results)
        }else{
          console.log(err)
        }
      })
    }
  })
})

router.post('/search',(req,res)=>{
  let dbs = req.query
  board_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      let search_qur = '  select no,title,content,register_date,update_date  '
      +' from board where ?? like concat("%",?,"%") and userid like ?  '
      db.query(search_qur,[dbs.form,dbs.keyword,userid],(err,results)=>{
        if(!err){
          res.json(results)
        }else{
          console.log(err)
        }
      })
    }
  })
})

router.post('/create',(req,res)=>{
  let dbs = req.query
  board_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      let create_qur = 'insert into board(userid, title, content) values(?,?,?)'
      db.query(create_qur,[userid,dbs.title,dbs.content],(err,results)=>{
        if(!err){
          res.send("ok")
        }else{
          res.send("fail")
        }
      })
    }
  })
})

router.post('/update',(req,res)=>{
  let dbs = req.query
  board_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      let update_qur ='update board set title = ? , content = ? , update_date = ? where no = ? and userid = ?'
      db.query(update_qur,[dbs.title,dbs.content,dbs.update_date,dbs.no,userid],(err,results)=>{
        if(!err){
          res.send("ok")
        }else{
          res.send("fail")
        }
      })
    }
  })
})

router.post('/remove',(req,res)=>{
  let dbs = req.query
  board_credential(dbs,(data)=>{
    if(data===undefined){
      res.send('err')
    }else{
      let userid = data.userid
      let remove_qur ='delete from board where no = ? and userid = ?'
      db.query(remove_qur,[dbs.no,userid],(err,results)=>{
        if(!err){
          res.send("ok")
        }else{
          res.send("fail")
        }
      })
    }
  })
})

module.exports = router;
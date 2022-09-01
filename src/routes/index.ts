import express from 'express';
import { getLogger } from '@/utils/loggers';
const router = express.Router();
const logger = getLogger('INDEX_ROUTE');

import db from '../utils/database';

/* GET home page. */
router.get('/', function (_req, res, _next) {
  res.render('index');
});

router.get('/add', async function(req,res,next){
  const clients:any = await db.execute('SELECT client_id, client_name FROM client WHERE client_state = "active"')
  const types:any = await db.execute('SELECT type_id, type_name FROM type WHERE type_state = "active"')
  res.render('addForm', {clients: clients[0], types: types[0]})
})

router.get('/clients', async function(req,res,next){
  const clients:any = await db.execute('SELECT client_id, client_name FROM client WHERE client_state = "active"')
  res.send(clients[0])
})

router.get('/types', async function(req,res,next){
  const types:any = await db.execute('SELECT type_id, type_name FROM type WHERE type_state = "active"')
  res.send(types[0])
})

router.post('/trx', async function(req,res,next){
  logger.info(req.body)
  let debe = 0
  let haber = 0
  let importe = req.body.import
  if(req.body.import.includes(',')){
    importe = req.body.import.replace(',','.')
  }
  if(req.body.trx == '1'){
    debe = parseFloat(importe)
  } else {
    haber = parseFloat(importe)
  }
  const {client, trx, date} = req.body

  const queryText:string = 'INSERT INTO trx (client_id, type_id, trx_debe, trx_haber, trx_date) VALUES (?,?,?,?,?)'
  await db.execute(queryText,[parseInt(client), parseInt(trx), debe, haber, date])
  res.redirect('/add')
})

export default router;

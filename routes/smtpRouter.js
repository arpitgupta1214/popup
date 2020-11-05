const router = require('express').Router()
const smtpCtrl = require('../controllers/smtpCtrl')

router.route('/')
    .post(smtpCtrl.createSmtp)
    .get(smtpCtrl.getSmtp)
  
   


module.exports = router
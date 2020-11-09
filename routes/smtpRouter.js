const router = require("express").Router();
const smtpCtrl = require("../controllers/smtpCtrl");

router.route("/").get(smtpCtrl.getSmtp);

router.route("/add").post(smtpCtrl.createSmtp);
router.route("/edit").post(smtpCtrl.editSmtp);
router.route("/options").get(smtpCtrl.getOptions);
router.route("/addcategory").post(smtpCtrl.createCategory);

module.exports = router;

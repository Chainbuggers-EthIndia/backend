const express = require("express");
var router = express.Router();
const {
  getEntities,
  getEntitiesById,
  addOrUpdateEntitiy,
  updateEntityById,
} = require("../utils/dynamo");

router.post("/register", async(req,res)=>{
  const auditCompCheck = await getEntities("Audit_company");
  const companyCheck = await getEntities("Company");
  let existingIds = [];
  auditCompCheck.Items.forEach((item) => {
    existingIds.push(Number(item._id));
  });
  companyCheck.Items.forEach((item) => {
    existingIds.push(Number(item._id));
  });

  let _id;
  do {
    _id = Math.floor(Math.random() * 10000);
  } while (existingIds.includes(_id));
  _id = "CO" + _id.toString();

  const companyData = {
    _id,
    name: req.body.name,
    walletAdd: req.body.wallet,
    password: req.body.password,
    sector: req.body.sector,
    role:"Company"
  };
  try {
    const result = await addOrUpdateEntitiy("Company", companyData);
    res.json({
        result: "data added Successfully",
        "_id": _id,
        "note":"Save the ID for further login"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding data." });
  }
})


module.exports = router;
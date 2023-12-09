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

router.post("/login", async(req, res)=>{
  try {
   
       let comp = await getEntitiesById("Company",{_id:req.body.companyId})
      
      if(!comp.Item){
          return res.status(401).send("Unauthenticated")
      }
      console.log("a,",comp.Item,"---",req.body)
      if(comp.Item.password !== req.body.password){
          return res.status(401).send("Unauthenticated")
      }
      res.send({data:comp.Item})
  } catch (error) {
      console.error(error);
  res.status(500).json({error})
  }
})


module.exports = router;
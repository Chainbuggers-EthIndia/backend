const express = require("express");
var router = express.Router();
const {
  getEntities,
  getEntitiesById,
  addOrUpdateEntitiy,
  updateEntityById,
} = require("../utils/dynamo");

router.post("/register", async (req, res) => {
  const auditCompCheck = await getEntities("Audit_company");
  let existingIds = [];
  auditCompCheck.Items.forEach((item) => {
    existingIds.push(Number(item._id));
  });

  let _id;
  do {
    _id = Math.floor(Math.random() * 10000);
  } while (existingIds.includes(_id));
  _id = "AU" + _id.toString();

  const auditCompData = {
    _id,
    name: req.body.name,
    walletAdd: req.body.wallet,
    password: req.body.password
  };
  try {
    const result = await addOrUpdateEntitiy("Audit_company", auditCompData);
    res.json({
        result: "data added Successfully",
        "_id": _id,
        "note":"Save the ID for further login"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while adding data." });
  }
});


router.post("/login", async(req, res)=>{
    try {
        const comp = await getEntitiesById("Audit_company",{_id:req.body.companyId})
        if(!comp){
            return res.status(401).send("Unauthenticated")
        }
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

const express = require("express");
const multer = require("multer");
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

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
    password: req.body.password,
    role:req.body.role
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
        let comp
        if(req.body.role === "Company"){
          comp = await getEntitiesById("Company",{_id:req.body.companyId})
        }
        else{
          comp = await getEntitiesById("Audit_company",{_id:req.body.companyId})
        }
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

router.get("/get/auditors", async(req, res)=>{
  try {
    const auditors = await getEntities("Audit_company")
    res.send({data:auditors.Items})
  } catch (error) {
    console.error(error);
    res.status(500).json({error})
  }
})


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); 
  },
  filename: function (req, file, cb) {
    const uniqueFilename = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage}); 


const lighthouseUpload = (path) => {
  const apiUrl = 'https://node.lighthouse.storage/api/v0/add';
  const apiKey = 'ad67a2de.cc73d92b0506495e8db6e7178b087142'; // Replace with your actual API key
  const fileData = fs.createReadStream(path);

  const formData = new FormData();
  formData.append('file', fileData);

  return axios.post(apiUrl, formData, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(response => {
      console.log('Response:', response.data);
      return response.data;
    })
    .catch(error => {
      console.error('Error:', error);
      throw error; 
    });
};

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file was uploaded.");
    }

    const data = await lighthouseUpload(`./uploads/${req.file.filename}`);
    // console.log("data", data);

    res.json({ path: `/uploads/${req.file.filename}`,
  uri:`https://gateway.lighthouse.storage/ipfs/${data.Hash}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message }); 
  }
});


module.exports = router;
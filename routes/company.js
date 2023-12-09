const express = require("express");
var router = express.Router();
const {
  getEntities,
  getEntitiesById,
  addOrUpdateEntitiy,
  updateEntityById,
} = require("../utils/dynamo");

router.post("/register", async(req,res)=>{
    
})
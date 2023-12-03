const AWS = require('aws-sdk');
require('dotenv').config();
const fs = require('fs');


AWS.config.update({ 
  region: process.env.AWS_DEFAULT_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamo = new AWS.DynamoDB.DocumentClient();


const handleDynamoError = (error) => {
  console.error('DynamoDB Error:', error);
  throw error;
};


const getEntities = async (TABLE_NAME) => {
  const params = {
    TableName: TABLE_NAME
  };
  try {
    const characters = await dynamo.scan(params).promise();
    // console.log(characters);
    return characters;
  } catch (error) {
    handleDynamoError(error);
  }
};


const getEntitiesById = async (TABLE_NAME,idObject) => {
  const params = {
    TableName: TABLE_NAME,
    Key: idObject
  };
  try {
    const character = await dynamo.get(params).promise();
    return character;
  } catch (error) {
    handleDynamoError(error);
  }
};


const deleteEntity = async (TABLE_NAME,idObject) => {
  const params = {
    TableName: TABLE_NAME,
    Key: idObject
  };
  try {
    const result = await dynamo.delete(params).promise();
    return result;
  } catch (error) {
    handleDynamoError(error);
  }
};


const addOrUpdateEntitiy = async (TABLE_NAME,entityObject) => {
  const params = {
    TableName: TABLE_NAME,
    Item: entityObject
  };
  try {
    const result = await dynamo.put(params).promise();
    // console.log({"result" : "data added Successfully"});
    return result;
  } catch (error) {
    handleDynamoError(error);
  }
};


const updateEntityById = async (TABLE_NAME, idObject, fieldName, fieldValue) => {
  const params = {
    TableName: TABLE_NAME,
    Key: idObject,
    UpdateExpression: `set #field = :value`,
    ExpressionAttributeNames: {
      '#field': fieldName,
    },
    ExpressionAttributeValues: {
      ':value': fieldValue,
    },
    ReturnValues: 'ALL_NEW'
  };
  try {
    const result = await dynamo.update(params).promise();
    console.log(result);
    return result.Attributes;
  } catch (error) {
    handleDynamoError(error);
  }
};


const getEntitiesByAttribute = async (TABLE_NAME, attributeName, attributeValue) => {
  const params = {
    TableName: TABLE_NAME,
    FilterExpression: `${attributeName} = :value`,
    ExpressionAttributeValues: {
      ':value': attributeValue,
    },
  };
  try {
    const result = await dynamo.scan(params).promise();
    return result.Items;
  } catch (error) {
    handleDynamoError(error);
  }
};






module.exports = {
  getEntities,
  getEntitiesById,
  deleteEntity,
  addOrUpdateEntitiy,
  updateEntityById,
  getEntitiesByAttribute
};
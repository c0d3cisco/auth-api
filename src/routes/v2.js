'use strict';

const express = require('express');
const dataModules = require('../models');
const bearerAuth = require('../../src/auth/middleware/bearer')
const permissions = require('../../src/auth/middleware/acl')

// * This gets exported by the router
const router = express.Router();

router.param('model', (req, res, next) => {
  const modelName = req.params.model;
  if (dataModules[modelName]) {
    req.model = dataModules[modelName];
    next();
  } else {
    next('Invalid Model');
  }
});

router.get('/', bearerAuth, proofOfLIfe);
router.get('/:model', bearerAuth, handleGetAll); // this is called by server file in ../models and passed which ever model export is called clothes/foods/user
router.get('/:model/:id', bearerAuth, handleGetOne);
router.post('/:model', bearerAuth, permissions('create'), handleCreate);
router.put('/:model/:id', bearerAuth, permissions('update'),handleUpdate);
router.delete('/:model/:id', bearerAuth, permissions('delete'),handleDelete);

async function proofOfLIfe(req, res) {
  res.status(200).send('Proof of life');
}

async function handleGetAll(req, res) {
  try {
    let allRecords = await req.model.get();
    res.status(200).json(allRecords);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetOne(req, res) {
  try {
    const id = req.params.id;
    let theRecord = await req.model.get(id);
    res.status(200).json(theRecord);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleCreate(req, res) {
  try {
    let obj = req.body;
    let newRecord = await req.model.create(obj);
    res.status(201).json(newRecord);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleUpdate(req, res) {
  try {
    const id = req.params.id;
    const obj = req.body;
    let updatedRecord = await req.model.update(id, obj);
    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleDelete(req, res) {
  try {
    let id = req.params.id;
    let deletedRecord = await req.model.delete(id);
    res.status(200).json(deletedRecord);
  } catch (error) {
    console.error('Internal Server Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = router;

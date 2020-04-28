const express = require('express');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { Parser } = require('json2csv');
const _ = require('lodash');
const fs = require('fs');

const router = express.Router();
const json2csvParser = new Parser();

router.get('/', (req, res) => {
  res.status(200).json(req.ipInfo);
});

router.post('/json2csv', (req, res) => {
  const { json } = req.body;

  if (_.isUndefined(json)) {
    res.status(400).json({ error: 'Bad request...' });
  }

  const fileName = `${Date.now()}-file.csv`;
  const csv = json2csvParser.parse(json);

  fs.writeFile(fileName, csv, 'utf8', (err) => {
    if (err) {
      res.status(500).json({
        err,
      });
    }
  });

  const data = new FormData();
  data.append('file', fs.createReadStream(fileName));

  fs.unlink(fileName, (err) => {
    if (err) {
      res.status(500).json({
        err,
      });
    }
  });

  fetch('https://file.io/?expires=1w', {
    method: 'POST',
    mode: 'cors',
    body: data,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        res.status(response.status);
      }
    })
    .then((data) => res.status(200).json(data))
    .catch((error) => {
      res.status(500).json(error);
    });
});

module.exports = {
  router,
};

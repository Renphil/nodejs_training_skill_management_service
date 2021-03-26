'use strict';

const path = require('path');
const fs = require('fs');
const db = require(path.resolve('middleware/db/mysql'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger(
  'system'
);

exports.getReferenceBySkillId = (skill_id) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/getReferenceBySkillId.sql'),
    'utf8'
  );
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, skill_id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error('query error:', err);
        reject(err);
      });
  });
};

exports.getReferencesByRefLink = (ref_links) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/getReferencesByRefLink.sql'),
    'utf8'
  );

  while (ref_links.length !== 5) {
    ref_links.push('');
  }

  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, ref_links)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error('query error:', err);
        reject(err);
      });
  });
};

exports.postReference = (reference) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/postReference.sql'),
    'utf8'
  );
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, [
      reference.skill_id,
      reference.ref_link,
      reference.ref_category,
      reference.length_in_mins,
    ])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error('query error:', err);
        reject(err);
      });
  });
};

exports.deleteReferenceBySkillId = (skill_id) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/deleteReferenceBySkillId.sql'),
    'utf8'
  );
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, skill_id)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error('query error:', err);
        reject(err);
      });
  });
};

'use strict';

const path = require('path');
const fs = require('fs');
const db = require(path.resolve('middleware/db/mysql'));
const logger = require(path.resolve('middleware/logging/logger')).getLogger(
  'system'
);

exports.getSkillBySkillId = (skill_id) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/getSkillBySkillId.sql'),
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

exports.getSkillAll = () => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/getSkillAll.sql'),
    'utf8'
  );
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error('query error:', err);
        reject(err);
      });
  });
};

exports.getSkillBySkillName = (skill_name) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/getSkillBySkillName.sql'),
    'utf8'
  );
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, skill_name)
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error('query error:', err);
        reject(err);
      });
  });
};

exports.postSkill = (skill) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/postSkill.sql'),
    'utf8'
  );
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, [skill.skill_name, skill.skill_description])
      .then((result) => {
        resolve(result);
      })
      .catch((err) => {
        logger.error('query error:', err);
        reject(err);
      });
  });
};

exports.putSkill = (skill) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/putSkill.sql'),
    'utf8'
  );
  return new Promise((resolve, reject) => {
    db.execute(prepareQuery, [
      skill.skill_name,
      skill.skill_description,
      skill.skill_id,
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

exports.deleteSkill = (skill_id) => {
  let prepareQuery = fs.readFileSync(
    path.resolve('app/sqls/deleteSkill.sql'),
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

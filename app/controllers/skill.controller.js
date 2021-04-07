'use strict';
const skillModel = require('../models/skill.model');
const referenceModel = require('../models/reference.model');
const { errorHandler } = require('../../util/errorHandler');
const { throwError } = require('../../util/errorHandler');
const { ERRORS } = require('../../util/ERRORS');
const { skillSchema } = require('../../util/validationSchema');
const { updateSkillSchema } = require('../../util/validationSchema');

// route '/api/v1/aws-training-management-system/skill/id/:skill_id'
exports.getSkillBySkillId = async (req, res) => {
  const { skill_id } = req.params;

  try {
    let skillDbResult = await skillModel.getSkillBySkillId(skill_id);
    if (skillDbResult.length === 0) {
      throwError(
        ERRORS.NOT_FOUND_ERROR,
        `Skill with skill_id of ${skill_id} does not exist`
      );
    }

    const references = await referenceModel.getReferenceBySkillId(skill_id);

    skillDbResult[0].references = references;
    return res.status(200).json(skillDbResult[0]);
  } catch (err) {
    errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

//route '/api/v1/aws-training-management-system/skill/all'
exports.getSkillAll = async (req, res) => {
  try {
    const skills = await skillModel.getSkillAll();
    if (skills.length > 0) {
      let allSkills = [];
      const skillIds = skills.map((skill) => skill.skill_id);
      console.log('ids:', skillIds);
      skillIds.map(async (skillid, index) => {
        try {
          const skill_refs = await referenceModel.getReferenceBySkillId(
            skillid
          );

          allSkills.push({ ...skills[index], references: skill_refs });

          if (skills.length === allSkills.length) {
            return res.status(200).json(allSkills);
          }
        } catch (err) {
          errorHandler(err, (status_code, error_message) => {
            return res
              .status(status_code)
              .json({ error_message: error_message });
          });
        }
      });
    } else {
      return res.status(200).json([]);
    }
  } catch (err) {
    errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

// route '/api/v1/aws-training-management-system/skill'
exports.postSkill = async (req, res) => {
  try {
    //validate req.body
    const validated = await skillSchema.validateAsync(req.body);

    const { skill_name, skill_description, references } = validated;

    //check if skill already exists
    // insert skill to db if not
    const skillDbResult = await skillModel.getSkillBySkillName(skill_name);
    if (skillDbResult.length > 0) {
      throwError(ERRORS.RESOURCE_ERROR, 'Duplicate entry');
    } else {
      const newSkill = await skillModel.postSkill({
        skill_name,
        skill_description,
      });
      references.map(async (ref) => {
        await referenceModel.postReference({
          ...ref,
          skill_id: newSkill.insertId,
        });
      });

      return res.status(200).json({ added: newSkill.affectedRows });
    }
  } catch (err) {
    errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

//route '/api/v1/aws-training-management-system/skill/{skill_id}'
exports.putSkill = async (req, res) => {
  try {
    const { skill_id } = req.params;

    const validated = await updateSkillSchema.validateAsync(req.body);
    const { skill_name, skill_description, references } = validated;
    const skill = await skillModel.putSkill({
      skill_id,
      skill_name: skill_name,
      skill_description: skill_description,
    });
    if (skill.affectedRows === 0) {
      throwError(
        ERRORS.NOT_FOUND_ERROR,
        `Skill with skill_id of ${skill_id} does not exist`
      );
    }

    // remove previous references and insert the references from ref.body if references exist.
    if (references) {
      await referenceModel.deleteReferenceBySkillId(skill_id);
      req.body.references.map(async (ref) => {
        await referenceModel.postReference({
          ...ref,
          skill_id: newSkill.insertId,
        });
      });
    }
    return res.status(200).json({ updated: skill.affectedRows });
  } catch (err) {
    errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

//route '/api/v1/aws-training-management-system/skill/{skill_id}'
exports.deleteSkill = async (req, res) => {
  const { skill_id } = req.params;
  try {
    const skill = await skillModel.deleteSkill(skill_id);
    await referenceModel.deleteReferenceBySkillId(skill_id);
    if (skill.affectedRows === 0) {
      throwError(
        ERRORS.NOT_FOUND_ERROR,
        `Skill with skill_id of ${skill_id} does not exist`
      );
    }
    return res.status(200).json({ deleted: skill.affectedRows });
  } catch (err) {
    errorHandler(err, (status_code, error_message) => {
      return res.status(status_code).json({ error_message: error_message });
    });
  }
};

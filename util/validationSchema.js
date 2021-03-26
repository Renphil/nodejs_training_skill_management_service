const Joi = require('joi');

const skillSchema = Joi.object({
  skill_name: Joi.string().required(),
  skill_description: Joi.string().required(),
  references: Joi.array()
    .items(
      Joi.object({
        ref_link: Joi.string().required(),
        ref_category: Joi.number().required(),
        length_in_mins: Joi.number().required(),
      })
    )
    .required(),
});
const updateSkillSchema = Joi.object({
  skill_name: Joi.string().required(),
  skill_description: Joi.string().required(),
  references: Joi.array().items(
    Joi.object({
      ref_link: Joi.string().required(),
      ref_category: Joi.number().required(),
      length_in_mins: Joi.number().required(),
    })
  ),
});

module.exports = {
  skillSchema,
  updateSkillSchema,
};

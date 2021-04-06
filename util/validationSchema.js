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

const userSchema = Joi.object({
  aws_email: Joi.string().max(255).email().required(),
  password: Joi.string().max(255).min(8).required(),
  last_name: Joi.string().max(45).required(),
  first_name: Joi.string().max(45).required(),
  dev: Joi.string().max(45).required(),
});

const loginSchema = Joi.object({
  aws_email: Joi.string().max(255).email().required(),
  password: Joi.string().max(255).required(),
});

module.exports = {
  skillSchema,
  updateSkillSchema,
  userSchema,
  loginSchema,
};

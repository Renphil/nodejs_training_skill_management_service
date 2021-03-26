'use strict';

// Load the 'skill' controller
const skillController = require('../controllers/skill.controller');

// Define the routes module' method
module.exports = function (app) {
  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill/id/{skill_id}:
   *  get:
   *   tags:
   *     - Skill API
   *   description: Able to get skill details by skill ID.
   *   parameters:
   *     - in: path
   *       name: skill_id
   *       schema:
   *         type: integer
   *       required: true
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "skill_id": 1, "skill_name": "NodeJS", "skill_description": "A backend technology ...",
   *                             "references": [{ "reference_id": 10, "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s", "ref_category": 0, "length_in_mins": 60, "skill_id": 2 }] }
   *     404:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Skill with skill_id of 1 does not exist" }
   *     409:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "no reference found for skill with skill_id of 1" }
   *     503:
   *       description: 4.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error" }
   */
  app
    .route('/api/v1/aws-training-management-system/skill/id/:skill_id')
    .get(skillController.getSkillBySkillId);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill/all:
   *  get:
   *   tags:
   *     - Skill API
   *   description: Able to get all skills.
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: [{ "skill_id": 1, "skill_name": "NodeJS", "skill_description": "A backend technology ...",
   *                             "references": [{ "reference_id": 10, "ref_link": "https://www.youtube.com/watch?v=TlB_eWDSMt4&t=4s", "ref_category": 0, "length_in_mins": 60, "skill_id": 2 }] }]
   *     409:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "No reference found for skill with skill_id of 1" }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error" }
   */
  app
    .route('/api/v1/aws-training-management-system/skill/all')
    .get(skillController.getSkillAll);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill:
   *  post:
   *   tags:
   *     - Skill API
   *   description: Able to post skill.
   *   parameters:
   *     - in: body
   *       name: skill
   *       description: The skill to create.
   *       schema:
   *        type: object
   *        required:
   *          - skill_name
   *          - skill_description
   *          - references
   *        properties:
   *          skill_name:
   *            type: string
   *          skill_description:
   *            type: string
   *          references:
   *            type: array
   *            items:
   *              type: object
   *              name: reference
   *              description: The reference for the skill
   *              required:
   *                -ref_link
   *                -ref_category
   *                -length_in_min
   *              properties:
   *                ref_link:
   *                  type: string
   *                ref_category:
   *                  type: integer
   *                length_in_min:
   *                  type: integer
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: {"added": 1}
   *     422:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "'skill_name' is required" }
   *     409:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Duplicate entry" }
   *     503:
   *       description: 4.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error" }
   */
  app
    .route('/api/v1/aws-training-management-system/skill')
    .post(skillController.postSkill);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill/{skill_id}:
   *  put:
   *   tags:
   *     - Skill API
   *   description: Able to update a skill.
   *   parameters:
   *     - in: path
   *       name: skill_id
   *       schema:
   *         type: integer
   *       required: true
   *     - in: body
   *       name: skill
   *       description: The skill to create.
   *       schema:
   *        type: object
   *        required:
   *          - skill_name
   *          - skill_description
   *        properties:
   *          skill_name:
   *            type: string
   *          skill_description:
   *            type: string
   *          references:
   *            type: array
   *            items:
   *              type: object
   *              name: reference
   *              description: The reference for the skill.
   *              required:
   *                -ref_link
   *                -ref_category
   *                -length_in_min
   *              properties:
   *                ref_link:
   *                  type: string
   *                ref_category:
   *                  type: number
   *                length_in_min:
   *                  type: integer
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "updated": 1}
   *     404:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Skill with skill_id of 1 does not exist" }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error" }
   */
  app
    .route('/api/v1/aws-training-management-system/skill/:skill_id')
    .put(skillController.putSkill);

  /**
   * @swagger
   * /api/v1/aws-training-management-system/skill/{skill_id}:
   *  delete:
   *   tags:
   *     - Skill API
   *   description: Able to delete skill.
   *   parameters:
   *     - in: path
   *       name: skill_id
   *       schema:
   *         type: integer
   *       required: true
   *   responses:
   *     200:
   *       description: 1.) return { result }
   *       examples:
   *         application/json: { "deleted": 1}
   *     404:
   *       description: 2.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Skill with skill_id of 1 does not exist" }
   *     503:
   *       description: 3.) return { error_message }
   *       examples:
   *         application/json: { "error_message": "Cannot connect to database / System error" }
   */
  app
    .route('/api/v1/aws-training-management-system/skill/:skill_id')
    .delete(skillController.deleteSkill);
};

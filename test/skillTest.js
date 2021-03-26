const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../server');
chai.should();
chai.use(chaiHttp);

const sinon = require('sinon');

const skillModel = require('../app/models/skill.model');
const referenceModel = require('../app/models/reference.model');
const { testData } = require('./testData');

describe('Skill API', function () {
  describe('getSkillBySkillId', () => {
    beforeEach(() => {
      sinon
        .stub(referenceModel, 'getReferenceBySkillId')
        .resolves([testData.reference]);
      sinon.stub(skillModel, 'getSkillBySkillId').resolves([testData.skill]);
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should be able to acquire skills based on skill ID.', (done) => {
      chai
        .request(app)
        .get('/api/v1/aws-training-management-system/skill/id/3')
        .end((err, response) => {
          const checkObj = JSON.stringify({
            ...testData.skill,
            references: [
              {
                ...testData.reference,
              },
            ],
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe('getSkillBySkillId no data found case', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'getSkillBySkillId').resolves([]);
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('No data found when tried to acquire skill details based on skill ID.', (done) => {
      chai
        .request(app)
        .get('/api/v1/aws-training-management-system/skill/id/10')
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: 'Skill with skill_id of 10 does not exist',
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('getSkillBySkillId no reference found case', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'getSkillBySkillId').resolves([testData.skill]);
      sinon.stub(referenceModel, 'getReferenceBySkillId').resolves([]);
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('No reference found when tried to acquire skill details based on skill ID.', (done) => {
      chai
        .request(app)
        .get('/api/v1/aws-training-management-system/skill/id/1')
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: `No reference found for skill with skill_id of ${testData.skill.skill_id}`,
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(409);
          done();
        });
    });
  });

  describe('getSkillAll', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'getSkillAll').resolves([testData.skill]);
      sinon
        .stub(referenceModel, 'getReferenceBySkillId')
        .resolves([testData.reference]);
    });
    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should be able to acquire all skills.', (done) => {
      chai
        .request(app)
        .get('/api/v1/aws-training-management-system/skill/all')
        .end((err, response) => {
          const checkObj = JSON.stringify([
            {
              ...testData.skill,
              references: [
                {
                  ...testData.reference,
                },
              ],
            },
          ]);
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });
  describe('getSkillAll no data found case', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'getSkillAll').resolves([]);
      sinon.stub(referenceModel, 'getReferenceBySkillId').resolves([]);
    });
    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should be able to acquire an empty array.', (done) => {
      chai
        .request(app)
        .get('/api/v1/aws-training-management-system/skill/all')
        .end((err, response) => {
          const checkObj = JSON.stringify([]);
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe('getSkillAll with a skill with no reference case', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'getSkillAll').resolves([testData.skill]);
      sinon.stub(referenceModel, 'getReferenceBySkillId').resolves([]);
    });
    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should not return any skill. ', (done) => {
      chai
        .request(app)
        .get('/api/v1/aws-training-management-system/skill/all')
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: `No reference found for skill with skill_id of ${testData.skill.skill_id}`,
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(409);
          done();
        });
    });
  });

  describe('getSkillAll with database error', () => {
    beforeEach(() => {
      sinon
        .stub(skillModel, 'getSkillAll')
        .rejects('DatabaseError', 'Cannot connect to database / System error');
    });
    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should not return any skill. ', (done) => {
      chai
        .request(app)
        .get('/api/v1/aws-training-management-system/skill/all')
        .end((err, response) => {
          const checkObj = JSON.stringify({
            error_message: 'Cannot connect to database / System error',
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(checkObj);
          response.should.have.status(500);
          done();
        });
    });
  });

  describe('postSkill', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'getSkillBySkillName').resolves([]);
      sinon.stub(skillModel, 'postSkill').resolves({
        affectedRows: 1,
      });
      sinon.stub(referenceModel, 'postReference').resolves({ affectedRows: 1 });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should be able to post skill.', (done) => {
      const {
        skill: { skill_name, skill_description },
        reference: { length_in_mins, ref_link, ref_category },
      } = testData;
      chai
        .request(app)
        .post('/api/v1/aws-training-management-system/skill')
        .send({
          skill_name,
          skill_description,
          references: [
            {
              ref_link,
              ref_category,
              length_in_mins,
            },
          ],
        })
        .end((err, response) => {
          const expected = JSON.stringify({ added: 1 });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(expected);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe('post skill invalid request body case', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'getSkillBySkillName').resolves([]);
      sinon.stub(skillModel, 'postSkill').resolves({
        affectedRows: 0,
      });
      sinon.stub(referenceModel, 'postReference').resolves({ affectedRows: 0 });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should not be able to post skill.', (done) => {
      const {
        skill: { skill_description },
        reference: { length_in_mins, ref_link, ref_category },
      } = testData;
      chai
        .request(app)
        .post('/api/v1/aws-training-management-system/skill')
        .send({
          skill_description: 'A RDBMS...',
          references: [
            {
              ref_link: 'https://www.youtube.com/watch?v=2bW3HuaAUcY',
              ref_category: 0,
              length_in_mins: 12,
              skill_id: 3,
            },
          ],
        })
        .end((err, response) => {
          const expected = JSON.stringify({
            error_message: `"skill_name" is required`,
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(expected);
          response.should.have.status(422);
          done();
        });
    });
  });

  describe('post skill that already exists case', () => {
    beforeEach(() => {
      sinon
        .stub(skillModel, 'getSkillBySkillName')
        .resolves([{ ...testData.skill }]);
      sinon.stub(skillModel, 'postSkill').resolves({
        affectedRows: 0,
      });
      sinon.stub(referenceModel, 'postReference').resolves({ affectedRows: 0 });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should not be able to post skill.', (done) => {
      const {
        skill: { skill_name, skill_description },
        reference: { length_in_mins, ref_link, ref_category },
      } = testData;
      chai
        .request(app)
        .post('/api/v1/aws-training-management-system/skill')
        .send({
          skill_name,
          skill_description,
          references: [
            {
              ref_link,
              ref_category,
              length_in_mins,
            },
          ],
        })
        .end((err, response) => {
          const expected = JSON.stringify({
            error_message: 'Duplicate entry',
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(expected);
          response.should.have.status(409);
          done();
        });
    });
  });

  describe('update skill', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'putSkill').resolves({ affectedRows: 1 });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should be able to update skill.', (done) => {
      chai
        .request(app)
        .put('/api/v1/aws-training-management-system/skill/1')
        .send({
          skill_name: testData.skill.skill_name,
          skill_description: testData.skill.skill_description,
        })
        .end((err, response) => {
          const expected = JSON.stringify({
            updated: 1,
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(expected);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe('update skill with new reference case', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'putSkill').resolves({ affectedRows: 1 });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should be able to update skill.', (done) => {
      chai
        .request(app)
        .put('/api/v1/aws-training-management-system/skill/1')
        .send({
          skill_name: testData.skill.skill_name,
          skill_description: testData.skill.skill_description,
          references: [
            {
              ref_link: testData.reference.ref_link,
              ref_category: testData.reference.ref_category,
              length_in_mins: testData.reference.length_in_mins,
            },
          ],
        })
        .end((err, response) => {
          const expected = JSON.stringify({
            updated: 1,
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(expected);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe('update skill with invalid skill_id case', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'putSkill').resolves({ affectedRows: 0 });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should not be able to update skill.', (done) => {
      chai
        .request(app)
        .put('/api/v1/aws-training-management-system/skill/1')
        .send({
          skill_name: testData.skill.skill_name,
          skill_description: testData.skill.skill_description,
        })
        .end((err, response) => {
          const expected = JSON.stringify({
            error_message: 'Skill with skill_id of 1 does not exist',
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(expected);
          response.should.have.status(404);
          done();
        });
    });
  });

  describe('update skill with missing field case', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'putSkill').resolves({ affectedRows: 1 });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should not be able to update skill.', (done) => {
      chai
        .request(app)
        .put('/api/v1/aws-training-management-system/skill/1')
        .send({
          skill_name: testData.skill.skill_name,
        })
        .end((err, response) => {
          const expected = JSON.stringify({
            error_message: `"skill_description" is required`,
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(expected);
          response.should.have.status(422);
          done();
        });
    });
  });

  describe('delete skill', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'deleteSkill').resolves({ affectedRows: 1 });
      sinon
        .stub(referenceModel, 'deleteReferenceBySkillId')
        .resolves({ affectedRows: 1 });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should be able to delete skill.', (done) => {
      chai
        .request(app)
        .delete('/api/v1/aws-training-management-system/skill/1')
        .end((err, response) => {
          const expected = JSON.stringify({
            deleted: 1,
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(expected);
          response.should.have.status(200);
          done();
        });
    });
  });

  describe('delete skill with invalid skill_id case', () => {
    beforeEach(() => {
      sinon.stub(skillModel, 'deleteSkill').resolves({ affectedRows: 0 });
    });

    afterEach((done) => {
      sinon.restore();
      done();
    });

    it('Should not be able to delete any skill.', (done) => {
      chai
        .request(app)
        .delete('/api/v1/aws-training-management-system/skill/1')
        .end((err, response) => {
          const expected = JSON.stringify({
            error_message: 'Skill with skill_id of 1 does not exist',
          });
          const responseBody = JSON.stringify(response.body);
          responseBody.should.be.eql(expected);
          response.should.have.status(404);
          done();
        });
    });
  });
});

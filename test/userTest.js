const chaiHttp = require('chai-http');
const chai = require('chai');
const app = require('../server');
const { createToken } = require('../middleware/jwt/jwt');
const bcrypt = require('bcrypt');
chai.should();
chai.use(chaiHttp);

const sinon = require('sinon');

const userModel = require('../app/models/user.model');
const { userTestData } = require('./testData');

describe('User API', function () {
  describe('register user', () => {
    describe('registration successful', () => {
      beforeEach(() => {
        sinon.stub(userModel, 'registerUser').resolves({
          affectedRows: 1,
        });
      });

      afterEach((done) => {
        sinon.restore();
        done();
      });

      it('Should be able to register user.', (done) => {
        chai
          .request(app)
          .post('/api/v1/aws-training-management-system/user/register')
          .send(userTestData)
          .end((err, response) => {
            const expected = JSON.stringify({ added: 1 });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(expected);
            response.should.have.status(200);
            done();
          });
      });
    });

    describe('registration unsuccessful', () => {
      beforeEach(() => {
        sinon.stub(userModel, 'registerUser').resolves({
          affectedRows: 0,
        });
      });

      afterEach((done) => {
        sinon.restore();
        done();
      });

      it('Should be not able to register user.', (done) => {
        chai
          .request(app)
          .post('/api/v1/aws-training-management-system/user/register')
          .send({ first_name: userTestData.first_name })
          .end((err, response) => {
            const expected = JSON.stringify({
              error_message: `\"aws_email\" is required`,
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(expected);
            response.should.have.status(422);
            done();
          });
      });
    });
  });

  describe('login user', () => {
    describe('successfull login', () => {
      beforeEach(async () => {
        sinon.stub(userModel, 'getUserByEmail').resolves([
          {
            aws_email: userTestData.aws_email,
            password: await bcrypt.hash(userTestData.password, 10),
          },
        ]);
      });

      afterEach((done) => {
        sinon.restore();
        done();
      });

      it('Should be able to login user.', (done) => {
        chai
          .request(app)
          .post('/api/v1/aws-training-management-system/user/login')
          .send({
            aws_email: userTestData.aws_email,
            password: 'password',
          })
          .end((err, response) => {
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(responseBody);
            response.should.have.status(200);
            done();
          });
      });

      it('Should be able to get current user.', (done) => {
        chai
          .request(app)
          .post('/api/v1/aws-training-management-system/user/login')
          .send({
            aws_email: userTestData.aws_email,
            password: 'password',
          })
          .end((err, response) => {
            chai
              .request(app)
              .get('/api/v1/aws-training-management-system/user')
              .set('Authorization', response.body)
              .end((err, res) => {
                const responseBody = JSON.stringify(res.body);
                console.log(responseBody);
                responseBody.should.be.eql(responseBody);
                response.should.have.status(200);
                done();
              });
          });
      });
    });

    describe('login with wrong credentials', () => {
      beforeEach(async () => {
        sinon.stub(userModel, 'getUserByEmail').resolves([
          {
            aws_email: userTestData.aws_email,
            password: await bcrypt.hash(userTestData.password, 10),
          },
        ]);
      });

      afterEach((done) => {
        sinon.restore();
        done();
      });

      it('Should not be able to login user.', (done) => {
        chai
          .request(app)
          .post('/api/v1/aws-training-management-system/user/login')
          .send({
            aws_email: userTestData.aws_email,
            password: 'wrongpassword',
          })
          .end((err, response) => {
            const expected = JSON.stringify({
              error_message: `invalid username/password`,
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(expected);
            response.should.have.status(400);
            done();
          });
      });
    });

    describe('login with not valid credentials', () => {
      beforeEach(() => {
        sinon.stub(userModel, 'getUserByEmail').resolves({
          affectedRows: 0,
        });
      });

      afterEach((done) => {
        sinon.restore();
        done();
      });

      it('Should not be able to login user.', (done) => {
        chai
          .request(app)
          .post('/api/v1/aws-training-management-system/user/login')
          .send({
            aws_email: userTestData.last_name,
          })
          .end((err, response) => {
            const expected = JSON.stringify({
              error_message: `\"aws_email\" must be a valid email`,
            });
            const responseBody = JSON.stringify(response.body);
            responseBody.should.be.eql(expected);
            response.should.have.status(422);
            done();
          });
      });
    });
  });
});

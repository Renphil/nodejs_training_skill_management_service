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

      it('Should not be able to register user.', (done) => {
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
            last_name: userTestData.last_name,
            first_name: userTestData.first_name,
            dev: userTestData.dev,
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
          .then((response) => {
            const { bearerToken } = response.body;
            chai
              .request(app)
              .get('/api/v1/aws-training-management-system/user')
              .set('Authorization', bearerToken)
              .end((err, res) => {
                const responseBody = JSON.stringify(res.body);

                const { password, ...user } = userTestData;
                responseBody.should.be.eql(JSON.stringify(user));
                response.should.have.status(200);
                done();
              });
          });
      });
    });

    describe('login with wrong credentials', () => {
      describe('wrong email', () => {
        beforeEach(async () => {
          sinon.stub(userModel, 'getUserByEmail').resolves([]);
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

      describe('wrong password', () => {
        beforeEach(async () => {
          sinon.stub(userModel, 'getUserByEmail').resolves([
            {
              aws_email: userTestData.aws_email,
              password: await bcrypt.hash(userTestData.password, 10),
              last_name: userTestData.last_name,
              first_name: userTestData.first_name,
              dev: userTestData.dev,
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

  describe('logout user', () => {
    describe('successfull logout', () => {
      beforeEach(async () => {
        sinon.stub(userModel, 'getUserByEmail').resolves([
          {
            aws_email: userTestData.aws_email,
            password: await bcrypt.hash(userTestData.password, 10),
            last_name: userTestData.last_name,
            first_name: userTestData.first_name,
            dev: userTestData.dev,
          },
        ]);
      });

      afterEach((done) => {
        sinon.restore();
        done();
      });

      it('Should be able to logout user.', (done) => {
        chai
          .request(app)
          .post('/api/v1/aws-training-management-system/user/login')
          .send({
            aws_email: userTestData.aws_email,
            password: 'password',
          })
          .then((response) => {
            const { bearerToken } = response.body;
            chai
              .request(app)
              .get('/api/v1/aws-training-management-system/user/logout')
              .set('Authorization', bearerToken)
              .end((err, res) => {
                const expected = JSON.stringify({
                  message: `User logged out`,
                });
                const responseBody = JSON.stringify(res.body);
                responseBody.should.be.eql(expected);
                response.should.have.status(200);
                done();
              });
          });
      });
    });
  });
});

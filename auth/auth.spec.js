const request = require('supertest');
const db = require('../database/dbConfig')
const auth = require('../model')
const server = require('../api/server');

describe('GET/', () => {
    it('should give you a 400 error', () => {
        return request(server).get('/api/jokes')
        .expect(400)
        .then( res => {
            expect(res.body)
        })
    })
})

describe('testing the add function on the database', () => {
    beforeEach(async () => {
        await db('users').truncate();
    });

    describe('add function', () => {
        it('add new users into the db', async () => {
            let userNumber;
            userNumber = await db('users')
            expect(userNumber).toHaveLength(0)
            await auth.add({ username: 'Jake', password: 'admin'})
            userNumber = await db('users');
            expect(userNumber).toHaveLength(1)
        });
    });
});

describe('register', function() {
    it('has the ability to register a new user', function() {
        return request(server)
        .post('/api/auth/register')
        .send({ username: 'jake', password: 'admin'})
        .expect(200)
        .then( res => {

            expect(res.body).toHaveProperty('username')
        
        });
    });
});

describe('GET/', () => {
    it('should give you a 404 error', () => {
        return request(server).get('/api/auth/login')
        .expect(404)
        .then( res => {
            expect(res.body)
        })
    })
})

describe('GET/', () => {
    it('should give you a 400 error', () => {
        return request(server).get('/api/auth/register')
        .expect(404)
        .then( res => {
            expect(res.body)
        })
    })
})

describe('login', function() {
    it('doesnt login without a password', function() {
        return request(server)
        .post('/api/auth/login')
        .send({ username: 'jake', password: ''})
        .expect(401)
        .then( res => {

            expect(res.body)
        
        });
    });
});

describe('register', function() {
    it('doesnt register without a password', function() {
        return request(server)
        .post('/api/auth/login')
        .send({ username: 'jake', password: ''})
        .expect(401)
        .then( res => {

            expect(res.body)
        
        });
    });
});
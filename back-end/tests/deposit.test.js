const request = require('supertest');
const app = require('../index');

describe('Deposit Endpoint', () => {
    it('should allow users with "buyer" role to deposit valid coins', async () => {
        const user = {
            username: 'buyer',
            password: 'password123',
            deposit: 0,
            role: 'buyer',
        };

        // Register the user
        await request(app).post('/users').send(user);

        // Authenticate the user and get the JWT token
        const loginResponse = await request(app).post('/auth/login').send(user);
        const token = loginResponse.body.token;

        const depositAmount = 10;

        // Make the deposit request with the JWT token
        const response = await request(app)
            .post('/users/deposit')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: depositAmount });

        expect(response.status).toBe(200);
    });

    it('should not allow users with "buyer" role to deposit invalid coins', async () => {
        const user = {
            username: 'buyer',
            password: 'password123',
            deposit: 0,
            role: 'buyer',
        };

        // Register the user
        await request(app).post('/users').send(user);

        // Authenticate the user and get the JWT token
        const loginResponse = await request(app).post('/auth/login').send(user);
        const token = loginResponse.body.token;

        const invalidDepositAmount = 30; // An invalid coin amount

        // Make the deposit request with the JWT token
        const response = await request(app)
            .post('/users/deposit')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: invalidDepositAmount });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid coin amount. Only 5, 10, 20, 50, and 100 cent coins are allowed.');
    });

    it('should not allow users with "seller" role to access the /deposit endpoint', async () => {
        const user = {
            username: 'seller',
            password: 'password123',
            deposit: 0,
            role: 'seller',
        };

        // Register the seller user
        await request(app).post('/users').send(user);

        // Authenticate the seller user and get the JWT token
        const loginResponse = await request(app).post('/auth/login').send(user);
        const token = loginResponse.body.token;

        const depositAmount = 50;

        // Attempt to make a deposit request with the JWT token (seller role)
        const response = await request(app)
            .post('/users/deposit')
            .set('Authorization', `Bearer ${token}`)
            .send({ amount: depositAmount });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe('Forbidden: Only users with "buyer" role can deposit money.');
    });
});

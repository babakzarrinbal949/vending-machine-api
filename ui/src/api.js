// src/api.js
import axios from 'axios';

const baseURL = process.env.serverBaseUrl || 'http://localhost:3000';

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${baseURL}/auth/login`, {
            username,
            password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Fetch products from the API
export async function fetchProducts() {
    try {
        const response = await fetch(`${baseURL}/products`);
        return await response.json();
    } catch (error) {
        throw new Error('Error fetching products');
    }
}
export async function makePurchase(productId, amount, token) {
    try {
        const response = await fetch(`${baseURL}/users/buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, amount }),
        });

        return {ok: response.ok, body: await response.json()};
    } catch (error) {
        console.log(error.message);
        throw new Error('Purchase failed');
    }
}

export async function depositCoins(token, amount) {
    try {
        const response = await fetch(`${baseURL}/users/deposit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ amount }),
        });

        return await response.json();
    } catch (error) {
        throw new Error('Deposit failed');
    }
}

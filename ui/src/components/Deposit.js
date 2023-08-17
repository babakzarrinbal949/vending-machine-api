import React, { useState, useContext } from 'react';
import { depositCoins } from '../api';
import { redirect } from "react-router-dom";

function Deposit() {
    const [amount, setAmount] = useState(0);
    const token = localStorage.getItem('access-token');
    const balance = localStorage.getItem('balance');

    if (!token) {
        window.location.href = '/login';
    }

    const handleDeposit = async () => {
        try {
            // Validate the input amount
            if (amount >= 5 && [5, 10, 20, 50, 100].includes(amount % 100)) {
                await depositCoins(token, Number(amount));
                alert('Coins deposited successfully!');
                setAmount(0);
            } else {
                alert('Invalid amount. Please deposit valid coin denominations.');
            }
        } catch (error) {
            console.error('Deposit failed:', error);
            alert('Deposit failed. Please try again later.');
        }
    };

    return (
        <div className="container">
            <h2>Deposit Coins</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <p>Balance: {balance} coins</p>
                            <div className="mb-3">
                                <label htmlFor="amount" className="form-label">
                                    Amount (cents):
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <button className="btn btn-primary" onClick={handleDeposit}>
                                Deposit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Deposit;

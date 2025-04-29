// src/components/Calculate.js
import React, { useState } from 'react';

function Calculate() {
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [operation, setOperation] = useState('add');
    const [result, setResult] = useState(null);
    const token = localStorage.getItem('token');

    const handleCalculate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ num1: Number(num1), num2: Number(num2), operation }),
            });
            const data = await response.json();
            setResult(data.result);
        } catch (error) {
            alert('Error performing calculation');
        }
    };

    return (
        <div className="calculate">
            <h2>Perform Calculation</h2>
            <form onSubmit={handleCalculate}>
                <input
                    type="number"
                    value={num1}
                    onChange={(e) => setNum1(e.target.value)}
                    placeholder="Number 1"
                    required
                />
                <input
                    type="number"
                    value={num2}
                    onChange={(e) => setNum2(e.target.value)}
                    placeholder="Number 2"
                    required
                />
                <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                >
                    <option value="add">Add</option>
                    <option value="subtract">Subtract</option>
                </select>
                <button type="submit">Calculate</button>
            </form>
            {result !== null && <p>Result: {result}</p>}
        </div>
    );
}

export default Calculate;

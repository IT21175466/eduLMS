import React, { useState } from 'react';
import '../calculate.css';
function Calculate() {
    const [num1, setNum1] = useState('');
    const [num2, setNum2] = useState('');
    const [courseFee, setCourseFee] = useState('');
    const [additionalFees, setAdditionalFees] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [installments, setInstallments] = useState('');
    const [operation, setOperation] = useState('courseFee');
    const [result, setResult] = useState(null);

    const [error, setError] = useState('');

    // Handle calculation based on the selected operation
    const handleCalculate = (e) => {
        e.preventDefault();
        let calculationResult = null;
        setError('');

        // 1. Calculate Course Fee Based on Duration
        if (operation === 'courseFee') {
            if (num2 <= 0) {
                setResult(null);
                setError('Please enter valid duration in Weeks');
                return;
            }
            calculationResult = parseFloat(num1) * parseFloat(num2);
        }
        // 2. Calculate Discounted Course Fee
        else if (operation === 'discount') {
            calculationResult = parseFloat(courseFee) - (parseFloat(courseFee) * (parseFloat(discountPercentage) / 100));
        }
        // 3. Calculate Total Course Fee with Additional Charges
        else if (operation === 'totalFee') {
            let additionalFeesArray = additionalFees.split(',').map(fee => parseFloat(fee.trim()));

            const invalidFees = additionalFeesArray.some(fee => {
                fee = String(fee).trim();
                return isNaN(fee) || fee === '' || fee.includes(' ') || fee.includes(';') || fee.includes('"') || fee.includes('/'); // Check for forbidden characters and invalid format
            });

            // Check for invalid commas, e.g., leading or trailing commas, or consecutive commas
            if (additionalFees.includes(',,') || additionalFees.startsWith(',') || additionalFees.endsWith(',')) {
                setError('Invalid format: Please avoid leading, trailing, or consecutive commas.');
                setResult(null);
                return;
            }

            if (invalidFees) {
                setError('Please enter valid numbers for additional fees, separated by commas (e.g., 50, 30, 20), without semicolons, slashes, or quotes.');
                setResult(null);
                return;
            }

            calculationResult = parseFloat(courseFee) + additionalFeesArray.reduce((acc, fee) => acc + fee, 0);
        }
        // 4. Calculate Installment Fee
        else if (operation === 'installments') {
            if (installments <= 0) {
                setResult(null);
                setError('Please Enter valid number of installments');
                return;
            }
            calculationResult = parseFloat(courseFee) / parseFloat(installments);
        }

        setResult(calculationResult);
    };

    return (
        <div className="calculate">
            <h2>Course Fee Calculator</h2>

            <form onSubmit={handleCalculate} className="calc-form">
                <div className="input-group">
                    <label>Operation:</label>
                    <select
                        value={operation}
                        onChange={(e) => {
                            setNum1('');
                            setNum2('');
                            setCourseFee('');
                            setAdditionalFees('');
                            setDiscountPercentage('');
                            setInstallments(''); setResult(null); setError(''); setOperation(e.target.value);
                        }}
                    >
                        <option value="courseFee">Calculate Course Fee (Duration)</option>
                        <option value="discount">Discounted Course Fee</option>
                        <option value="installments">Installment Fee</option>
                    </select>
                </div>

                {/* Input fields for each operation */}
                {operation === 'courseFee' && (
                    <div className="input-group">
                        <label>Weekly Fee:</label>
                        <input
                            type="number"
                            value={num1}
                            onChange={(e) => setNum1(e.target.value)}
                            placeholder="Enter weekly fee"
                            required
                        />
                        <label>Duration in Weeks:</label>
                        <input
                            type="number"
                            value={num2}
                            onChange={(e) => setNum2(e.target.value)}
                            placeholder="Enter duration in weeks"
                            required
                        />
                    </div>
                )}

                {operation === 'discount' && (
                    <div className="input-group">
                        <label>Original Course Fee:</label>
                        <input
                            type="number"
                            value={courseFee}
                            onChange={(e) => setCourseFee(e.target.value)}
                            placeholder="Enter course fee"
                            required
                        />
                        <label>Discount Percentage:</label>
                        <input
                            type="number"
                            value={discountPercentage}
                            onChange={(e) => setDiscountPercentage(e.target.value)}
                            placeholder="Enter discount percentage"
                            required
                        />
                    </div>
                )}

                {operation === 'totalFee' && (
                    <div className="input-group">
                        <label>Base Course Fee:</label>
                        <input
                            type="number"
                            value={courseFee}
                            onChange={(e) => setCourseFee(e.target.value)}
                            placeholder="Enter base course fee"
                            required
                        />
                        <label>Additional Fees (comma separated):</label>
                        <input
                            type="text"
                            value={additionalFees}
                            onChange={(e) => setAdditionalFees(e.target.value)}
                            placeholder="Enter additional fees (e.g., 50, 80, 30)"
                            required
                        />
                    </div>
                )}

                {operation === 'installments' && (
                    <div className="input-group">
                        <label>Course Fee:</label>
                        <input
                            type="number"
                            value={courseFee}
                            onChange={(e) => setCourseFee(e.target.value)}
                            placeholder="Enter course fee"
                            required
                        />
                        <label>Number of Installments:</label>
                        <input
                            type="number"
                            value={installments}
                            onChange={(e) => setInstallments(e.target.value)}
                            placeholder="Enter number of installments"
                            required
                        />
                    </div>
                )}

                <button type="submit" className="calc-btn">Calculate</button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {result !== null && (
                <div className="result-container">
                    <h3>Result: </h3>
                    <p className="result">{result}</p>
                </div>
            )}

        </div>
    );
}

export default Calculate;

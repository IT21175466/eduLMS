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

    // Handle calculation based on the selected operation
    const handleCalculate = (e) => {
        e.preventDefault();
        let calculationResult = null;

        // 1. Calculate Course Fee Based on Duration
        if (operation === 'courseFee') {
            calculationResult = parseFloat(num1) * parseFloat(num2);
        }
        // 2. Calculate Discounted Course Fee
        else if (operation === 'discount') {
            calculationResult = parseFloat(courseFee) - (parseFloat(courseFee) * (parseFloat(discountPercentage) / 100));
        }
        // 3. Calculate Total Course Fee with Additional Charges
        else if (operation === 'totalFee') {
            let additionalFeesArray = additionalFees.split(',').map(fee => parseFloat(fee.trim()));
            calculationResult = parseFloat(courseFee) + additionalFeesArray.reduce((acc, fee) => acc + fee, 0);
        }
        // 4. Calculate Installment Fee
        else if (operation === 'installments') {
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
                        onChange={(e) => setOperation(e.target.value)}
                    >
                        <option value="courseFee">Calculate Course Fee (Duration)</option>
                        <option value="discount">Discounted Course Fee</option>
                        <option value="totalFee">Total Fee with Additional Charges</option>
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
                            placeholder="Enter additional fees (e.g., material, lab)"
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

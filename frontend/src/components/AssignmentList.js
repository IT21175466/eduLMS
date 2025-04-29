// src/components/AssignmentList.js
import React, { useState, useEffect } from 'react';

function AssignmentList() {
    const [assignments, setAssignments] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getAllAssignments', {
                    headers: { authorization: `${token}` },
                });
                const data = await response.json();
                setAssignments(data);
            } catch (error) {
                console.error('Error fetching assignments', error);
            }
        };
        fetchAssignments();
    }, [token]);

    return (
        <div className="assignment-list">
            <h2>All Assignments</h2>
            <ul>
                {assignments.map((assignment) => (
                    <li key={assignment._id}>
                        <h3>{assignment.title}</h3>
                        <p>{assignment.description}</p>
                        <p><strong>Due Date:</strong> {new Date(assignment.dueDate).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AssignmentList;

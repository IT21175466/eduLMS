// src/components/CourseList.js
import React, { useState, useEffect } from 'react';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses', error);
            }
        };
        fetchCourses();
    }, [token]);

    return (
        <div className="course-list">
            <h2>All Courses</h2>
            <ul>
                {courses.map((course) => (
                    <li key={course._id}>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <p><strong>Modules:</strong> {course.modules.join(', ')}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CourseList;

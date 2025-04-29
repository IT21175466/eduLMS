import React, { useState, useEffect } from 'react';
import '../courseList.css';

import Modal from 'react-modal';

Modal.setAppElement('#root');  // This helps with accessibility

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [newCourseTitle, setNewCourseTitle] = useState('');
    const [newCourseDescription, setNewCourseDescription] = useState('');
    const [newCourseModules, setNewCourseModules] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseToUpdate, setCourseToUpdate] = useState(null);
    const token = localStorage.getItem('token');

    // Fetch courses on component mount
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getcourses', {
                    headers: { authorization: `${token}` },
                });
                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };

        fetchCourses();
    }, [token]);

    // Handle adding a new course
    const handleAddCourse = async () => {
        const modulesArray = newCourseModules.split(',').map(module => module.trim());
        const newCourse = { title: newCourseTitle, description: newCourseDescription, modules: modulesArray };
        try {
            const response = await fetch('http://localhost:5000/api/course', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${token}`,
                },
                body: JSON.stringify(newCourse),
            });
            const data = await response.json();
            setCourses((prevCourses) => [...prevCourses, data.course]);
            setNewCourseTitle('');
            setNewCourseDescription('');
            setNewCourseModules('');
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    // Handle deleting a course
    const handleDeleteCourse = async (courseId) => {
        try {
            await fetch('http://localhost:5000/api/course', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${token}`,
                },
                body: JSON.stringify({ courseId }),
            });
            setCourses(courses.filter(course => course._id !== courseId));
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    // Handle opening the modal to update a course
    const openUpdateModal = (course) => {
        setCourseToUpdate(course); // Set course to be updated
        setIsModalOpen(true); // Open modal
    };

    // Handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setCourseToUpdate(null);
    };

    // Handle updating a course
    const handleUpdateCourse = async () => {
        const updatedCourse = { title: newCourseTitle, description: newCourseDescription };
        try {
            const response = await fetch('http://localhost:5000/api/course', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${token}`,
                },
                body: JSON.stringify({ courseId: courseToUpdate._id, ...updatedCourse }),
            });
            const data = await response.json();
            setCourses(courses.map(course => (course._id === courseToUpdate._id ? data.course : course)));
            closeModal(); // Close the modal after updating
        } catch (error) {
            console.error('Error updating course:', error);
        }
    };

    return (
        <div className="course-list">
            <h2>All Courses</h2>

            {/* Add New Course */}
            <div className="add-course-form">
                <input
                    type="text"
                    placeholder="Course Title"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Course Description"
                    value={newCourseDescription}
                    onChange={(e) => setNewCourseDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Modules (comma separated)"
                    value={newCourseModules}
                    onChange={(e) => setNewCourseModules(e.target.value)}
                />
                <button onClick={handleAddCourse}>Add Course</button>
            </div>

            {/* Course Cards */}
            <div className="course-cards">
                {courses.map((course) => (
                    <div className="course-card" key={course._id}>
                        <h3>{course.title}</h3>
                        <p>{course.description}</p>
                        <p><strong>Modules:</strong> {course.modules.join(', ')}</p>
                        <div className="course-actions">
                            <button onClick={() => openUpdateModal(course)}>Update</button>
                            <button onClick={() => handleDeleteCourse(course._id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for Course Update */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <div style={customStyles.container}>
                    <h2 style={customStyles.title}>Update Course</h2>
                    {courseToUpdate && (
                        <>
                            <input
                                type="text"
                                value={newCourseTitle}
                                onChange={(e) => setNewCourseTitle(e.target.value)}
                                placeholder="New Course Title"
                                style={customStyles.input}
                            />
                            <input
                                type="text"
                                value={newCourseDescription}
                                onChange={(e) => setNewCourseDescription(e.target.value)}
                                placeholder="New Course Description"
                                style={customStyles.input}
                            />
                            <input
                                type="text"
                                value={newCourseModules}
                                onChange={(e) => setNewCourseModules(e.target.value)}
                                placeholder="New Course Modules (comma separated)"
                                style={customStyles.input}
                            />
                            <div style={customStyles.buttonContainer}>
                                <button onClick={() => handleUpdateCourse(newCourseTitle, newCourseDescription, newCourseModules)} style={customStyles.button}>Update Course</button>
                                <button onClick={closeModal} style={customStyles.cancelButton}>Cancel</button>
                            </div>
                        </>
                    )}
                </div>

            </Modal>
        </div>
    );
}

const customStyles = {
    modal: {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        content: {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            maxWidth: '500px',
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
    },
    container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    input: {
        width: '60%',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        fontSize: '16px',
        outline: 'none',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '61.5%',
        marginTop: '20px',
    },
    button: {
        width: '200px',
        padding: '10px 15px',
        fontSize: '16px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    cancelButton: {
        width: '200px',
        padding: '10px 15px',
        fontSize: '16px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};


export default CourseList;
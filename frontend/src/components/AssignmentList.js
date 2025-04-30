import React, { useState, useEffect } from 'react';
import '../assignmentList.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function AssignmentList() {
    const [assignments, setAssignments] = useState([]);
    const token = localStorage.getItem('token');
    const [newAssignmentTitle, setNewAssignmentTitle] = useState('');
    const [newAssignmentDescription, setNewAssignmentDescription] = useState('');
    const [newAssignmentDuedate, setNewAssignmentDuedate] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [assignmentToUpdate, setAssignmentToUpdate] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    // Fetch assignments from the backend
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getAllAssignments', {
                    headers: { authorization: `${token}` },
                });
                const data = await response.json();
                // Check if data is an array and is valid
                if (Array.isArray(data)) {
                    setAssignments(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching assignments', error);
            }
        };
        fetchAssignments();
    }, [token]);

    // Handle opening the modal to update a course
    const openUpdateModal = (assignment) => {
        if (assignment) {
            setNewAssignmentTitle(assignment.title);
            setNewAssignmentDescription(assignment.description);
            setNewAssignmentDuedate(assignment.dueDate.split('T')[0]);
            setAssignmentToUpdate(assignment); // Set course to be updated
            setIsModalOpen(true); // Open modal
        }
    };

    // Handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setAssignmentToUpdate(null);
        setNewAssignmentTitle('');
        setNewAssignmentDescription('');
        setNewAssignmentDuedate('');
    };

    // Handle updating an assignment
    const handleUpdateAssignment = async () => {

        if (!newAssignmentTitle || !newAssignmentDescription || !newAssignmentDuedate) {
            setErrorMessage('Please fill in all fields before updating the assignment.');
            return;
        }
        setErrorMessage('');

        const updatedAssignment = { title: newAssignmentTitle, description: newAssignmentDescription, dueDate: newAssignmentDuedate };
        try {
            const response = await fetch('http://localhost:5000/api/assignment', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${token}`,
                },
                body: JSON.stringify({ assignmentId: assignmentToUpdate._id, ...updatedAssignment }),
            });
            const data = await response.json();
            setAssignments(assignments.map(assignment => (assignment._id === assignmentToUpdate._id ? data.assignment : assignment)));
            closeModal(); // Close the modal after updating
        } catch (error) {
            console.error('Error updating assignment:', error);
        }
    };

    const handleAddAssignment = async () => {

        if (!newAssignmentTitle || !newAssignmentDescription || !newAssignmentDuedate) {
            setErrorMessage('Please fill in all fields before adding the assignment.');
            return;
        }
        setErrorMessage('');

        const newAssignment = { title: newAssignmentTitle, description: newAssignmentDescription, dueDate: newAssignmentDuedate };
        try {
            const response = await fetch('http://localhost:5000/api/assignment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${token}`,
                },
                body: JSON.stringify(newAssignment),
            });
            const data = await response.json();
            setAssignments((prevAssignments) => [...prevAssignments, data.assignment]);
            setNewAssignmentTitle('');
            setNewAssignmentDescription('');
            setNewAssignmentDuedate('');
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    return (
        <div className="assignment-list">
            <h2>All Assignments</h2>
            <div className="add-assignment-form">

                <input
                    type="text"
                    placeholder="Assignment Title"
                    value={newAssignmentTitle}
                    onChange={(e) => setNewAssignmentTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Assignment Description"
                    value={newAssignmentDescription}
                    onChange={(e) => setNewAssignmentDescription(e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Due Date"
                    value={newAssignmentDuedate}
                    onChange={(e) => setNewAssignmentDuedate(e.target.value)}
                />
                <button onClick={handleAddAssignment}>Add Assignment</button>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="assignment-cards">
                {assignments.length > 0 ? (
                    assignments.map((assignment) => (
                        assignment ? (
                            <div className="assignment-card" key={assignment._id}>
                                <h3>{assignment.title}</h3>
                                <p>{assignment.description}</p>
                                <p><strong>Due Date:</strong> {assignment.dueDate.split('T')[0]}</p>
                                <div className="assignment-actions">
                                    <button className="update-btn" onClick={() => openUpdateModal(assignment)}>Update</button>
                                </div>
                            </div>
                        ) : null
                    ))
                ) : (
                    <p>No assignments found</p>
                )}
            </div>

            {/* Modal for Assignment Update */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <div style={customStyles.container}>
                    <h2 style={customStyles.title}>Update Assignment</h2>
                    {assignmentToUpdate && (
                        <>
                            <input
                                type="text"
                                value={newAssignmentTitle}
                                onChange={(e) => setNewAssignmentTitle(e.target.value)}
                                placeholder="New Assignment Title"
                                style={customStyles.input}
                            />
                            <input
                                type="text"
                                value={newAssignmentDescription}
                                onChange={(e) => setNewAssignmentDescription(e.target.value)}
                                placeholder="New Assignment Description"
                                style={customStyles.input}
                            />
                            <input
                                type="date"
                                value={newAssignmentDuedate}
                                onChange={(e) => setNewAssignmentDuedate(e.target.value)}
                                placeholder="New Assignment Due Date"
                                style={customStyles.input}
                            />

                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            <div style={customStyles.buttonContainer}>
                                <button onClick={() => handleUpdateAssignment(newAssignmentTitle, newAssignmentDescription, newAssignmentDuedate)} style={customStyles.button}>Update Assignment</button>
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

export default AssignmentList;

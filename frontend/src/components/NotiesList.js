import React, { useState, useEffect } from 'react';
import '../assignmentList.css';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function NotiesList() {
    const [notises, setNotieses] = useState([]);
    const token = localStorage.getItem('token');
    const [newNotiesTitle, setNewNotiesTitle] = useState('');
    const [newNotiesDescription, setNewNotiesDescription] = useState('');
    const [newNewNotiesCategory, setNewNotiesCategory] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notiesToUpdate, setNotiesToUpdate] = useState(null);

    const [errorMessage, setErrorMessage] = useState('');

    // Fetch Notises from the backend
    useEffect(() => {
        const fetchNotises = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/getAllNoties', {
                    headers: { authorization: `${token}` },
                });
                const data = await response.json();
                // Check if data is an array and is valid
                if (Array.isArray(data)) {
                    setNotieses(data);
                } else {
                    console.error('Fetched data is not an array:', data);
                }
            } catch (error) {
                console.error('Error fetching noties', error);
            }
        };
        fetchNotises();
    }, [token]);

    // Handle opening the modal to update a course
    const openUpdateModal = (noties) => {
        if (noties) {
            setNewNotiesTitle(noties.title);
            setNewNotiesDescription(noties.description);
            setNewNotiesCategory(noties.category);
            setNotiesToUpdate(noties); // Set course to be updated
            setIsModalOpen(true); // Open modal
        }
    };

    // Handle closing the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setNotiesToUpdate(null);
        setNewNotiesTitle('');
        setNewNotiesDescription('');
        setNewNotiesCategory('');
    };

    // Handle updating an noties
    const handleUpdateNoties = async () => {

        if (!newNotiesTitle || !newNotiesDescription || !newNewNotiesCategory) {
            setErrorMessage('Please fill in all fields before updating the notice.');
            return;
        }
        setErrorMessage('');

        const updatedNoties = { title: newNotiesTitle, description: newNotiesDescription, category: newNewNotiesCategory };
        try {
            const response = await fetch('http://localhost:5000/api/noties', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${token}`,
                },
                body: JSON.stringify({ notiesId: notiesToUpdate._id, ...updatedNoties }),
            });
            const data = await response.json();
            //setNotieses(notises.map(notiese => (notiese._id === notiesToUpdate._id ? data.notiese : notiese)));
            setNotieses((prevNotieses) =>
                prevNotieses.map((notiese) =>
                    notiese._id === notiesToUpdate._id ? { ...notiese, ...data.noties } : notiese
                )
            );
            closeModal(); // Close the modal after updating
        } catch (error) {
            console.error('Error updating noties:', error);
        }
    };

    // Handle deleting a notice
    const handleDeleteNotice = async (notiesId) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this notice?');

        if (isConfirmed) {
            try {
                await fetch('http://localhost:5000/api/noties', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `${token}`,
                    },
                    body: JSON.stringify({ notiesId }),
                });
                setNotieses(notises.filter(notice => notice._id !== notiesId));
            } catch (error) {
                console.error('Error deleting notice:', error);
            }
        }
    };

    const handleAddNoties = async () => {

        if (!newNotiesTitle || !newNotiesDescription || !newNewNotiesCategory) {
            setErrorMessage('Please fill in all fields before adding the notice.');
            return;
        }
        setErrorMessage('');

        const newNoties = { title: newNotiesTitle, description: newNotiesDescription, category: newNewNotiesCategory };
        try {
            const response = await fetch('http://localhost:5000/api/noties', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `${token}`,
                },
                body: JSON.stringify(newNoties),
            });
            const data = await response.json();
            setNotieses((prevNotieses) => [...prevNotieses, data.noties]);
            setNewNotiesTitle('');
            setNewNotiesDescription('');
            setNewNotiesCategory('');
        } catch (error) {
            console.error('Error adding noties:', error);
        }
    };

    return (
        <div className="assignment-list">
            <h2>All Notices</h2>
            <div className="add-assignment-form">

                <input
                    type="text"
                    placeholder="Noties Title"
                    value={newNotiesTitle}
                    onChange={(e) => setNewNotiesTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Noties Description"
                    value={newNotiesDescription}
                    onChange={(e) => setNewNotiesDescription(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={newNewNotiesCategory}
                    onChange={(e) => setNewNotiesCategory(e.target.value)}
                />
                <button onClick={handleAddNoties}>Add Noties</button>
            </div>

            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <div className="assignment-cards">
                {notises.length > 0 ? (
                    notises.map((notise) => (
                        notise ? (
                            <div className="assignment-card" key={notise._id}>
                                <h3>{notise.title}</h3>
                                <p>{notise.description}</p>
                                <p><strong>Category:</strong> {notise.category}</p>
                                <div className="assignment-actions">
                                    <button className="update-btn" onClick={() => openUpdateModal(notise)}>Update</button>
                                    <button className="delete-btn" onClick={() => handleDeleteNotice(notise._id)}>Delete</button>
                                </div>
                            </div>
                        ) : null
                    ))
                ) : (
                    <p>No notises found</p>
                )}
            </div>

            {/* Modal for Notise Update */}
            <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
                <div style={customStyles.container}>
                    <h2 style={customStyles.title}>Update Noties</h2>
                    {notiesToUpdate && (
                        <>
                            <input
                                type="text"
                                value={newNotiesTitle}
                                onChange={(e) => setNewNotiesTitle(e.target.value)}
                                placeholder="New Notise Title"
                                style={customStyles.input}
                            />
                            <input
                                type="text"
                                value={newNotiesDescription}
                                onChange={(e) => setNewNotiesDescription(e.target.value)}
                                placeholder="New Notise Description"
                                style={customStyles.input}
                            />
                            <input
                                type="text"
                                value={newNewNotiesCategory}
                                onChange={(e) => setNewNotiesCategory(e.target.value)}
                                placeholder="New Notise Category"
                                style={customStyles.input}
                            />

                            {errorMessage && <p className="error-message">{errorMessage}</p>}

                            <div style={customStyles.buttonContainer}>
                                <button onClick={() => handleUpdateNoties(newNotiesTitle, newNotiesDescription, newNewNotiesCategory)} style={customStyles.button}>Update Notice</button>
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

export default NotiesList;

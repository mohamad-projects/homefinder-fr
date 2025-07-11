import { useState } from 'react';
import { useDispatch  } from 'react-redux';
import { Add360 } from '../../features/realestate/realEstateSlice';
import { useParams } from 'react-router-dom';

function Add360ImagesForm() {
    const { id } = useParams();
    console.log(id)
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const handleFileChange = (event) => {
        setSelectedFiles(Array.from(event.target.files));
        setMessage('');
        setError('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedFiles.length === 0) {
            setError('Please select at least one image.');
            return;
        }

        setUploading(true);
        setMessage('');
        setError('');

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('images[]', file); 
        });


        try {
            const actionResult = await dispatch(Add360({ id, formData }));

            // const response = await unwrapResult(actionResult); 

            // if (response) { 
            //     setMessage(response.message || '360 images added successfully!');
            //     setSelectedFiles([]);
            // } else {
            //     setError('Unexpected successful response with no data.');
            // }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Error uploading images. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
            <h2>Upload 360 Images for Real Estate ID: {id}</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="image-upload" style={{ display: 'block', marginBottom: '5px' }}>
                        Select 360 Images:
                    </label>
                    <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                    {selectedFiles.length > 0 && (
                        <p style={{ marginTop: '10px', fontSize: '0.9em', color: '#555' }}>
                            Selected: {selectedFiles.map(file => file.name).join(', ')}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={uploading || selectedFiles.length === 0}
                    style={{
                        padding: '10px 15px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: uploading ? 'not-allowed' : 'pointer',
                        opacity: uploading ? 0.7 : 1,
                    }}
                >
                    {uploading ? 'Uploading...' : 'Upload Images'}
                </button>
            </form>

            {message && <p style={{ color: 'green', marginTop: '15px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
        </div>
    );
}

export default Add360ImagesForm;
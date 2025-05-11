import React, { useEffect, useState } from 'react';
import './Profile.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { profile, removeRealEstateFromProfile } from '../../features/auth/authSlice';
import { deleteRealEstate } from '../../features/realestate/realEstateSlice';

const Profile = () => {
  const data = useSelector((state) => state.auth.profile);
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState('real_estate');
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(profile(id));
}, [dispatch, id]);

const handleDelete = (itemId) => {
      dispatch(deleteRealEstate(itemId));
      dispatch(removeRealEstateFromProfile(itemId));
};

  const handleUpdate = (itemId) => {
    console.log(`Updating ${activeTab} with ID:`, itemId);
  };

  return (
    <div className="app-container">
      <div className="profile-header">
        <h1>{data?.user?.name}'s Profile</h1>
        <div className="user-meta">
          <span className={`status-badge ${data?.user?.status?.toLowerCase()}`}>
            {data?.user?.status}
          </span>
          <span>Joined: {data?.user?.join_date}</span>
        </div>
      </div>

      <div className="contact-section">
        <h2>Contact Information</h2>
        <div className="contact-details">
          <p><strong>Address:</strong> {data?.address?.full_address || 'Not provided'}</p>
          <p><strong>Phone:</strong> {data?.contact?.phone || 'Not provided'}</p>
          <p><strong>Telegram:</strong> {data?.contact?.telegram || 'Not provided'}</p>
          <p><strong>Email:</strong> {data?.user?.email}</p>
        </div>
      </div>

      <div className="listings-section">
        <div className="tabs">
          <button
            className={`tab-button ${activeTab === 'real_estate' ? 'active' : ''}`}
            onClick={() => setActiveTab('real_estate')}
          >
            Real Estate ({data?.listings?.real_estate?.length || 0})
          </button>
          <button
            className={`tab-button ${activeTab === 'services' ? 'active' : ''}`}
            onClick={() => setActiveTab('services')}
          >
            Services ({data?.listings?.services?.length || 0})
          </button>
        </div>

        <div className="listings-content">
          {activeTab === 'real_estate' ? (
            data?.listings?.real_estate?.length > 0 ? (
              <div className="real-estate-list">
                {data.listings.real_estate.map((item) => (
                  <div key={item.id} className="real-estate-item">
                    <div className="item-header">
                      <h3>Property #{item.id}</h3>
                      
                    </div>
                    <p>Type: {item.type}</p>
                    <p>Price: {item.price}</p>
                    <p>Status: <span className={`status-badge ${item.status}`}>{item.status}</span></p>
                    {
                        user.id == id ?
                        <div className="item-actions">
                        <button 
                          className="action-btn update-btn"
                          onClick={() => handleUpdate(item.id)}
                        >
                          Update
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </button>
                    </div>:''
                    }
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No real estate listings available.</p>
            )
          ) : (
            data?.listings?.services?.length > 0 ? (
              <div className="services-list">
                {data.listings.services.map((service) => (
                  <div key={service.id} className="service-item">
                    <div className="item-header">
                      <h3>Service #{service.id}</h3>
                      <div className="item-actions">
                        <button 
                          className="action-btn update-btn"
                          onClick={() => handleUpdate(service.id)}
                        >
                          Update
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(service.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {/* Add service details here */}
                    <p>Title: {service.title || 'No title'}</p>
                    <p>Description: {service.description || 'No description'}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-data">No services available.</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
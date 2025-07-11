import React, { useState } from 'react';
import { FaBed, FaRulerCombined, FaEdit, FaTrash } from 'react-icons/fa';
import './Display.scss';
import { useNavigate } from 'react-router-dom';
import image from '../../assets/ddd.jpg';

const getTranslations = (translateMode) => ({
    comparison: {
    },
    common: {
        close: translateMode ? 'Close' : 'إغلاق',
        compare: translateMode ? 'Compare' : 'قارن',
        moreDetails: translateMode ? 'More Details' : 'المزيد من التفاصيل',
        beds: translateMode ? 'Beds' : 'غرف',
        area: translateMode ? 'Area' : 'المساحة',
        locationLabel: translateMode ? 'Location:' : 'الموقع:',
        previous: translateMode ? 'Previous' : 'السابق',
        next: translateMode ? 'Next' : 'التالي',
        page: translateMode ? 'Page' : 'الصفحة',
        maxCompareAlert: translateMode ? 'You can only compare up to 2 properties.' : 'يمكنك مقارنة عقارين فقط.',
    },
});

const Display = ({
    properties,
    lastPage,
    currentPage,
    handlePageChange,
    translateMode,
    showActions = false,
    onEdit,
    onDelete,
    onPropertiesSelectedForCompare
}) => {
    const navigate = useNavigate();
    const t = getTranslations(translateMode);

    const [selectedForComparison, setSelectedForComparison] = useState([]);

    const handleMoreDetails = (id) => {
        navigate(`/property/${id}`);
    };

    const handleCompareCheckboxChange = (propertyId) => {
        setSelectedForComparison(prevSelected => {
            let newSelection;
            if (prevSelected.includes(propertyId)) {
                newSelection = prevSelected.filter(id => id !== propertyId);
            } else {
                if (prevSelected.length < 2) {
                    newSelection = [...prevSelected, propertyId];
                } else {
                    alert(t.common.maxCompareAlert);
                    return prevSelected;
                }
            }

            if (newSelection.length === 2) {
                if (onPropertiesSelectedForCompare) {
                    onPropertiesSelectedForCompare(newSelection[0], newSelection[1]);
                }
                // بعد إرسالهم، قم بمسح التحديد لتهيئة الاختيار الجديد
                return [];
            }
            return newSelection;
        });
    };

    return (
        <div className="display-page">
            <div className="properties-container">
                {properties.map((property) => (
                    <div className="property-card" key={property.id}>
                        <div className="image-section">
                            <img
                                src={
                                    property.images && property.images.length > 0
                                        ? `http://localhost:8000/storage/real-estate/${property.images[0].name}`
                                        : image
                                }
                                alt="property"
                            />
                        </div>

                        <div className="details-section">
                            <div className="details-row">
                                <div className="detail-item bg-light">
                                    <FaBed className="icon" />
                                    <div>
                                        <span className="value">{property.properties?.room_no ?? 'N/A'}</span>
                                        <span className="label">{t.common.beds}</span>
                                    </div>
                                </div>

                                <div className="detail-item bg-light">
                                    <FaRulerCombined className="icon" />
                                    <div>
                                        <span className="value">{property.properties?.space_status ?? 'N/A'} m²</span>
                                        <span className="label">{t.common.area}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="info-section bg-light">
                                <div className="price">{property.price ?? 0} $</div>
                                <div className="location">
                                    <span>{t.common.locationLabel} </span>
                                    {property.location?.city}, {property.location?.district}
                                </div>
                            </div>

                            {showActions && (
                                <div className="action-buttons">
                                    <button
                                        className="action-icon edit"
                                        onClick={() => onEdit(property.id)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="action-icon delete"
                                        onClick={() => onDelete(property.id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="compare-checkbox-container">
                            <input
                                type="checkbox"
                                id={`compare-${property.id}`}
                                checked={selectedForComparison.includes(property.id)}
                                onChange={() => handleCompareCheckboxChange(property.id)}
                                disabled={selectedForComparison.length === 2 && !selectedForComparison.includes(property.id)}
                            />
                            <label htmlFor={`compare-${property.id}`}>{t.common.compare}</label>
                        </div>

                        <button
                            className="more-details-btn"
                            onClick={() => handleMoreDetails(property.id)}
                        >
                            {t.common.moreDetails}
                        </button>
                    </div>
                ))}
            </div>

            {handlePageChange && (
                <div className="pagination-controls">
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        {t.common.previous}
                    </button>

                    <span>
                        {t.common.page} {currentPage} / {lastPage}
                    </span>

                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === lastPage}>
                        {t.common.next}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Display;
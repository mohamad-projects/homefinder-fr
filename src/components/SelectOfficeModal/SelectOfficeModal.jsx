import React, { useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
// استخدام الأيقونات من المثال الذي أرسلته
import { FaBuilding, FaUserCircle, FaTimes, FaSearch, FaSpinner } from 'react-icons/fa';
import './SelectOfficeModal.scss';

// تم تعديل المكون ليقبل البيانات عبر props بدلاً من استدعاء Redux
const SelectOfficeModal = ({ isOpen, onClose, onSelectOffice, offices, loading, error }) => {
    const { translateMode } = useContext(DarkModeContext);
    const [searchTerm, setSearchTerm] = React.useState('');

    if (!isOpen) return null;

    const t = {
        title: translateMode ? "Select Real Estate Office" : "اختر المكتب العقاري",
        searchPlaceholder: translateMode ? "Search by name..." : "البحث بالاسم...",
        loading: translateMode ? "Loading offices..." : "جاري تحميل المكاتب...",
        error: translateMode ? "Failed to load offices." : "فشل تحميل المكاتب.",
        noOffices: translateMode ? "No offices found." : "لم يتم العثور على مكاتب.",
        select: translateMode ? "Select" : "اختيار",
        userId: translateMode ? "User ID:" : "معرف المستخدم:",
        close: translateMode ? "Close" : "إغلاق",
    };

    // الفلترة تتم على prop 'offices' القادم من صفحة Contact
    const filteredOffices = offices
        ? offices.filter(office =>
            office.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];

    const renderContent = () => {
        if (loading) {
            // استخدام تصميم بسيط للتحميل كما في المثال
            return <p className="modal-status loading-message">{t.loading}</p>;
        }
        if (error) {
            return <p className="modal-status error-message">{error}</p>;
        }
        if (filteredOffices.length === 0) {
            return <p className="modal-status no-data-message">{t.noOffices}</p>;
        }
        return (
            <div className="office-list">
                {filteredOffices.map((office) => (
                    <div key={office.id} className="office-item">
                        <FaUserCircle className="office-icon" />
                        <div className="office-details">
                            <span className="office-name">{office.name}</span>
                            <span className="office-id">{t.userId} {office.id}</span>
                        </div>
                        {/* تعديل بسيط ليمرر كائن المكتب كاملاً ليعمل مع صفحة التواصل */}
                        <button className="select-button" onClick={() => onSelectOffice(office)} aria-label={`${t.select} ${office.name}`}>
                            {t.select}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2><FaBuilding className="header-icon" /> {t.title}</h2>
                    <button className="close-button" onClick={onClose} aria-label={t.close}>
                        <FaTimes />
                    </button>
                </div>
                <div className="modal-search-bar">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder={t.searchPlaceholder}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

export default SelectOfficeModal;
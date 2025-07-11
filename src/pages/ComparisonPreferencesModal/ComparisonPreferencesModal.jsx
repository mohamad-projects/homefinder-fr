// src/pages/ComparisonPreferencesModal/ComparisonPreferencesModal.jsx
import React, { useState, useContext, useEffect } from 'react';
import './ComparisonPreferencesModal.scss';
import { DarkModeContext } from '../../context/DarkModeContext';

// تأكد أن هذه القيم يتم جلبها أو تمريرها بشكل صحيح
// قد تحتاج لإنشاء ملف TRANSLATIONS.js وتصديرها منه
const getTranslations = (translateMode) => ({
    preferencesModal: {
        title: translateMode ? 'Set Comparison Preferences' : 'تحديد تفضيلات المقارنة',
        minPrice: translateMode ? 'Min Price' : 'الحد الأدنى للسعر',
        maxPrice: translateMode ? 'Max Price' : 'الحد الأقصى للسعر',
        minRooms: translateMode ? 'Min Rooms' : 'الحد الأدنى للغرف',
        minSpace: translateMode ? 'Min Space (m²)' : 'الحد الأدنى للمساحة (م²)',
        desiredType: translateMode ? 'Desired Type' : 'النوع المطلوب',
        desiredKind: translateMode ? 'Desired Kind' : 'النوع الفرعي المطلوب',
        electricityStatus: translateMode ? 'Electricity Status' : 'حالة الكهرباء',
        waterStatus: translateMode ? 'Water Status' : 'حالة المياه',
        transportationStatus: translateMode ? 'Transportation Status' : 'حالة النقل',
        wantWaterWell: translateMode ? 'Want Water Well?' : 'هل ترغب ببئر ماء؟',
        wantSolarEnergy: translateMode ? 'Want Solar Energy?' : 'هل ترغب بطاقة شمسية؟',
        wantGarage: translateMode ? 'Want Garage?' : 'هل ترغب بكراج؟',
        wantElevator: translateMode ? 'Want Elevator?' : 'هل ترغب بمصعد؟',
        wantGarden: translateMode ? 'Want Garden?' : 'هل ترغب بحديقة؟',
        attiredStatus: translateMode ? 'Attired Status' : 'حالة التجهيز',
        ownershipType: translateMode ? 'Ownership Type' : 'نوع الملكية',
        compareNow: translateMode ? 'Compare Now' : 'قارن الآن',
        noPreference: translateMode ? 'No Preference' : 'لا يوجد تفضيل',
        good: translateMode ? 'Good' : 'جيد',
        average: translateMode ? 'Average' : 'متوسط',
        bad: translateMode ? 'Bad' : 'سيء',
        yes: translateMode ? 'Yes' : 'نعم',
        no: translateMode ? 'No' : 'لا',
        fullyFurnished: translateMode ? 'Fully Furnished/Well-Maintained' : 'مفروش بالكامل/بحالة جيدة',
        partiallyFurnished: translateMode ? 'Partially Furnished/Average-Maintained' : 'مفروش جزئياً/بحالة متوسطة',
        notFurnished: translateMode ? 'Not Furnished/Poorly-Maintained' : 'غير مفروش/بحالة سيئة',
        greenOwnership: translateMode ? 'Green Ownership' : 'ملكية خضراء',
        courtOwnership: translateMode ? 'Court Ownership' : 'ملكية محكمة',
    },
    common: {
        close: translateMode ? 'Close' : 'إغلاق',
    }
});

const ComparisonPreferencesModal = ({ isOpen, onClose, onCompare, options }) => {
    const { translateMode } = useContext(DarkModeContext);
    const t = getTranslations(translateMode);

    const [preferences, setPreferences] = useState({
        desired_type: '',
        desired_kind: '',
        min_price: '',
        max_price: '',
        min_rooms: '',
        min_space_status: '',
        desired_electricity_status: '',
        desired_water_status: '',
        desired_transportation_status: '',
        want_water_well: null,
        want_solar_energy: null,
        want_garage: null,
        want_elevator: null,
        want_garden: null,
        desired_attired_status: '',
        desired_ownership_type: '',
    });

    useEffect(() => {
        if (isOpen) {
            setPreferences({
                desired_type: '',
                desired_kind: '',
                min_price: '',
                max_price: '',
                min_rooms: '',
                min_space_status: '',
                desired_electricity_status: '',
                desired_water_status: '',
                desired_transportation_status: '',
                want_water_well: null,
                want_solar_energy: null,
                want_garage: null,
                want_elevator: null,
                want_garden: null,
                desired_attired_status: '',
                desired_ownership_type: '',
            });
        }
    }, [isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let processedValue = value;
        if (type === 'checkbox') {
            processedValue = checked;
        } else if (name === 'desired_type' || name === 'desired_kind' || name === 'desired_attired_status' || name === 'desired_ownership_type') {
            // تحويل هذه القيم إلى أحرف صغيرة لتتوافق مع مفاتيح الـ Backend MAPS
            processedValue = value.toLowerCase();
        }
        // القيم الرقمية وحالات الجودة (1,2,3) لا تحتاج إلى toLowerCase()

        setPreferences(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleBooleanChange = (name, value) => {
        setPreferences(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const submittedPreferences = { ...preferences };
        onCompare(submittedPreferences);
    };

    if (!isOpen) return null;

    return (
        <div className="comparison-preferences-modal-overlay">
            <div className="comparison-preferences-modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>{t.preferencesModal.title}</h2>

                <form onSubmit={handleSubmit} className="preferences-form">
                    <div className="form-group">
                        <label>{t.preferencesModal.minPrice}:</label>
                        <input type="number" name="min_price" value={preferences.min_price} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>{t.preferencesModal.maxPrice}:</label>
                        <input type="number" name="max_price" value={preferences.max_price} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>{t.preferencesModal.desiredType}:</label>
                        <select name="desired_type" value={preferences.desired_type} onChange={handleChange}>
                            <option value="">{t.preferencesModal.noPreference}</option>
                            {/* القيم هنا يجب أن تكون بأحرف صغيرة لتتوافق مع مفاتيح TYPE_MAP في Backend */}
                            <option value="sale">{translateMode ? 'For Sale' : 'للبيع'}</option>
                            <option value="rental">{translateMode ? 'For Rent' : 'للإيجار'}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t.preferencesModal.desiredKind}:</label>
                        <select name="desired_kind" value={preferences.desired_kind} onChange={handleChange}>
                            <option value="">{t.preferencesModal.noPreference}</option>
                            {/* هنا نستخدم toLowerCase() على قيمة الـ option لضمان إرسالها بأحرف صغيرة */}
                            {options.types.map((type, index) => (
                                <option key={index} value={type.toLowerCase()}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t.preferencesModal.minRooms}:</label>
                        <input type="number" name="min_rooms" value={preferences.min_rooms} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>{t.preferencesModal.minSpace}:</label>
                        <input type="number" name="min_space_status" value={preferences.min_space_status} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>{t.preferencesModal.electricityStatus}:</label>
                        <select name="desired_electricity_status" value={preferences.desired_electricity_status} onChange={handleChange}>
                            <option value="">{t.preferencesModal.noPreference}</option>
                            <option value="1">{t.preferencesModal.good}</option>
                            <option value="2">{t.preferencesModal.average}</option>
                            <option value="3">{t.preferencesModal.bad}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t.preferencesModal.waterStatus}:</label>
                        <select name="desired_water_status" value={preferences.desired_water_status} onChange={handleChange}>
                            <option value="">{t.preferencesModal.noPreference}</option>
                            <option value="1">{t.preferencesModal.good}</option>
                            <option value="2">{t.preferencesModal.average}</option>
                            <option value="3">{t.preferencesModal.bad}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t.preferencesModal.transportationStatus}:</label>
                        <select name="desired_transportation_status" value={preferences.desired_transportation_status} onChange={handleChange}>
                            <option value="">{t.preferencesModal.noPreference}</option>
                            <option value="1">{t.preferencesModal.good}</option>
                            <option value="2">{t.preferencesModal.average}</option>
                            <option value="3">{t.preferencesModal.bad}</option>
                        </select>
                    </div>

                    <div className="form-group boolean-group">
                        <label>{t.preferencesModal.wantWaterWell}:</label>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_water_well === true ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_water_well', true)}
                        >
                            {t.preferencesModal.yes}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_water_well === false ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_water_well', false)}
                        >
                            {t.preferencesModal.no}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_water_well === null ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_water_well', null)}
                        >
                            {t.preferencesModal.noPreference}
                        </button>
                    </div>

                    <div className="form-group boolean-group">
                        <label>{t.preferencesModal.wantSolarEnergy}:</label>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_solar_energy === true ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_solar_energy', true)}
                        >
                            {t.preferencesModal.yes}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_solar_energy === false ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_solar_energy', false)}
                        >
                            {t.preferencesModal.no}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_solar_energy === null ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_solar_energy', null)}
                        >
                            {t.preferencesModal.noPreference}
                        </button>
                    </div>

                    <div className="form-group boolean-group">
                        <label>{t.preferencesModal.wantGarage}:</label>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_garage === true ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_garage', true)}
                        >
                            {t.preferencesModal.yes}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_garage === false ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_garage', false)}
                        >
                            {t.preferencesModal.no}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_garage === null ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_garage', null)}
                        >
                            {t.preferencesModal.noPreference}
                        </button>
                    </div>

                    <div className="form-group boolean-group">
                        <label>{t.preferencesModal.wantElevator}:</label>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_elevator === true ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_elevator', true)}
                        >
                            {t.preferencesModal.yes}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_elevator === false ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_elevator', false)}
                        >
                            {t.preferencesModal.no}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_elevator === null ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_elevator', null)}
                        >
                            {t.preferencesModal.noPreference}
                        </button>
                    </div>

                    <div className="form-group boolean-group">
                        <label>{t.preferencesModal.wantGarden}:</label>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_garden === true ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_garden', true)}
                        >
                            {t.preferencesModal.yes}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_garden === false ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_garden', false)}
                        >
                            {t.preferencesModal.no}
                        </button>
                        <button
                            type="button"
                            className={`boolean-btn ${preferences.want_garden === null ? 'active' : ''}`}
                            onClick={() => handleBooleanChange('want_garden', null)}
                        >
                            {t.preferencesModal.noPreference}
                        </button>
                    </div>

                    <div className="form-group">
                        <label>{t.preferencesModal.attiredStatus}:</label>
                        <select name="desired_attired_status" value={preferences.desired_attired_status} onChange={handleChange}>
                            <option value="">{t.preferencesModal.noPreference}</option>
                            <option value="1">{t.preferencesModal.fullyFurnished}</option>
                            <option value="2">{t.preferencesModal.partiallyFurnished}</option>
                            <option value="3">{t.preferencesModal.notFurnished}</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>{t.preferencesModal.ownershipType}:</label>
                        <select name="desired_ownership_type" value={preferences.desired_ownership_type} onChange={handleChange}>
                            <option value="">{t.preferencesModal.noPreference}</option>
                            {/* هنا نستخدم toLowerCase() على قيمة الـ option لضمان إرسالها بأحرف صغيرة */}
                            <option value="green">{t.preferencesModal.greenOwnership}</option>
                            <option value="court">{t.preferencesModal.courtOwnership}</option>
                        </select>
                    </div>

                    <button type="submit" className="submit-compare-btn">
                        {t.preferencesModal.compareNow}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ComparisonPreferencesModal;
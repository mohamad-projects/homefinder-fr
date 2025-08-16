import React, { useContext, useState, useEffect } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import SelectOfficeModal from '../../components/SelectOfficeModal/SelectOfficeModal';
import './Contact.scss';
import officeImage from '../../assets/soc.jpg';
import { FaBuilding, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import api from '../../services/api'; // <-- تأكد من أن هذا المسار صحيح لملف إعدادات axios

const Contact = () => {
    const { translateMode } = useContext(DarkModeContext);

    // State لإدارة بيانات الفورم
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    
    // باقي الـ state
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); 
    const [submissionStatus, setSubmissionStatus] = useState({ success: null, message: '' });
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ... useEffect and other functions remain the same
    useEffect(() => {
        const fetchOffices = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('admin/users');
                setOffices(response.data.data || []); 
            } catch (err) {
                console.error("Failed to fetch offices:", err);
                setError(translateMode ? 'Failed to load offices.' : 'فشل تحميل المكاتب.');
            } finally {
                setLoading(false);
            }
        };
        fetchOffices();
    }, [translateMode]);

    const handleSelectOffice = (office) => {
        setSelectedOffice(office);
        setIsModalOpen(false);
    };

    const validateForm = () => {
        if (!name.trim() || !phone.trim() || !description.trim() || !selectedOffice) {
            alert(translateMode ? 'Please fill all fields and select an office.' : 'الرجاء تعبئة جميع الحقول واختيار مكتب.');
            return false;
        }
        return true;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setSubmissionStatus({ success: null, message: '' });
        const complaintData = {
            name: name.trim(),
            phone: phone.trim(),
            descripition: description.trim(),
            user_id: selectedOffice.id,
        };
        try {
            const response = await api.post('complaint/create', complaintData);
            const successMsg = response.data?.message || (translateMode ? 'Your complaint has been sent successfully.' : 'تم إرسال شكواك بنجاح.');
            setSubmissionStatus({ success: true, message: successMsg });
            setName('');
            setPhone('');
            setDescription('');
            setSelectedOffice(null);
        } catch (err) {
            console.error('Error submitting complaint:', err);
            const errorMsg = err.response?.data?.message || (translateMode ? 'There was an error submitting your complaint.' : 'حدث خطأ أثناء إرسال الشكوى.');
            setSubmissionStatus({ success: false, message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    // <-- الخطوة 1: الدالة الخاصة بتصفية حقل الهاتف ليقبل الأرقام فقط
    const handlePhoneChange = (e) => {
        // نأخذ القيمة من حقل الإدخال
        const value = e.target.value;
        // نستخدم تعبيرًا نمطيًا (regex) لإزالة أي شيء ليس رقمًا (مثل الأحرف والرموز)
        const numericValue = value.replace(/\D/g, '');
        // نقوم بتحديث الحالة بالقيمة الرقمية النظيفة فقط
        setPhone(numericValue);
    };

    const t = {
        selectOffice: translateMode ? "Select Office" : "اختر المكتب",
        selectedOfficeLabel: translateMode ? "Selected:" : "المكتب المحدد:",
        changeOffice: translateMode ? "Change" : "تغيير",
        send: translateMode ? "Send" : "إرسال",
        sending: translateMode ? "Sending..." : "جاري الإرسال...",
    };

    return (
        <>
            <div className="contact-page">
                <div className="contact-container">
                    <h1 className="contact-title">{translateMode ? 'Stay In Contact With Us' : 'ابقى على تواصل معنا'}</h1>
                    <div className="contact-sections">
                        {/* الجزء الأيسر لمعلومات الشركة */}
                        <div className="left-container">
                            <div className="company-card">
                                <img src={officeImage} alt="Office" className="company-image" />
                                {/* ... باقي تفاصيل الشركة ... */}
                            </div>
                        </div>

                        <div className="vertical-divider"></div>

                        {/* الجزء الأيمن للفورم */}
                        <div className="right-container">
                            <form className="contact-form" onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <input type="text" className="form-input" placeholder={translateMode ? 'Your Name' : 'اسمك'} value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                
                                {/* <-- الخطوة 2: تحديث حقل إدخال الهاتف هنا */}
                                <div className="form-row">
                                    <input 
                                        type="tel" // نوع الحقل دلالي للهواتف
                                        inputMode="numeric" // يظهر لوحة الأرقام على الجوال
                                        pattern="[0-9]*" // يسمح فقط بالأرقام للتحقق من صحة HTML
                                        className="form-input" 
                                        placeholder={translateMode ? 'Your Phone' : 'هاتفك'} 
                                        value={phone} 
                                        onChange={handlePhoneChange} // استخدام الدالة الجديدة
                                        required 
                                    />
                                </div>

                                <div className="form-row">
                                    <input type="text" className="form-input" placeholder={translateMode ? 'Your Problem' : 'المشكلة'} value={description} onChange={(e) => setDescription(e.target.value)} required />
                                </div>
                                
                                {/* حقل اختيار المكتب */}
                                <div className="form-row office-selection-row">
                                    <div className="office-display">
                                        <FaBuilding />
                                        <span>{selectedOffice ? `${t.selectedOfficeLabel} ${selectedOffice.name}` : t.selectOffice}</span>
                                    </div>
                                    <button type="button" className="select-office-btn-contact" onClick={() => setIsModalOpen(true)}>
                                        {selectedOffice ? t.changeOffice : t.selectOffice}
                                    </button>
                                </div>

                                <button className="send-button" type="submit" disabled={loading}>
                                    {loading ? <><FaSpinner className="spinner" /> {t.sending}</> : t.send}
                                </button>
                                
                                {/* رسالة حالة الإرسال */}
                                {submissionStatus.message && (
                                    <div className={`status-message ${submissionStatus.success ? 'success' : 'error'}`}>
                                        {submissionStatus.success ? <FaCheckCircle /> : <FaExclamationCircle />}
                                        {submissionStatus.message}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                    <p className="contact-note">{translateMode ? 'You can contact us...' : 'يمكنك الاتصال بنا...'}</p>
                </div>
            </div>

            {/* المودال */}
            <SelectOfficeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectOffice={handleSelectOffice}
                offices={offices}
                loading={loading}
                error={error}
            />
        </>
    );
};

export default Contact;
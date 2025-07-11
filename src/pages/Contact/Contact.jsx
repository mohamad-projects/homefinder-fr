import React, { useContext, useState } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import './Contact.scss';
import officeImage from '../../assets/soc.jpg'; 
import axios from 'axios';

const Contact = () => {
  const { translateMode } = useContext(DarkModeContext);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState(''); 
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    // تحقق أساسي من الحقول
    if (!name.trim() || !phone.trim() || !description.trim()) {
      alert(translateMode ? 'Please fill in all fields.' : 'الرجاء تعبئة جميع الحقول.');
      return;
    }

    // تحقق من صحة رقم الهاتف: أرقام فقط، طول بين 6 و 15
    const phoneRegex = /^[0-9]{6,15}$/;
    if (!phoneRegex.test(phone.trim())) {
      alert(translateMode ? 'Invalid Phone Number' : 'رقم هاتف غير صحيح', 'يرجى إدخال أرقام فقط (من 6 إلى 15 رقمًا).');
      return;
    }

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/complaint/create/',

        {
          name: name.trim(),
          descripition: description.trim(),
          phone: phone.trim(),
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      const successMessage = response.data?.message || (translateMode ? 'Your complaint has been sent successfully.' : 'تم إرسال شكواك بنجاح.');
      alert(successMessage);

      setName('');
      setPhone('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting complaint:', error);

      let errorMessage = translateMode ? 'There was an error submitting your complaint.' : 'حدث خطأ أثناء إرسال الشكوى.';
      if (error.response) {
        console.error("Backend Error Response Data:", error.response.data);
        if (error.response.data?.errors) {
            errorMessage += '\n' + JSON.stringify(error.response.data.errors);
        } else if (error.response.data?.message) {
            errorMessage += '\n' + error.response.data.message;
        }
      } else if (error.request) {
        errorMessage = translateMode ? 'No response from server. Please check network connection.' : 'لم يتم استلام رد من الخادم. يرجى التحقق من اتصال الشبكة.';
      } else {
        errorMessage = translateMode ? 'An unexpected error occurred.' : 'حدث خطأ غير متوقع.';
      }
      alert(errorMessage);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <h1 className="contact-title">
          {translateMode ? 'Stay In Contact With Us' : 'ابقى على تواصل معنا'}
        </h1>

        <div className="contact-sections">
          <div className="left-container">
            <div className="company-card">
              <img src={officeImage} alt="Office" className="company-image" />
              <div className="company-details">
                <h3>{translateMode ? 'Company info' : 'معلومات الشركة'}</h3>
                <div className="info-line">
                  <span>{translateMode ? 'Email' : 'البريد'}</span>
                  <p>www.homefinder.com</p>
                </div>
                <div className="info-line">
                  <span>{translateMode ? 'Phone' : 'الهاتف'}</span>
                  <p>963568426</p>
                </div>
                <div className="info-line">
                  <span>{translateMode ? 'Address' : 'العنوان'}</span>
                  <p>Damascus barantech</p>
                </div>
              </div>
            </div>
          </div>

          <div className="vertical-divider"></div>

          <div className="right-container">
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder={translateMode ? 'Your Name' : 'اسمك'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{6,15}"
                  className="form-input"
                  placeholder={translateMode ? 'Your Phone' : 'هاتفك'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  title={
                    translateMode
                      ? 'Enter numbers only (6 to 15 digits)'
                      : 'يرجى إدخال أرقام فقط (من 6 إلى 15 رقمًا)'
                  }
                />
              </div>
              <div className="form-row">
                <input
                  type="text"
                  className="form-input"
                  placeholder={translateMode ? 'Your Problem' : 'المشكلة'}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <button className="send-button" type="submit">
                {translateMode ? 'Send' : 'إرسال'}
              </button>
            </form>
          </div>
        </div>

        <p className="contact-note">
          {translateMode
            ? 'You can contact us to tell us about your problems, and you can also make your suggestions to us'
            : 'يمكنك الاتصال بنا لإخبارنا بمشاكلك، كما يمكنك تقديم اقتراحاتك لنا'}
        </p>
      </div>
    </div>
  );
};

export default Contact;
import React, { useContext } from 'react';
import './ComparisonModal.scss';
import { DarkModeContext } from '../../context/DarkModeContext';

const getTranslations = (translateMode) => ({
    comparison: {
        title: translateMode ? 'Property Comparison Results' : 'نتائج مقارنة العقارات',
        estate1Score: translateMode ? 'Property 1 Score' : 'نتيجة العقار 1',
        estate2Score: translateMode ? 'Property 2 Score' : 'نتيجة العقار 2',
        winner: translateMode ? 'Overall Winner' : 'الفائز الإجمالي',
        feature: translateMode ? 'Feature' : 'الميزة',
        estate1Value: translateMode ? 'Property 1 Value' : 'قيمة العقار 1',
        estate2Value: translateMode ? 'Property 2 Value' : 'قيمة العقار 2',
        featureWinner: translateMode ? 'Winner' : 'الفائز',
        description: translateMode ? 'Description' : 'الوصف',
        userPreference: translateMode ? 'User Preference' : 'تفضيل المستخدم',
        tie: translateMode ? 'Tie' : 'تعادل',
    },
    common: {
        close: translateMode ? 'Close' : 'إغلاق',
    }
});

const ComparisonModal = ({ isOpen, onClose, comparisonData }) => {
    const { translateMode } = useContext(DarkModeContext);
    const t = getTranslations(translateMode);

    // إضافة console.log هنا للتحقق من قيم isOpen و comparisonData
    console.log("ComparisonModal - isOpen:", isOpen);
    console.log("ComparisonModal - comparisonData:", comparisonData);


    if (!isOpen || !comparisonData) return null;

    const { real_estate_1, real_estate_2, comparison_breakdown, overall_winner, message } = comparisonData;

    const winnerClass = overall_winner === `RealEstate ${real_estate_1.id}` ? 'winner-1' :
                        (overall_winner === `RealEstate ${real_estate_2.id}` ? 'winner-2' : 'winner-tie');

    return (
        <div className="comparison-modal-overlay">
            <div className="comparison-modal-content">
                <button className="close-button" onClick={onClose}>&times;</button>
                <h2>{t.comparison.title}</h2>
                <p className="comparison-message">{message}</p>

                <div className={`overall-scores ${winnerClass}`}>
                    <div className={`score-item ${overall_winner === `RealEstate ${real_estate_1.id}` ? 'highlight-score' : ''}`}>
                        <strong>{t.comparison.estate1Score} (ID: {real_estate_1.id}):</strong> {real_estate_1.total_score}
                    </div>
                    <div className={`score-item ${overall_winner === `RealEstate ${real_estate_2.id}` ? 'highlight-score' : ''}`}>
                        <strong>{t.comparison.estate2Score} (ID: {real_estate_2.id}):</strong> {real_estate_2.total_score}
                    </div>
                    <h3 className="winner-highlight">
                        {t.comparison.winner}: {overall_winner === 'Tie' ? t.comparison.tie : overall_winner}
                    </h3>
                </div>

                <div className="comparison-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>{t.comparison.feature}</th>
                                <th>{t.comparison.estate1Value} (ID: {real_estate_1.id})</th>
                                <th>{t.comparison.estate2Value} (ID: {real_estate_2.id})</th>
                                <th>{t.comparison.featureWinner}</th>
                                <th>{t.comparison.description}</th>
                                <th>{t.comparison.userPreference}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(comparison_breakdown).map((item, index) => (
                                <tr key={index}>
                                    <td>{item.title}</td>
                                    <td>{item.value_1}</td>
                                    <td>{item.value_2}</td>
                                    <td>{item.winner === 'Tie' ? t.comparison.tie : item.winner}</td>
                                    <td>{item.description}</td>
                                    <td>{item.user_preference || (translateMode ? 'N/A' : 'غير متوفر')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button className="close-modal-btn" onClick={onClose}>
                    {t.common.close}
                </button>
            </div>
        </div>
    );
};

export default ComparisonModal;
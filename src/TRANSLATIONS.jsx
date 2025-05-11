// src/utils/translations.js
export const getTranslations = (translateMode) => ({
  common: {
    title: translateMode 
      ? 'Easiest Way To Find Your Dream House' 
      : 'أسهل طريقة للعثور على منزل أحلامك',
    subtitle: translateMode
      ? 'This is where you can find a dream place...' 
      : 'هنا يمكنك العثور على مكان أحلامك...',
    search: translateMode ? 'Search' : 'بحث'
  },
  buttons: {
    buy: translateMode ? 'Buy' : 'شراء',
    rent: translateMode ? 'Rent' : 'إيجار'
  },
  filters: {
    country: translateMode ? 'Country' : 'البلد',
    neighborhood: translateMode ? 'Neighborhood' : 'الحي',
    type: translateMode ? 'Type' : 'النوع',
    price: translateMode ? 'price' : 'السعر'
  },
  stats: {
    purchase: translateMode ? 'Properties For Purchase' : 'عقارات للبيع',
    rent: translateMode ? 'Properties For Rent' : 'عقارات للإيجار',
    support: translateMode ? 'Customer Support' : 'دعم عملاء'
  }
});

export const getTranslatedOptions = (translateMode) => ({
  countries: translateMode 
    ? ['USA', 'Canada', 'UK', 'Germany', 'France']
    : ['أمريكا', 'كندا', 'بريطانيا', 'ألمانيا', 'فرنسا'],
  neighborhoods: translateMode
    ? ['Downtown', 'Suburb', 'Rural', 'Beachfront', 'Mountain']
    : ['وسط المدينة', 'ضاحية', 'ريف', 'شاطئ', 'جبل'],
  types: translateMode
    ? ['Apartment', 'Villa', 'Office', 'Studio', 'House']
    : ['شقة', 'فيلا', 'مكتب', 'استوديو', 'منزل']
});
// src/utils/translations.js

// Define the static translation content for each language
const translationContent = {
  en: {
    common: {
      title: 'Find Your Dream Home',
      subtitle: 'Browse thousands of properties for sale and rent effortlessly.',
      search: 'Search',
      heroImageAlt: 'Modern house with a large yard',
      // Added other common phrases that might have been missing from the first 'common' block
      easiestWayTitle: 'Easiest Way To Find Your Dream House',
      dreamPlaceSubtitle: 'This is where you can find a dream place...',
    },
    buttons: {
      buy: 'Buy',
      rent: 'Rent',
    },
    filters: {
      price: 'Max Price ($)',
      type: 'Property Type',
      location: 'Location',
      selectLocation: 'Select Location',
      country: 'Country', // From your second filters block
      neighborhood: 'Neighborhood', // From your second filters block
    },
    stats: {
      purchase: 'Properties for Sale', // From first stats
      rent: 'Properties for Rent',   // From first stats
      support: '24/7 Customer Support', // From first stats
      // If you had 'Properties For Purchase' and 'Properties For Rent' as different keys, ensure consistency
    },
    messages: {
      loadingProperties: 'Loading properties...',
      propertiesError: 'Failed to load properties. Please try again later.',
      noProperties: 'No properties found matching your criteria.',
      loadingLocations: 'Loading locations...',
      locationsError: 'Failed to load locations.',
      noLocations: 'No locations available.',
      statsError: 'Failed to load statistics.',
    },
  },
  ar: {
    common: {
      title: 'اعثر على منزل أحلامك',
      subtitle: 'تصفح آلاف العقارات للبيع والإيجار بسهولة.',
      search: 'بحث',
      heroImageAlt: 'منزل حديث بساحة كبيرة',
      // Added other common phrases from your second 'common' block, ensuring they are static Arabic strings
      easiestWayTitle: 'أسهل طريقة للعثور على منزل أحلامك',
      dreamPlaceSubtitle: 'هنا يمكنك العثور على مكان أحلامك...',
    },
    buttons: {
      buy: 'شراء',
      rent: 'إيجار',
    },
    filters: {
      price: 'أقصى سعر ($)',
      type: 'نوع العقار',
      location: 'الموقع',
      selectLocation: 'اختر موقع',
      country: 'البلد', // From your second filters block
      neighborhood: 'الحي', // From your second filters block
    },
    stats: {
      purchase: 'عقارات للبيع', // From first stats
      rent: 'عقارات للإيجار',   // From first stats
      support: 'دعم العملاء 24/7', // From first stats
      // If you had different Arabic keys, ensure consistency
    },
    messages: {
      loadingProperties: 'جاري تحميل العقارات...',
      propertiesError: 'فشل جلب العقارات. الرجاء المحاولة مرة أخرى لاحقاً.',
      noProperties: 'لم يتم العثور على عقارات مطابقة لمعاييرك.',
      loadingLocations: 'جاري تحميل المواقع...',
      locationsError: 'فشل تحميل المواقع.',
      noLocations: 'لا توجد مواقع متاحة.',
      statsError: 'فشل تحميل الإحصائيات.',
    },
  },
};

// This function selects the correct language object based on translateMode
export const getTranslations = (translateMode) => {
const currentLanguage = translateMode ? 'en' : 'ar';
  return translationContent[currentLanguage];
};


// Options are also static per language, they don't need 'translateMode ? value1 : value2' logic
export const getTranslatedOptions = (translateMode) => {
const currentLanguage = translateMode ? 'en' : 'ar';
  
  const options = {
    countries: {
      en: ['USA', 'Canada', 'UK', 'Germany', 'France'],
      ar: ['أمريكا', 'كندا', 'بريطانيا', 'ألمانيا', 'فرنسا'],
    },
    neighborhoods: {
      en: ['Downtown', 'Suburb', 'Rural', 'Beachfront', 'Mountain'],
      ar: ['وسط المدينة', 'ضاحية', 'ريف', 'شاطئ', 'جبل'],
    },
    types: {
      en: ['Apartment', 'Villa', 'Chalet'],
      ar: ['Apartment', 'Villa', 'Chalet'], 
    }
  };

  return {
    countries: options.countries[currentLanguage] || options.countries.en,
    neighborhoods: options.neighborhoods[currentLanguage] || options.neighborhoods.en,
    types: options.types[currentLanguage] || options.types.en,
  };
};
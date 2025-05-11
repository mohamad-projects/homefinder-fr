export const handleInputChange = (e,func) => {
    const { name, value } = e.target;
    func({ ...formData, [name]: value });
  };

export const handleLocationSelect = (location,func) => {
    func({ 
    ...formData, 
    latitude: location.lat,
    longitude: location.lng
});
};

export const handleImageUpload = (e,func) => {
const files = Array.from(e.target.files);
const newImages = files.map(file => ({
    url: URL.createObjectURL(file),
    file
}));
func([...previewImages, ...newImages]);
};

export const removeImage = (index) => {
const updatedImages = [...previewImages];
updatedImages.splice(index, 1);
setPreviewImages(updatedImages);
};

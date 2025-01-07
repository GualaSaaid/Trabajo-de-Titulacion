import axios from 'axios';

const uploadExcelFile = async (file) => {
  const formData = new FormData();
  formData.append('excel_file', file); // Asegúrate de que el nombre del campo coincida con el backend

  try {
    const response = await axios.post(
      'http://localhost:8000/api/upload_products_excel/', // Asegúrate de que coincide con la ruta en urls.py
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al subir archivo:', error);
    throw error;
  }
};

export default uploadExcelFile;
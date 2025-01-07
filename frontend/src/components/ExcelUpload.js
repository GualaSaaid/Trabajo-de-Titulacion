import React from 'react';
import axios from 'axios';

function ExcelUpload({ onFileUploaded }) {
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert('Por favor, selecciona un archivo Excel.');
      return;
    }

    const formData = new FormData();
    formData.append('excel_file', file);

    try {
      const response = await axios.post(
        'http://localhost:8000/api/upload_products_excel/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.message) {
        alert(response.data.message);
        onFileUploaded(response.data);
      }
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      alert('Hubo un error al cargar el archivo.');
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
      />
      <button type="button" onClick={handleFileChange}>
        Subir Archivo
      </button>
    </div>
  );
}

export default ExcelUpload;
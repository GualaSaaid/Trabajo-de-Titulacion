import React, { useState, useEffect } from 'react';
import axios from 'axios';

const VentaFinalizada = ({ ventaId }) => {
  const [reciboHtml, setReciboHtml] = useState('');

  useEffect(() => {
    // Solicitar el recibo cuando la venta se complete
    const fetchRecibo = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/venta/${ventaId}/recibo/`);
        setReciboHtml(response.data.recibo_html);
      } catch (error) {
        console.error('Error al obtener el recibo:', error);
      }
    };

    fetchRecibo();
  }, [ventaId]);

  const imprimirRecibo = () => {
    const ventanaImpresion = window.open('', '', 'width=800,height=600');
    ventanaImpresion.document.write(reciboHtml);
    ventanaImpresion.document.close();
    ventanaImpresion.print();
  };

  return (
    <div>
      <h1>Venta Finalizada</h1>
      <div dangerouslySetInnerHTML={{ __html: reciboHtml }}></div>
      <button onClick={imprimirRecibo}>Imprimir Recibo</button>
    </div>
  );
};

export default VentaFinalizada;

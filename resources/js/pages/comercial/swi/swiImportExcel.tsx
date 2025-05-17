import axios from 'axios';
import { useState } from 'react'
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';
import AppLayout from "@/layouts/app-layout";
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Subir Archivo Excel',
    href: '/swiExcel',
  },
];

const swiImportExcel = () => {

  // onchange states
  const [excelFile, setExcelFile] = useState(null);
  const [typeError, setTypeError] = useState(null);

  // submit state
  const [excelData, setExcelData] = useState(null);
  const [datos, setDatos] = useState([]);


  // onchange event
  const handleFile = (e) => {
    let fileTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'];
    let selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile && fileTypes.includes(selectedFile.type)) {
        setTypeError(null);
        let reader = new FileReader();
        reader.readAsArrayBuffer(selectedFile);
        reader.onload = (e) => {
          setExcelFile(e.target.result);
        }
      }
      else {
        setTypeError('Seleccione solo tipos de archivos de Excel');
        setExcelFile(null);
      }
    }
    else {
      console.log('Por favor seleccione su archivo');
    }
  }

  // submit event
  const handleFileSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: 'buffer' });
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      const datos = XLSX.utils.sheet_to_json(worksheet);
      setExcelData(datos);
      setDatos(datos);
    }
  }

  const sendData = () => {

    if (datos.length == 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se ha cargado ningun archivo excel!.',
      });
      return;
    }

    axios.post('swi', datos)
      .then(response => {
        console.log('Respuesta:', response.data);
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Los datos se insertaron correctamente.',
        }).then(() => {
          // Redirige después de hacer clic en OK
          window.location.href = '/swi';
        });



      })
      .catch(error => {
        console.error('Error al enviar los datos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al insertar los datos.',
        });
      });


    console.log('datos', datos)
  }

  const headers = [
    { title: "id", type: "Texto" },
    { title: "mes", type: "Texto" },
    { title: "ano", type: "Texto" },
    { title: "cod_empresa", type: "Texto" },
    { title: "nomb_empresa", type: "Texto" },
    { title: "cod_dep", type: "Texto" },
    { title: "nomb_dep", type: "Texto" },
    { title: "cod_municipio", type: "Texto" },
    { title: "nomb_municipio", type: "Texto" },
    { title: "grupo", type: "Texto" },
    { title: "zona", type: "Texto" },
    { title: "cant_vend_d_punto_vent_kg", type: "Texto" },
    { title: "cant_vend_tanq_D_kg", type: "Texto" },
    { title: "cant_tot_vend_min_k", type: "Texto" },
    { title: "granel", type: "Texto" },
    { title: "cilindros", type: "Texto" },
    { title: "suma", type: "Texto" }
  ];

  const downloadExcel = () => {
    // Crea un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();

    // Prepara la fila de encabezados con solo los nombres de las columnas
    const headerRow = headers.map(header => header.title);

    // Crea una hoja de trabajo con los encabezados
    const ws = XLSX.utils.aoa_to_sheet([headerRow]);

    // Agrega la hoja de trabajo al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws, "sui");

    // Genera el archivo Excel y permite la descarga
    XLSX.writeFile(wb, "plantilla_sui.xlsx");
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Swi Excel" />
      <div className="border-b-2 p-3">
        <div className='border p-5 mb-5'>
          <button className='bg-lime-700 text-white p-3 rounded-md font-black cursor-pointer' onClick={downloadExcel}>Descargar Plantilla Excel</button>
        </div>
        <h3 className='text-2xl'>Cargar Excel</h3>

        {/* form */}
        <div className='flex justify-between'>
          <form className="form-group custom-form" onSubmit={handleFileSubmit}>
            <input type="file" className="bg-gray-200 p-2" required onChange={handleFile} />
            <button type="submit" className="bg-pink-600 p-2 text-white font-bold rounded-md">CARGAR ARCHIVO EXCEL</button>
            {typeError && (
              <div className="alert alert-danger" role="alert">{typeError}</div>
            )}
          </form>
          <button type="button" className="bg-indigo-800 p-2 text-white font-bold rounded-md" onClick={sendData}>ENVIAR DATOS</button>
        </div>
        {/* view data */}
        <div className="mt-5">
          {excelData ? (
            <div className="overflow-scroll rounded-lg border bg-white shadow-sm">
              <table className="w-full table-auto">

                <thead>
                  <tr className="bg-pink-600 text-white">
                    {Object.keys(excelData[0]).map((key) => (
                      <th className="border p-2" key={key}>{key}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {excelData.map((individualExcelData, index) => (
                    <tr key={index}>
                      {Object.keys(individualExcelData).map((key) => (
                        <td className="border px-4 py-2 text-center" key={key}>{individualExcelData[key]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          ) : (
            <div>¡Aún no se ha cargado ningún archivo!</div>
          )}
        </div>

      </div>
    </AppLayout>
  );
}

export default swiImportExcel
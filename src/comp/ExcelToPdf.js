import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import JSZip from 'jszip';

const ExcelToPdf = () => {
    const [excelData, setExcelData] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet);
            setExcelData(rows);
        };

        reader.readAsArrayBuffer(file);
    };

    const generatePdfForRow = (row, index) => {
        const pdf = new jsPDF();
        const content = Object.entries(row)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n');
        pdf.text(content, 10, 10);
        return pdf.output('arraybuffer'); // returns the PDF as an ArrayBuffer
    };

    const generateZip = async () => {
        const zip = new JSZip();

        for (let i = 0; i < excelData.length; i++) {
            const row = excelData[i];
            const pdfData = await generatePdfForRow(row, i);
            zip.file(`row_${i + 1}.pdf`, pdfData);
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'pdfs.zip';
            link.click();
        });
    };

    return (
        <div>
            <h2>Excel to PDF Generator</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
            <button onClick={generateZip} disabled={!excelData.length}>
                Generate and Download ZIP
            </button>
        </div>
    );
};

export default ExcelToPdf;

// import React, { useState } from 'react';
// import * as XLSX from 'xlsx';
// import { jsPDF } from 'jspdf';

// const ExcelToPdf = () => {
//   const [excelData, setExcelData] = useState([]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     const reader = new FileReader();

//     reader.onload = (e) => {
//       const data = new Uint8Array(e.target.result);
//       const workbook = XLSX.read(data, { type: 'array' });
//       const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
//       const rows = XLSX.utils.sheet_to_json(firstSheet);
//       setExcelData(rows);
//     };

//     reader.readAsArrayBuffer(file);
//   };

//   const generatePdfForRow = (row, index) => {
//     const pdf = new jsPDF();
//     const content = Object.entries(row)
//       .map(([key, value]) => `${key}: ${value}`)
//       .join('\n');
//     pdf.text(content, 10, 10);
//     pdf.save(`row_${index + 1}.pdf`);
//   };

//   const generatePdfs = () => {
//     excelData.forEach((row, index) => generatePdfForRow(row, index));
//   };

//   return (
//     <div>
//       <h2>Excel to PDF Generator</h2>
//       <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
//       <button onClick={generatePdfs} disabled={!excelData.length}>
//         Generate PDFs
//       </button>
//     </div>
//   );
// };

// export default ExcelToPdf;
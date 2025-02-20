import React, { useEffect, useState } from 'react';
import JSZip from 'jszip';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import "./css.css";

const ExcelToPdf = () => {
    const [excelData, setExcelData] = useState([]);
    const [checkedArray, setCheckedArray] = useState([]);

    useEffect(() => {
        setCheckedArray([]);
    }, [excelData]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const rows = XLSX.utils.sheet_to_json(firstSheet, {
                raw: false,
            });
            setExcelData(rows);
        };
        reader.readAsArrayBuffer(file);
    };

    const generatePdfForRow = (row, nameCount) => {
        const margin = 10;
        const newLine = 5;
        const lineHeight = 10;
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const maxWidth = pageWidth - 2 * margin;

        const lastName = row['Last Name'];
        const firstName = row['First Name'];

        let yOffset = margin;

        pdf.setFontSize(16);
        pdf.text(`${firstName} ${lastName} - Questionnaire`, margin, yOffset);
        yOffset += lineHeight + newLine;

        pdf.setFontSize(12);
        let content = Object.entries(row)
            .map(([key, value]) => `Q. ${key}\nAns. ${value}`)
            .join('\n\n');

        const wrappedText = pdf.splitTextToSize(content, maxWidth);

        wrappedText.forEach((line) => {
            if (yOffset + newLine > pageHeight - 2 * margin) {
                pdf.addPage();
                yOffset = margin;
            }
            pdf.text(line, margin, yOffset);
            yOffset += newLine;
        });

        // Handle naming convention
        let fileName = firstName;
        if (nameCount[fileName]) {
            nameCount[fileName] += 1;
            fileName = `${fileName}_${nameCount[fileName]}`;
        } else {
            nameCount[fileName] = 1;
        }
        fileName += '_Questionnaire';

        return { pdfData: pdf.output('arraybuffer'), fileName };
    };

    const generateZip = async () => {
        const zip = new JSZip();
        const nameCount = {};

        if (checkedArray.length === 1) {
            const { pdfData, fileName } = await generatePdfForRow(excelData[checkedArray[0]], nameCount);
            const blob = new Blob([pdfData], { type: 'application/pdf' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${fileName}.pdf`;
            link.click();
            return;
        }

        for (let i = 0; i < excelData.length; i++) {
            if (!checkedArray.includes(i)) {
                continue;
            }
            const row = excelData[i];

            const { pdfData, fileName } = await generatePdfForRow(row, nameCount);
            zip.file(`${fileName}.pdf`, pdfData);
        }

        zip.generateAsync({ type: 'blob' }).then((content) => {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'pdfs.zip';
            link.click();
        });
    };

    const handleRowCheckboxClick = (e, val) => {
        const isChecked = e.target.checked;
        setCheckedArray((prevCheckedArray) => {
            if (isChecked) {
                return [...prevCheckedArray, val];
            } else {
                return prevCheckedArray.filter(id => id !== val);
            }
        });
    }

    const handleSelectAllToggle = (e) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setCheckedArray(excelData.map((data, idx) => idx));
        } else {
            setCheckedArray([]);
        }
    }

    return (
        <div className='app-container'>
            <h2 style={{ marginTop: 0 }}>Excel to PDF Generator</h2>
            <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

            {excelData.length !== 0 &&
                <div className='excel-data-container'>
                    <table className='excel-data-table'>
                        <thead>
                            <tr>
                                <th>
                                    {checkedArray.length === excelData.length &&
                                        <label>Unselect All</label>
                                    }
                                    {checkedArray.length !== excelData.length &&
                                        <label>Select All</label>
                                    }
                                    <br></br>
                                    <input type='checkbox'
                                        checked={excelData.length === checkedArray.length}
                                        onChange={e => handleSelectAllToggle(e)}>

                                    </input>
                                </th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Submitted At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {excelData.map((element, index) => (
                                <tr key={index}>
                                    <td>
                                        <input type='checkbox' value={index}
                                            checked={checkedArray.includes(index)}
                                            onChange={e => { handleRowCheckboxClick(e, index) }}
                                        />
                                    </td>
                                    <td>{element['First Name']}</td>
                                    <td>{element['Last Name']}</td>
                                    <td>{element['Timestamp']}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
            {excelData.length !== 0 &&
                <button className='export-button' onClick={generateZip} disabled={!checkedArray.length}>
                    Export ZIP
                </button>
            }
        </div>
    );
};

export default ExcelToPdf;
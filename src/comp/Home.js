import React, { useState } from 'react';
import ExcelToPdf from './ExcelToPdf';
import CherryCalc from './CherryCalc';

function Home(props) {
    const [excel, setExcel] = useState(false);
    const [cherry, setCherry] = useState(false);

    const enableExcelToPdf = () => {
        setCherry(false);
        setExcel(true);
    }
    const enableCherryCalc = () => {
        setExcel(false);
        setCherry(true);
    }
    return (
        <div>
            <div>
                <button onClick={enableExcelToPdf}>Excel-to-PDF</button>
                <button onClick={enableCherryCalc}>Cherry</button>
            </div>
            <div>
                {excel && <ExcelToPdf />}    
                {cherry && <CherryCalc />}
            </div>
        </div>
    );
}

export default Home;
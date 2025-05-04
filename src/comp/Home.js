import React, { useState, useRef } from 'react';
import ExcelToPdf from './ExcelToPdf';
import CherryCalc from './CherryCalc';
import CareCreditCalc from './CareCreditCalc';


function Home(props) {
    const [tool, setTool] = useState('');
    const tabHeader = useRef();

    const removeSelection = () => {
        const selected = tabHeader.current.getElementsByClassName('selected');
        for (let i = 0; i < selected.length; i++) {
            selected[i].classList.remove('selected');
        }
    }

    const enableExcelToPdf = (e) => {
        setTool('excel');
        removeSelection();
        e.target.classList.toggle('selected');
    }
    const enableCherryCalc = (e) => {
        setTool('cherry');
        removeSelection();
        e.target.classList.toggle('selected');
    }
    const enableCareCreditCalc = (e) => {
        setTool('carecredit');
        removeSelection();
        e.target.classList.toggle('selected');
    }
    return (
        <div>
            <div className='home-tab-header' ref={tabHeader}>
                <button onClick={e => enableExcelToPdf(e)}>Excel-to-PDF</button>
                <button onClick={e => enableCherryCalc(e)}>Cherry</button>
                <button onClick={e => enableCareCreditCalc(e)}>Care Credit</button>
            </div>
            <div>
                {tool == 'excel' && <ExcelToPdf />}    
                {tool == 'cherry' && <CherryCalc />}   
                {tool == 'carecredit'  && <CareCreditCalc />}
            </div>
        </div>
    );
}

export default Home;
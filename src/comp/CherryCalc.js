import React, { use, useEffect, useState } from 'react';
import './cherryCal_css.css';

function CherryCalc(props) {
    const [total, setTotal] = useState(0);
    const [amount, setAmount] = useState(0);
    const [percent, setPercent] = useState(8.9);

    const updateAmount = (e) => {
        setAmount(e.target.value);
    }
    const updatePercent = (e) => {
        setPercent(e.target.value);
    }
    useEffect(() => {
        let charge = ((100 * amount)/(100 - percent)).toFixed(2);
        setTotal(charge);
    }, [amount, percent]);
    return (
        <div className='app-container'>
            <h2 style={{ marginTop: 0 }}>Cherry Calculator</h2>
            <div className='cherry-label-small'>Enter the amount you want to collect:</div>
            <div className='cherry-input'><input value={amount} onChange={updateAmount}/></div>
            <div className='cherry-label-small'>Enter the transaction charges in percent:</div>
            <div className='cherry-input'><input value={percent} onChange={updatePercent}/></div>
            <div className='cherry-label-large'>Total amount that you need to charge:</div>
            <div className='cherry-total'>{total}</div>
        </div>
    );
}

export default CherryCalc;
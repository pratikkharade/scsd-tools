import React, { use, useEffect, useState } from 'react';
import './careCreditCal_css.css';

function CareCreditCalc(props) {
    const [total, setTotal] = useState(0);
    const [amount, setAmount] = useState(0);
    const [percent, setPercent] = useState(0);
    const [type, setType] = useState('regular');
    const [payment, setPayment] = useState('standard');
    const rates = {
        'regular' : {
            'standard': 1.9,
            '6months': 5.9,
            '12months': 9.9
        },
        'invisalign' : {
            'standard': 1.9,
            '6months': 4.4,
            '12months': 8.4
        }
    }

    const updateAmount = (e) => {
        setAmount(e.target.value);
    }
    const updatePercent = (e) => {
        setPercent(e.target.value);
    }
    useEffect(() => {
        let charge = ((100 * amount) / (100 - percent)).toFixed(2);
        setTotal(charge);
    }, [amount, percent]);

    useEffect(() => {
        const rate = rates[type][payment];
        setPercent(rate);
    }, [type, payment]);

    return (
        <div className='app-container'>
            <h2 style={{ marginTop: 0 }}>CareCredit Calculator</h2>
            <div className='regular-invisalign-radio'>
                <label>
                    <input
                        type='radio'
                        checked={type === 'regular'}
                        onChange={e => setType('regular')}
                    />
                    Regular
                </label>
                <label>
                    <input
                        type='radio'
                        checked={type === 'invisalign'}
                        onChange={e => setType('invisalign')}
                    />
                    Invisalign
                </label>
            </div>
            <div className='payment-duration-radio'>
                <label>
                    <input 
                        type='radio'
                        checked={payment === 'standard'}
                        onChange={e => setPayment('standard')}
                    />
                    Standard
                </label>
                <label>
                    <input
                        type='radio'
                        checked={payment === '6months'}
                        onChange={e => setPayment('6months')}
                    />
                    6 months
                </label>
                <label>
                    <input
                        type='radio'
                        checked={payment === '12months'}
                        onChange={e => setPayment('12months')}
                    />
                    12 months
                </label>
            </div>
            <div className='carecredit-label-small'>Enter the amount you want to collect:</div>
            <div className='carecredit-input'><input value={amount} onChange={updateAmount} /></div>
            <div className='carecredit-label-small'>Enter the transaction charges in percent:</div>
            <div className='carecredit-input'><input value={percent} onChange={updatePercent} /></div>
            <div className='carecredit-label-large'>Total amount that you need to charge:</div>
            <div className='carecredit-total'>{total}</div>
        </div>
    );
}

export default CareCreditCalc;
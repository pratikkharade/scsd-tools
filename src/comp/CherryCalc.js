import React, { use, useEffect, useState } from 'react';

function CherryCalc(props) {
    const [total, setTotal] = useState(0);
    const [amount, setAmount] = useState(0);
    const [percent, setPercent] = useState(8.9);

    const updateAmount = (e) => {
        // debugger;
        setAmount(e.target.value);
        console.log(amount, percent);
    }
    const updatePercent = (e) => {
        // debugger;
        setPercent(e.target.value);
        console.log(amount, percent);
    }
    useEffect(() => {
        let charge = ((100 * amount)/(100 - percent)).toFixed(2);
        setTotal(charge);
    }, [amount, percent]);
    return (
        <div>
            Cherry Calculator
            <div>
                Enter the amount you want to collect:<br/>
                <input value={amount} onChange={updateAmount}/> <br/>
                Enter the transaction charges in percent: <br/>
                <input value={percent} onChange={updatePercent}/> <br/>
                Total amount that you need to charge: {total}
            </div>
        </div>
    );
}

export default CherryCalc;
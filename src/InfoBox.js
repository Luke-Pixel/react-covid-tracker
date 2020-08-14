import React from 'react';
import {Card, CardContent, Typography} from '@material-ui/core';
import './InfoBox.css';

function InfoBox({title, cases, total, active, isRed, ...props}) {
    return (
        <Card onClick={props.onClick} className={`infoBox ${active && 'infoBox--selected'} ${isRed && 'infoBox--red'}`} >
            <CardContent >
                <Typography className='infoBox_Title' color='textSecondary'>{title}</Typography>
                <br/>
                <h2 className='infoBox_cases'>{cases}</h2>
                
                <Typography className='infoBox_total' color='textSecondary'>Total: {total}</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;

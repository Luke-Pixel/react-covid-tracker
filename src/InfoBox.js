import React from 'react';
import {Card, CardContent, Typography} from '@material-ui/core';

function InfoBox({title, cases, total}) {
    return (
        <Card className='infoBox'>
            <CardContent >
                <Typography className='infoBox_Title' color='textSecondary'>{title}</Typography>
                <br/>
                <h2 className='infoBox_cases'>{cases}</h2>
                <br />
                <Typography className='infoBox_totoal' color='textSecondary'>Total: {total}</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox;

import React from 'react';
import './Warning.css'


function Warning({countries}) {
    return (
        <div className='warning'> 
            <h1>Warning</h1>
            <p1>This project is no longer maintaned, the API used no longer has correct data for some countries listed</p1>
        </div>
    )
}

export default Warning;
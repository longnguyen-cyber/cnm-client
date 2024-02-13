import React from 'react';
import PropTypes from 'prop-types';
import {Result} from 'antd'
import {Button} from 'antd';
import {Link} from 'react-router-dom'
NotFound.propTypes = {
    
};
//create function return sum a and b
function NotFound() {
    return (
        <div>
         <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="primary"><Link to='/' style={{textDecoration:"none"}}> Back Home</Link></Button>}
       />   
        </div>
    );
}

export default React.memo(NotFound);
import React from 'react';
import {CircularProgress, withStyles} from '@material-ui/core';

const style = {
    centered: {
        display: 'flex',
        justifyContent: 'center'
    }
};

const CircularProgressCentered = ({classes, ...props}) => {
    return (
        <div className={classes.centered}>
            <CircularProgress size={100} {...props}/>
        </div>
    );
};

export default withStyles(style)(CircularProgressCentered);
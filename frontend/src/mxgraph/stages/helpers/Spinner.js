import React from 'react';

import { CircularProgress } from '@material-ui/core';

import useStyles from './InteractiveModeButtons.Styles';

const Spinner = () => {
    const classes = useStyles();

    return <CircularProgress size={20} className={classes.spinner} />;
};

export default Spinner;

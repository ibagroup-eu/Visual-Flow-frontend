/*
 * Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import useStyles from './DividerWithText.Styles';

const DividerWithText = ({ children, type }) => {
    const typoVariant = type === 'res' ? 'subtitle1' : 'caption';
    const classes = useStyles();
    return (
        <Box className={classes.container}>
            <Box className={classes.borderLeft} />
            <Typography variant={typoVariant} className={classes.content}>
                {children}
            </Typography>
            <Box className={classes.borderRight} />
        </Box>
    );
};

DividerWithText.propTypes = {
    children: PropTypes.any,
    type: PropTypes.string
};

export default DividerWithText;

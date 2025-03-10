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

import { ErrorOutline } from '@material-ui/icons';
import { Typography } from '@material-ui/core';
import numeral from 'numeral';

import useStyles from './InteractiveModeButtons.Styles';
import { INTERACTIVE_FAILED, INTERACTIVE_SUCCEEDED } from '../../constants';

const InteractiveModeTooltips = ({ stage: { name, status, rowCount } }) => {
    const classes = useStyles();

    const replaceSpaces = value => value.trim().replace(/ /g, '-');

    const formatRowCount = value => numeral(value).format('0.[0]a');

    return (
        <>
            {status === INTERACTIVE_FAILED && (
                <ErrorOutline
                    id={`error-${replaceSpaces(name)}`}
                    className={classes.error}
                />
            )}
            {status === INTERACTIVE_SUCCEEDED && (
                <div
                    id={`rowCount-${replaceSpaces(name)}`}
                    className={classes.rowCountContainer}
                >
                    <Typography
                        id={`rowCount-${replaceSpaces(name)}`}
                        className={classes.rowCount}
                    >
                        {formatRowCount(rowCount)}
                    </Typography>
                </div>
            )}
        </>
    );
};

InteractiveModeTooltips.propTypes = {
    stage: PropTypes.shape({
        name: PropTypes.string,
        status: PropTypes.string,
        rowCount: PropTypes.number
    })
};

export default InteractiveModeTooltips;

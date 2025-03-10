/* eslint-disable complexity */
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
import classNames from 'classnames';

import { Grid, Paper } from '@material-ui/core';

import InputSchemas from './InputSchemas';
import OutputSchema from './OutputSchema';
import { getHeader } from './helpers';

import useStyles from './InteractiveMode.Styles';
import { WRITE } from '../../mxgraph/constants';

const Schemas = ({ inputData, outputData, operation }) => {
    const classes = useStyles();

    const panels = [];
    const tabs = [];

    if (inputData && inputData.length > 0) {
        inputData.forEach((el, index) => {
            panels.push({
                key: index,
                header: getHeader(el.schema),
                schema: el.schema
            });
            tabs.push({
                key: index,
                label: el.name
            });
        });
    }

    if (operation === WRITE) {
        const data = {
            key: 0,
            header: getHeader(outputData),
            schema: outputData
        };
        panels.push(data);
        tabs.push({ key: 0, label: 'Input schema' });
    }

    return (
        <Grid container spacing={2} sx={{ padding: 2 }}>
            <Grid item xs={12} md={6}>
                <Paper
                    elevation={3}
                    sx={{ padding: 2 }}
                    className={
                        panels.length === 1
                            ? classNames(classes.tableContainer, classes.inputCard)
                            : classes.inputCard
                    }
                >
                    <InputSchemas
                        operation={operation}
                        panels={panels}
                        tabs={tabs}
                    />
                </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
                <Paper
                    elevation={3}
                    sx={{ padding: 2 }}
                    className={classes.outputCard}
                >
                    <OutputSchema operation={operation} outputData={outputData} />
                </Paper>
            </Grid>
        </Grid>
    );
};

Schemas.propTypes = {
    inputData: PropTypes.array,
    outputData: PropTypes.array,
    operation: PropTypes.string
};

export default Schemas;

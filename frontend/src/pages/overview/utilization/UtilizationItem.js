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

import { Divider, Grid, Typography, Box } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ProgressChart from '../../../components/chart/progress';
import useStyles from './UtilizationItem.Styles';

const UtilizationItem = ({ cpu = 0, memory = 0 }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    return (
        <Grid
            container
            alignItems="stretch"
            justifyContent="space-evenly"
            spacing={1}
        >
            <Grid item xs={5}>
                <Typography
                    align="center"
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                >
                    {t('jobs:CPU')}
                </Typography>
                <div className={classes.progress}>
                    <ProgressChart value={cpu * 100} />
                </div>
            </Grid>
            <Grid item>
                <Box pt={3} height="100%">
                    <Divider orientation="vertical" light />
                </Box>
            </Grid>
            <Grid item xs={5}>
                <Typography
                    align="center"
                    variant="body2"
                    color="textSecondary"
                    gutterBottom
                >
                    {t('jobs:Memory')}
                </Typography>
                <div className={classes.progress}>
                    <ProgressChart value={memory * 100} />
                </div>
            </Grid>
        </Grid>
    );
};

UtilizationItem.propTypes = {
    cpu: PropTypes.number,
    memory: PropTypes.number
};

export default UtilizationItem;

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

import { Grid, TableCell, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import ProgressChart from '../../../chart/progress';
import styles from './UtilizationCell.Styles';

export const UtilizationCell = ({ cpu = 0, memory = 0, classes, ...rest }) => {
    const { t } = useTranslation();
    return (
        <TableCell className={classNames(classes.cell)} {...rest}>
            <Grid
                container
                alignItems="stretch"
                justifyContent="space-evenly"
                className={classes.root}
            >
                <Grid item xs={6}>
                    <Typography
                        align="center"
                        variant="body2"
                        color="inherit"
                        gutterBottom
                        className={classes.hint}
                    >
                        {t('jobs:CPU')}
                    </Typography>
                    <div className={classes.progress}>
                        <ProgressChart
                            value={cpu * 100}
                            classes={{ caption: classes.caption }}
                        />
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Typography
                        align="center"
                        variant="body2"
                        color="inherit"
                        gutterBottom
                        className={classes.hint}
                    >
                        {t('jobs:Memory')}
                    </Typography>
                    <div className={classes.progress}>
                        <ProgressChart
                            value={memory * 100}
                            classes={{ caption: classes.caption }}
                        />
                    </div>
                </Grid>
            </Grid>
        </TableCell>
    );
};
UtilizationCell.propTypes = {
    cpu: PropTypes.number,
    memory: PropTypes.number,
    classes: PropTypes.object
};

export default withStyles(styles, { name: 'CellUtilization' })(UtilizationCell);

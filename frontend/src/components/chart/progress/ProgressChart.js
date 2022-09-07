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
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import styles from './ProgressChart.Styles';

const ProgressChart = ({ value, thickness = 2, classes }) => (
    <div className={classes.root}>
        <CircularProgress
            variant="determinate"
            className={classes.bottom}
            size="100%"
            thickness={thickness}
            value={100}
        />
        <CircularProgress
            variant="determinate"
            className={classes.top}
            classes={{
                circle: classes.circle
            }}
            size="100%"
            thickness={thickness}
            value={value}
        />
        <div className={classes.caption}>
            <div>
                {`${Math.round(value)}`}
                <small>%</small>
            </div>
        </div>
    </div>
);
ProgressChart.propTypes = {
    value: PropTypes.number,
    thickness: PropTypes.number,
    classes: PropTypes.object
};

export default withStyles(styles, { name: 'ProgressChart' })(ProgressChart);

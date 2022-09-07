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
import { capitalize } from 'lodash';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import classNames from 'classnames';
import styles from './LinearProgressChart.Styles';

const LinearProgressChart = ({ value, status, classes }) => (
    <div className={classes.root}>
        <LinearProgress
            variant="determinate"
            className={classes.margins}
            classes={{
                colorPrimary: classes[`status${capitalize(status)}`],
                barColorPrimary: classes[`statusBar${capitalize(status)}`]
            }}
            value={value}
        />
        <div className={classes.caption}>
            <div
                className={classNames(
                    status && classes[`statusColor${capitalize(status)}`]
                )}
            >
                {`${Math.round(value)}`}
                <small>%</small>
            </div>
        </div>
    </div>
);
LinearProgressChart.propTypes = {
    value: PropTypes.number,
    status: PropTypes.string,
    classes: PropTypes.object
};

export default withStyles(styles, { name: 'LinearProgressChart' })(
    LinearProgressChart
);

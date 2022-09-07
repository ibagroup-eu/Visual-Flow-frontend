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
import { Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import stageIcon from '../../sidebar/stage-icon/stageIcon';
import useStyles from './GroupByStage.Styles';

import makeTooltip from '../helpers/makeTooltip';

const GroupByStage = ({ stage }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const groupingColumns = stage.groupingColumns?.split(',').map(el => el.trim());

    return (
        <div className={classes.root}>
            <Typography variant="body2" component="div" className={classes.name}>
                {stageIcon(stage.operation)}
                {makeTooltip(stage.name, stage.name)}
            </Typography>
            <Typography
                variant="caption"
                component="div"
                className={classes.groupBy}
                color="textSecondary"
            >
                {t('jobDesigner:groupByConfiguration.GroupBy')}:
                {groupingColumns.slice(0, 5).map(value => (
                    <Typography
                        title={value}
                        key={value}
                        variant="caption"
                        component="span"
                        className={classes.key}
                    >
                        {value}
                    </Typography>
                ))}
                <span className={classes.dots}>
                    {groupingColumns.length > 5 &&
                        makeTooltip(groupingColumns.join(', '), ' ...')}
                </span>
            </Typography>
        </div>
    );
};

GroupByStage.propTypes = {
    stage: PropTypes.object
};

export default GroupByStage;

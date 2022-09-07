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
import useStyles from './UnionStage.Styles';
import makeTooltip from '../helpers/makeTooltip';

import StageTag from '../../../components/stage-tag';

const UnionStage = ({ stage }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Typography variant="body2" component="div" className={classes.title}>
                {stageIcon(stage.operation)}
                {makeTooltip(stage.name, stage.name)}
            </Typography>
            <StageTag
                className={classes.type}
                content={t(`jobDesigner:unionConfiguration.${stage.type}`)}
            />
        </div>
    );
};

UnionStage.propTypes = {
    stage: PropTypes.object
};

export default UnionStage;

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
import { useTranslation } from 'react-i18next';

import makeTooltip from '../helpers/makeTooltip';
import { JobStageTag } from '../../../components/stage-tag';
import { ConfiguredStageWithIcon } from '../../sidebar/stage-icon';
import InteractiveModeButtons from '../helpers/InteractiveModeButtons';
import InteractiveModeTooltips from '../helpers/InteractiveModeTooltips';
import { INTERACTIVE_RUNNING } from '../../constants';
import Spinner from '../helpers/Spinner';

import useStyles from './UnionStage.Styles';

const UnionStage = ({ stage }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <ConfiguredStageWithIcon
            operation={stage.operation}
            name={
                <>
                    {makeTooltip(stage.name, stage.name)}
                    {stage.interactiveMode && (
                        <InteractiveModeButtons stage={stage} />
                    )}
                </>
            }
        >
            {stage.status === INTERACTIVE_RUNNING && <Spinner />}
            {stage.status !== INTERACTIVE_RUNNING && (
                <InteractiveModeTooltips stage={stage} />
            )}
            <JobStageTag className={classes.type}>
                {t(`jobDesigner:unionConfiguration.${stage.type}`)}
            </JobStageTag>
        </ConfiguredStageWithIcon>
    );
};

UnionStage.propTypes = {
    stage: PropTypes.object
};

export default UnionStage;

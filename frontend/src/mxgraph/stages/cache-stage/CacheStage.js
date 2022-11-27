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
import { ConfiguredStageWithIcon } from '../../sidebar/stage-icon';
import makeTooltip from '../helpers/makeTooltip';
import { StageParameters, Parameter } from '../parameters';

const CacheStage = ({ stage }) => {
    const { t } = useTranslation();

    return (
        <ConfiguredStageWithIcon
            operation={stage.operation}
            name={makeTooltip(stage.name, stage.name)}
        >
            <StageParameters>
                <Parameter name={t('jobDesigner:cacheConfiguration.useDisk')}>
                    {' '}
                    {stage.useDisk}
                </Parameter>
                <Parameter name={t('jobDesigner:cacheConfiguration.useMemory')}>
                    {' '}
                    {stage.useMemory}
                </Parameter>
            </StageParameters>
        </ConfiguredStageWithIcon>
    );
};

CacheStage.propTypes = {
    stage: PropTypes.object
};

export default CacheStage;

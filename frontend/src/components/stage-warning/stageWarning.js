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
import ReportOutlinedIcon from '@material-ui/icons/ErrorOutlineOutlined';
import { useTranslation } from 'react-i18next';
import useStyles from './stageWarning.Styles';
import { findByProp } from '../helpers/JobsPipelinesTable';
import {
    findParamByKey,
    validParamsContainer
} from '../helpers/PipelinesValidation';

const StageWarning = ({ stage, jobs, params, pipelines }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const position = stage.name ? null : classes.stageWithoutName;

    const stageNotFilled = () => {
        if (jobs && stage.operation === 'JOB') {
            return !findByProp(jobs, stage.jobId, 'id');
        }

        if (pipelines && stage.operation === 'PIPELINE') {
            return !findByProp(pipelines, stage.pipelineId, 'id');
        }

        if (params && stage.operation === 'NOTIFICATION') {
            return !findParamByKey(params, [stage.addressees]);
        }

        if (params && stage.operation === 'CONTAINER') {
            return !validParamsContainer(params, stage);
        }

        return false;
    };

    return stageNotFilled() ? (
        <span title={t('main:validation.fieldsNotFilled')} className={position}>
            <ReportOutlinedIcon className={classes.icon} />
        </span>
    ) : null;
};

StageWarning.propTypes = {
    stage: PropTypes.object,
    jobs: PropTypes.array,
    params: PropTypes.array,
    pipelines: PropTypes.array
};

export default StageWarning;

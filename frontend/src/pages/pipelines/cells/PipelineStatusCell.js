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

import { TableCell, Chip, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import { capitalize } from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import RefreshIcon from '@material-ui/icons/Refresh';
import { connect } from 'react-redux';
import styles from '../../../components/status/Status.Styles';
import { resumePipeline } from '../../../redux/actions/pipelinesActions';
import { ERROR } from '../../../mxgraph/constants';

const PipelineStatusCell = ({
    projectId,
    pipelineId,
    status,
    showRerun,
    hint,
    classes,
    resume,
    ...rest
}) => {
    const { t } = useTranslation();

    const handleClick = () => resume(projectId, pipelineId);

    return (
        <TableCell className={classNames(classes.cell)} {...rest}>
            <Typography
                align="center"
                variant="body2"
                paragraph
                className={classes.hint}
            >
                {hint || t('pipelines:Status')}
            </Typography>
            {status !== ERROR ? (
                <Chip
                    label={t(`pipelines:${capitalize(status)}`)}
                    variant="outlined"
                    className={classNames(
                        classes.chip,
                        status && classes[`chip${capitalize(status)}`]
                    )}
                />
            ) : (
                <Chip
                    label="Error"
                    onClick={handleClick}
                    onDelete={handleClick}
                    deleteIcon={
                        <RefreshIcon
                            className={classNames(
                                status && classes[`chip${capitalize(status)}`]
                            )}
                        />
                    }
                    variant="outlined"
                    className={classNames(
                        classes.chip,
                        status && classes[`chip${capitalize(status)}`]
                    )}
                />
            )}
        </TableCell>
    );
};
PipelineStatusCell.propTypes = {
    projectId: PropTypes.string,
    pipelineId: PropTypes.string,
    status: PropTypes.string,
    showRerun: PropTypes.bool,
    hint: PropTypes.string,
    classes: PropTypes.object,
    resume: PropTypes.func
};

const mapDispatchToProps = {
    resume: resumePipeline
};

export default withStyles(styles, { name: 'PipelineStatusCell' })(
    connect(null, mapDispatchToProps)(PipelineStatusCell)
);

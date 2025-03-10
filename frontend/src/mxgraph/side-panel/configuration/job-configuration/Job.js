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

import { Box, IconButton, MenuItem, TextField, Typography } from '@material-ui/core';
import TransformOutlinedIcon from '@material-ui/icons/TransformOutlined';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { TextSkeleton } from '../../../../components/skeleton';
import SingleSelectModal from '../modal';
import useStyles from './JobConfiguration.Styles';
import ConfigurationDivider from '../../../../components/divider';

const jobStatuses = [
    {
        value: 'true',
        label: 'Success'
    },
    {
        value: 'false',
        label: 'Failure'
    }
];

const Job = ({
    loading,
    data = [],
    ableToEdit,
    state,
    onStateChange,
    outputPaths,
    onChangeOutputPaths,
    duplicatedName
}) => {
    const classes = useStyles();

    const { t } = useTranslation();

    const [showModal, setShowModal] = React.useState(false);

    const jobNameById = id => {
        const jobById = data?.find(job => job.id === id);
        return jobById ? jobById.name : '';
    };

    const helperText =
        duplicatedName && t('main:validation.projectConnections.nameDuplication');
    return (
        <>
            <SingleSelectModal
                title={t('pipelineDesigner:jobModal.Jobs')}
                display={showModal}
                ableToEdit={ableToEdit}
                onClose={() => setShowModal(false)}
                items={data}
                loading={loading}
                currentValue={state.jobId || ''}
                onSetValue={newValue => {
                    setShowModal(false);

                    onStateChange('jobId', newValue);
                    onStateChange('jobName', jobNameById(newValue));
                }}
            />
            <Box className={classes.fieldWrapper}>
                <TextField
                    disabled={!ableToEdit}
                    label={t('pipelineDesigner:jobConfiguration.Name')}
                    placeholder={t('pipelineDesigner:jobConfiguration.Name')}
                    variant="outlined"
                    fullWidth
                    name="name"
                    value={state.name || ''}
                    onChange={event =>
                        onStateChange(event.target.name, event.target.value)
                    }
                    required
                    helperText={helperText}
                    error={!!duplicatedName}
                />
                <ConfigurationDivider />
                {loading ? (
                    <TextSkeleton />
                ) : (
                    <Box className={classes.fieldWrapper}>
                        <TextField
                            disabled={!ableToEdit}
                            label={t('pipelineDesigner:jobConfiguration.JobName')}
                            placeholder={t(
                                'pipelineDesigner:jobConfiguration.JobName'
                            )}
                            variant="outlined"
                            fullWidth
                            name="jobId"
                            value={jobNameById(state.jobId)}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <IconButton
                                        className={classes.iconBtn}
                                        onClick={() => setShowModal(true)}
                                    >
                                        <TransformOutlinedIcon />
                                    </IconButton>
                                )
                            }}
                            required
                        />
                    </Box>
                )}
                {outputPaths.length ? (
                    <>
                        <ConfigurationDivider />
                        <Box className={classes.outputPaths}>
                            <Typography variant="subtitle1" color="textSecondary">
                                {t('pipelineDesigner:jobConfiguration.OutputPaths')}
                            </Typography>
                        </Box>
                        {outputPaths.map(({ id, successPath, job }) => (
                            <Box key={id} className={classes.pathRow}>
                                <TextField
                                    disabled={
                                        !ableToEdit ||
                                        (outputPaths.some(
                                            p => p.successPath === 'false'
                                        ) &&
                                            successPath === 'true')
                                    }
                                    className={classes.pathStatus}
                                    select
                                    name="successPath"
                                    value={successPath}
                                    onChange={event =>
                                        onChangeOutputPaths(id, event.target.value)
                                    }
                                >
                                    {jobStatuses.map(option => (
                                        <MenuItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                                <TextField
                                    value={job}
                                    className={classes.targetName}
                                    fullWidth
                                    InputProps={{
                                        readOnly: true
                                    }}
                                />
                            </Box>
                        ))}
                    </>
                ) : null}
            </Box>
        </>
    );
};

Job.propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.array,
    ableToEdit: PropTypes.bool,
    state: PropTypes.object,
    onStateChange: PropTypes.func,
    outputPaths: PropTypes.array,
    onChangeOutputPaths: PropTypes.func,
    duplicatedName: PropTypes.bool
};

const mapStateToProps = state => {
    const { data, loading } = state.pages.jobs;
    const filteredJobs = data.jobs?.filter(({ pipelineId }) => pipelineId === null);
    return {
        data: filteredJobs.map(item => ({
            ...item,
            lastRun: item.startedAt && new Date(item.startedAt)
        })),
        loading
    };
};

export default connect(mapStateToProps)(Job);

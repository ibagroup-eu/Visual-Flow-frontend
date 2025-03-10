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

import { Box, IconButton, TextField } from '@material-ui/core';
import TransformOutlinedIcon from '@material-ui/icons/TransformOutlined';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useStyles from '../job-configuration/JobConfiguration.Styles';
import { TextSkeleton } from '../../../../components/skeleton';
import SingleSelectModal from '../modal';
import ConfigurationDivider from '../../../../components/divider';

const Pipeline = ({
    data,
    loading,
    ableToEdit,
    state,
    onStateChange,
    duplicatedName
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [showModal, setShowModal] = React.useState(false);

    const pipelineNameById = id => {
        const pipelineById = data.find(pipeline => pipeline.id === id);
        return pipelineById ? pipelineById.name : '';
    };

    return (
        <>
            <SingleSelectModal
                title={t('pipelineDesigner:pipelineModal.Pipelines')}
                searchTitle={t('pipelineDesigner:pipelineModal.search')}
                display={showModal}
                ableToEdit={ableToEdit}
                onClose={() => setShowModal(false)}
                items={data}
                loading={loading}
                currentValue={state.pipelineId || ''}
                onSetValue={newValue => {
                    setShowModal(false);
                    onStateChange('pipelineId', newValue);
                    onStateChange('pipelineName', pipelineNameById(newValue));
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
                    helperText={
                        duplicatedName &&
                        t('main:validation.projectConnections.nameDuplication')
                    }
                    error={!!duplicatedName}
                />
                <ConfigurationDivider />
                {loading ? (
                    <TextSkeleton />
                ) : (
                    <>
                        <TextField
                            disabled={!ableToEdit}
                            label={t(
                                'pipelineDesigner:pipelineConfiguration.PipelineName'
                            )}
                            placeholder={t(
                                'pipelineDesigner:pipelineConfiguration.PipelineName'
                            )}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="pipelineId"
                            value={pipelineNameById(state.pipelineId)}
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
                    </>
                )}
            </Box>
        </>
    );
};

Pipeline.propTypes = {
    loading: PropTypes.bool,
    data: PropTypes.array,
    ableToEdit: PropTypes.bool,
    state: PropTypes.object,
    onStateChange: PropTypes.func,
    duplicatedName: PropTypes.bool
};

export const mapStateToProps = state => {
    const { data, loading } = state.pages.pipelines;
    const { id } = state.mxGraph.data;
    const filteredPipelines = data.pipelines?.filter(item => item.id !== id);
    return {
        data: filteredPipelines.map(item => ({
            ...item,
            lastRun: item.startedAt && new Date(item.startedAt)
        })),
        loading
    };
};

export default connect(mapStateToProps)(Pipeline);

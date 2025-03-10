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
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { Box, Button, TextField } from '@material-ui/core';

import _ from 'lodash';
import useStyles from './Import.Styles';
import ImportModal from './import-modal';
import showNotification from '../../components/notification/showNotification';
import {
    checkAccessToImport,
    importResources
} from '../../redux/actions/importExportActions';
import { PageSkeleton } from '../../components/skeleton';
import { fetchJobs } from '../../redux/actions/jobsActions';
import { fetchPipelines } from '../../redux/actions/pipelinesActions';
import AlertWindow from '../../components/alert-window';
import { isNotValidFileContent } from '../../utils/validateImportFile';
import { DATABRICKS } from '../../mxgraph/constants';

const Import = ({
    t,
    loading,
    accessToImport,
    checkAccess,
    importToProject,
    projectId,
    existedJobs,
    existedPipelines,
    getJobs,
    getPipelines
}) => {
    const classes = useStyles();

    const [file, setFile] = React.useState(null);
    const inputRef = React.useRef();
    const [jobs, setJobs] = React.useState([]);
    const [pipelines, setPipelines] = React.useState([]);
    const [showModal, setShowModal] = React.useState(false);

    React.useEffect(() => {
        if (projectId) {
            if (window.PLATFORM !== DATABRICKS) {
                checkAccess(projectId);
            }
            getJobs(projectId);
            getPipelines(projectId);
        }
    }, [projectId, checkAccess, getJobs, getPipelines]);

    const loadFile = () => {
        const reader = new FileReader();
        reader.onload = e => {
            try {
                const fileData = JSON.parse(e.target.result);
                if (isNotValidFileContent(fileData)) {
                    throw new Error();
                }

                const jobsList = fileData.jobs || [];
                const pipelinesList = fileData.pipelines || [];

                setJobs(_.sortBy(jobsList, [o => o.name.toLowerCase()]));
                setPipelines(_.sortBy(pipelinesList, [o => o.name.toLowerCase()]));
                setShowModal(true);
            } catch {
                showNotification(t('main:importPage.BadFile'), 'error');
                setFile(null);
            }
        };
        reader.readAsText(file);
    };

    const handleDataImport = data => {
        importToProject(projectId, data)?.catch(error => {
            showNotification(error.message, 'error');
        });
        setFile(null);
    };

    return loading || existedJobs.loading || existedPipelines.loading ? (
        <PageSkeleton />
    ) : (
        <>
            <AlertWindow
                showAlert={window.PLATFORM === DATABRICKS ? false : !accessToImport}
                title={t('main:importPage.Notice')}
                body={t('main:importPage.NotAutorized')}
            />
            <Box className={classes.root}>
                <TextField
                    className={classes.field}
                    label={t('main:importPage.FilePath')}
                    placeholder={t('main:importPage.FilePath')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name="path"
                    value={file?.name || ''}
                    InputProps={{
                        readOnly: true
                    }}
                />

                <input
                    accept=".json"
                    className={classes.input}
                    id="contained-button-file"
                    multiple
                    type="file"
                    ref={inputRef}
                    onChange={() => {
                        setFile(inputRef.current.files[0]);
                        inputRef.current.value = null;
                    }}
                />
                <label htmlFor="contained-button-file">
                    <Button
                        className={classes.button}
                        size="large"
                        variant="contained"
                        color="primary"
                        component="span"
                    >
                        {t('main:button.ChooseFile')}
                    </Button>
                </label>

                <Button
                    className={classes.button}
                    disabled={!file}
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={loadFile}
                >
                    {t('main:button.Load')}
                </Button>
            </Box>
            <ImportModal
                display={showModal}
                title={file?.name || ''}
                jobs={jobs}
                pipelines={pipelines}
                existedList={existedJobs.data.jobs.concat(
                    existedPipelines.data.pipelines
                )}
                onClose={() => setShowModal(false)}
                importResources={handleDataImport}
            />
        </>
    );
};

Import.propTypes = {
    t: PropTypes.func,
    loading: PropTypes.bool,
    importToProject: PropTypes.func,
    projectId: PropTypes.string,
    existedJobs: PropTypes.object,
    existedPipelines: PropTypes.object,
    getJobs: PropTypes.func,
    getPipelines: PropTypes.func,
    accessToImport: PropTypes.bool,
    checkAccess: PropTypes.func
};

const mapStateToProps = state => ({
    existedJobs: state.pages.jobs,
    existedPipelines: state.pages.pipelines,
    loading: state.importExport.loading,
    accessToImport: state.importExport.accessToImport
});

const mapDispatchToProps = {
    checkAccess: checkAccessToImport,
    getJobs: fetchJobs,
    getPipelines: fetchPipelines,
    importToProject: importResources
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    withTranslation()(Import)
);

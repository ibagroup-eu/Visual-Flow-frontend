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
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Box, Button, TextField, Typography } from '@material-ui/core';

import useStyles from './ExportModalWindow.Styles';
import PopupForm from '../popup-form';
import {
    exportResources,
    setExportFileName,
    setDefaultExport
} from '../../redux/actions/importExportActions';

export const ExportModalWindow = ({
    isPipelineModal,
    display,
    projectId,
    selectedJobs,
    selectedPipelines,
    onClose,
    data,
    exportFromProject,
    isFetching,
    exportFileName,
    setExportName,
    setDefault,
    tableData,
    showModal
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [fileName, setFileName] = React.useState('');

    React.useEffect(() => {
        if (isFetching) {
            const element = document.createElement('a');
            const file = new Blob([JSON.stringify(data)], {
                type: 'text/plain;charset=utf-8'
            });
            element.href = URL.createObjectURL(file);
            element.download = `${exportFileName}.json`;
            document.body.appendChild(element);
            element.click();

            onClose();
            setDefault();
        }
    }, [isFetching, data, exportFileName, onClose, setDefault]);

    const handleSaveFile = () => {
        setExportName(fileName);
        const requestData = {
            jobIds: selectedJobs || [],
            pipelines: selectedPipelines
                ? selectedPipelines.map(id => ({
                      pipelineId: id,
                      withRelatedJobs: true
                  }))
                : []
        };
        exportFromProject(projectId, requestData);
    };

    React.useEffect(() => {
        if (showModal) {
            const selectedData = isPipelineModal ? selectedPipelines : selectedJobs;
            const letterPart = tableData?.find(el => el.id === selectedData[0]);
            if (selectedData.length > 1) {
                setFileName(`${letterPart?.name} (${selectedData.length - 1} more)`);
            } else {
                setFileName(letterPart?.name);
            }
        }
    }, [showModal, isPipelineModal, selectedJobs, selectedPipelines, tableData]);

    return (
        <PopupForm
            display={display}
            onClose={onClose}
            title={t('main:form.header.Export')}
            isNotHelper
        >
            <Box className={classes.wrapper}>
                <Box>
                    <TextField
                        label={t('main:FileName')}
                        placeholder={t('main:FileName')}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="export"
                        value={fileName || ''}
                        onChange={e => setFileName(e.target.value)}
                    />
                </Box>
                <Typography
                    display="block"
                    variant="subtitle2"
                    color="textSecondary"
                >
                    <span className={classes.note}>{t('main:export.note1')}</span>
                    <span className={classes.txtNote}>{t('main:export.note2')}</span>
                </Typography>
                <Box className={classes.buttonsGroup}>
                    <Button
                        disabled={!fileName}
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        onClick={() => handleSaveFile()}
                    >
                        {t('main:button.Export')}
                    </Button>
                    <Button
                        className={classNames(classes.button, classes.cancelBtn)}
                        variant="contained"
                        onClick={() => {
                            onClose();
                            setFileName('');
                        }}
                    >
                        {t('main:button.Cancel')}
                    </Button>
                </Box>
            </Box>
        </PopupForm>
    );
};

ExportModalWindow.propTypes = {
    isPipelineModal: PropTypes.bool,
    display: PropTypes.bool,
    projectId: PropTypes.string,
    selectedJobs: PropTypes.array,
    selectedPipelines: PropTypes.array,
    onClose: PropTypes.func,
    data: PropTypes.object,
    exportFromProject: PropTypes.func,
    isFetching: PropTypes.bool,
    exportFileName: PropTypes.string,
    setExportName: PropTypes.func,
    setDefault: PropTypes.func,
    tableData: PropTypes.array,
    showModal: PropTypes.bool
};

const mapStateToProps = state => ({
    data: state.importExport.data,
    exportFileName: state.importExport.fileName,
    isFetching: state.importExport.isFetching
});

const mapDispatchToProps = {
    exportFromProject: exportResources,
    setExportName: setExportFileName,
    setDefault: setDefaultExport
};

export default connect(mapStateToProps, mapDispatchToProps)(ExportModalWindow);

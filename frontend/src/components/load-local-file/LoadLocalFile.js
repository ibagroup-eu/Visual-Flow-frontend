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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, CircularProgress } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import useStyles from './LoadLocalFile.Styles';
import {
    clearFilesState,
    downloadFile,
    uploadFile
} from '../../redux/actions/filesActions';
import { READ, WRITE } from '../../mxgraph/constants';

const LoadLocalFile = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    fileData,
    uploadLocalFile,
    downloadLocalFile,
    loading,
    fileUploaded,
    fileDownloaded,
    clearLocalFilesState,
    jobData,
    stageId,
    jobStatus
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const formData = new FormData();
    const writeFileReady =
        jobStatus === 'Succeeded' &&
        jobData?.definition.graph.find(
            ({ id, value }) =>
                id === stageId &&
                value.path === inputValues.path &&
                value.storage === 'cluster'
        );

    useEffect(() => {
        if (fileDownloaded) {
            const element = document.createElement('a');
            element.href = URL.createObjectURL(fileDownloaded);
            element.download = `${inputValues.path.split('/')[3]}${
                inputValues.operation === WRITE ? '.zip' : ''
            }`;
            document.body.appendChild(element);
            element.click();
            clearLocalFilesState();
        }
    }, [
        fileDownloaded,
        clearLocalFilesState,
        inputValues.operation,
        inputValues.path
    ]);

    useEffect(() => {
        if (fileUploaded) {
            handleInputChange({
                target: { name: 'uploaded', value: fileUploaded.toString() }
            });
            clearLocalFilesState();
        }
    }, [fileUploaded, clearLocalFilesState, handleInputChange]);

    const buttonText = () => {
        if (loading) {
            return t('jobDesigner:FileState.Loading');
        }
        return inputValues.operation === READ &&
            fileData &&
            inputValues.uploaded !== 'true'
            ? t('jobDesigner:FileState.Upload')
            : t('jobDesigner:FileState.Download');
    };

    const loadFile = () => {
        const [, projectId, , fileName] = inputValues.path.split('/');
        if (
            inputValues.operation === READ &&
            fileData &&
            inputValues.uploaded !== 'true'
        ) {
            formData.append('fileToUpload', fileData);
            uploadLocalFile(projectId, inputValues.path, formData);
        } else {
            downloadLocalFile(
                projectId,
                `${inputValues.path}${
                    inputValues.operation === WRITE ? '.zip' : ''
                }`,
                fileName
            );
        }
    };

    return (
        <Button
            className={classes.button}
            size="large"
            variant="contained"
            color="primary"
            disabled={
                !ableToEdit ||
                loading ||
                (inputValues.operation === WRITE && !writeFileReady)
            }
            onClick={loadFile}
        >
            {buttonText()}
            {loading && <CircularProgress className={classes.circular} size={25} />}
        </Button>
    );
};

LoadLocalFile.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    fileData: PropTypes.object,
    uploadLocalFile: PropTypes.func,
    downloadLocalFile: PropTypes.func,
    clearLocalFilesState: PropTypes.func,
    loading: PropTypes.bool,
    fileUploaded: PropTypes.bool,
    fileDownloaded: PropTypes.object,
    jobData: PropTypes.object,
    jobStatus: PropTypes.string,
    stageId: PropTypes.string
};

const mapStateToProps = state => ({
    loading: state.files.loading,
    fileUploaded: state.files.uploaded,
    fileDownloaded: state.files.data,
    jobData: state.mxGraph.data,
    jobStatus: state.jobStatus.status
});

const mapDispatchToProps = {
    uploadLocalFile: uploadFile,
    downloadLocalFile: downloadFile,
    clearLocalFilesState: clearFilesState
};

export default connect(mapStateToProps, mapDispatchToProps)(LoadLocalFile);

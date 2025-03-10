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
import { has } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { WRITE } from '../../../constants';
import history from '../../../../utils/history';
import { uploadFile } from '../../../../redux/actions/filesActions';
import showNotification from '../../../../components/notification/showNotification';
import FileTextField from '../../../../components/file-text-field';
import ReadWriteTextFields from '../../../../components/rw-text-fields';
import WriteMode from '../helpers/WriteMode';
import FileFormatProperties from '../file-format-properties';
import AutocompleteParameter from '../../autocomplete-parameter';
import useStyles from './GoogleCloudStorage.Styles';

const filePromptName = 'pathToKeyFile';
const stringFields = [{ field: 'bucket' }, { field: 'path' }];

const isValidFileExtension = value => {
    let fileExtension = '';
    if (value.lastIndexOf('.') > 0) {
        fileExtension = value.substring(value.lastIndexOf('.') + 1, value.length);
    }
    return fileExtension.toLowerCase() === 'json';
};

const GoogleCloudStorage = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    uploadLocalFile,
    currentProject,
    connection,
    openModal,
    connectionPage,
    error
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const id = uuidv4();

    useEffect(() => {
        if (error) {
            handleInputChange({
                target: {
                    name: filePromptName,
                    value: ''
                }
            });
        }
    }, [error, handleInputChange]);

    const uploadJSON = fileData => {
        if (isValidFileExtension(fileData.name)) {
            const value = `/files/${currentProject}/${id}/${fileData.name.replace(
                /[,()[\]{}\s]/g,
                '_'
            )}`;
            const formData = new FormData();
            formData.append('fileToUpload', fileData);
            uploadLocalFile(currentProject, value, formData).then(() => {
                handleInputChange({
                    target: {
                        name: filePromptName,
                        value
                    }
                });
            });
        } else {
            showNotification(t('main:validation.invalidJSONExtension'), 'error');
        }
    };

    return (
        <>
            <FileTextField
                setFile={fileData => uploadJSON(fileData)}
                name={filePromptName}
                value={inputValues[filePromptName]?.split('/').slice(-1)[0]}
                ableToEdit={!has(connection, filePromptName) && ableToEdit}
                handleInputChange={handleInputChange}
                label={t(`jobDesigner:readConfiguration.${filePromptName}`)}
                accept=".json"
                uploadStage
                clearable
                required
            />
            {!connectionPage && (
                <ReadWriteTextFields
                    ableToEdit={ableToEdit}
                    fields={stringFields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    connection={connection}
                    required
                />
            )}
            {inputValues.operation === WRITE && (
                <WriteMode
                    disabled={!ableToEdit}
                    value={inputValues.writeMode}
                    onChange={handleInputChange}
                />
            )}
            {!connectionPage && (
                <FileFormatProperties
                    ableToEdit={ableToEdit}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    conditions={{
                        stage: inputValues.operation,
                        storage: inputValues.storage
                    }}
                />
            )}
            {inputValues.operation === WRITE && (
                <AutocompleteParameter
                    handleInputChange={handleInputChange}
                    ableToEdit={ableToEdit}
                    className={classes.autocomplete}
                    id="partitionBy"
                    name="partitionBy"
                    state={inputValues}
                    label={t('jobDesigner:writeConfiguration.PartitionBy')}
                />
            )}
        </>
    );
};

GoogleCloudStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    uploadLocalFile: PropTypes.func,
    currentProject: PropTypes.string,
    connection: PropTypes.object,
    openModal: PropTypes.func,
    connectionPage: PropTypes.bool,
    error: PropTypes.object
};

const mapStateToProps = state => ({
    error: state.files.error,
    currentProject:
        state.projects.currentProject ?? history.location.pathname.split('/')[2]
});

const mapDispatchToProps = {
    uploadLocalFile: uploadFile
};

export default connect(mapStateToProps, mapDispatchToProps)(GoogleCloudStorage);

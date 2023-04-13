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

import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { v4 as uuidv4 } from 'uuid';
import { useTranslation } from 'react-i18next';
import FileTextField from '../../../../components/file-text-field';
import CosProperties from '../common';
import LoadLocalFile from '../../../../components/load-local-file';
import { READ, WRITE } from '../../../constants';
import history from '../../../../utils/history';

const ClusterStorage = ({ inputValues, handleInputChange, ableToEdit, stageId }) => {
    const [file, setFile] = useState(null);
    const { t } = useTranslation();
    const currentProject = useMemo(
        () => history.location.pathname.split('/')[2],
        []
    );
    const id = useMemo(uuidv4, []);
    const { path, operation, format } = inputValues;
    const fileNameValue = path?.split('/')[3];
    const name = operation === READ ? 'filePath' : 'fileName';

    useEffect(() => {
        if (file) {
            handleInputChange({
                target: {
                    name: 'path',
                    value: `/${currentProject}/${id}/${file.name.replace(
                        /[,()[\]{}\s]/g,
                        '_'
                    )}${operation === WRITE ? `.${format}` : ''}`
                }
            });
            if (operation === READ) {
                handleInputChange({
                    target: {
                        name: 'uploaded',
                        value: 'false'
                    }
                });
            }
        }
    }, [file, id, currentProject, handleInputChange, format, operation]);

    useEffect(() => {
        if (operation === WRITE) {
            if (format) {
                handleInputChange({
                    target: {
                        name: 'path',
                        value: `${path?.replace(/\..*/, '')}${`.${format}`}`
                    }
                });
            }
        }
    }, [format, handleInputChange, operation, path]);

    return (
        <>
            <FileTextField
                required
                label={t(`jobDesigner:readConfiguration.${name}`)}
                value={
                    operation === READ
                        ? fileNameValue
                        : fileNameValue?.replace(/\..*/, '')
                }
                ableToEdit={ableToEdit}
                uploadStage={operation === READ}
                clearable={operation !== READ}
                handleInputChange={handleInputChange}
                setFile={data => setFile(data)}
            />

            {path && (
                <>
                    <CosProperties
                        inputValues={inputValues}
                        ableToEdit={ableToEdit}
                        handleInputChange={handleInputChange}
                    />
                    <LoadLocalFile
                        inputValues={inputValues}
                        ableToEdit={ableToEdit}
                        handleInputChange={handleInputChange}
                        fileData={file}
                        stageId={stageId}
                    />
                </>
            )}
        </>
    );
};

ClusterStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    stageId: PropTypes.string
};

export default ClusterStorage;

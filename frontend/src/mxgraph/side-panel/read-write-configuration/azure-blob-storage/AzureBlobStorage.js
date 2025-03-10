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
import { useTranslation } from 'react-i18next';
import { WRITE, READWRITE } from '../../../constants';
import ReadWriteTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import WriteMode from '../helpers/WriteMode';
import FileFormatProperties from '../file-format-properties';
import AutocompleteParameter from '../../autocomplete-parameter';
import useStyles from './AzureBlobStorage.Styles';

const authTypes = [
    { value: 'storageAccountKey', label: 'Storage account key' },
    { value: 'SASToken', label: 'SAS token' }
];

const stringFields = [{ field: 'container' }, { field: 'containerPath' }];

const AzureBlobStorage = ({
    inputValues,
    handleInputChange,
    openModal,
    ableToEdit,
    connectionPage,
    connection
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    useEffect(() => {
        if (authTypes.every(type => type.value !== inputValues.authType)) {
            handleInputChange({
                target: {
                    name: 'authType',
                    value: 'storageAccountKey'
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <ReadWriteTextFields
                ableToEdit={ableToEdit}
                fields={[{ field: 'storageAccount' }]}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
                connection={connection}
                required
            />
            <SelectField
                ableToEdit={ableToEdit}
                label="jobDesigner:readConfiguration.authType"
                name="authType"
                value={
                    authTypes.find(item => item.value === inputValues.authType)
                        ?.value || ''
                }
                handleInputChange={handleInputChange}
                menuItems={authTypes}
                connection={connection}
                type={READWRITE}
                required
            />
            {inputValues.authType === 'storageAccountKey' && (
                <ReadWriteTextFields
                    ableToEdit={ableToEdit}
                    fields={[{ field: 'storageAccountKey' }]}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    connection={connection}
                    hidden
                    required
                />
            )}
            {inputValues.authType === 'SASToken' && (
                <ReadWriteTextFields
                    ableToEdit={ableToEdit}
                    fields={[{ field: 'SASToken' }]}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    connection={connection}
                    nameWIthPoint
                    hidden
                    required
                />
            )}
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

AzureBlobStorage.propTypes = {
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    inputValues: PropTypes.object,
    connectionPage: PropTypes.bool,
    connection: PropTypes.object
};

export default AzureBlobStorage;

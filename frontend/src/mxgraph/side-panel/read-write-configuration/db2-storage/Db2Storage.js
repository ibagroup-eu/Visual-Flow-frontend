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
import ReadTextFields from '../../../../components/rw-text-fields';
import WriteMode from '../helpers/WriteMode';
import { READ, WRITE, READWRITE } from '../../../constants';
import SelectField from '../../../../components/select-field';
import ReadWriteEditorField from '../../../../components/rw-editor-field';
import ParamsSwitchField from '../../../sidebar/params/fields/switch/ParamsSwitchField';
import JDBCProperties from '../jdbc-properties';
import IncrementalLoad from '../helpers/IncrementalLoad';

const customFields = [{ field: 'schema' }, { field: 'table' }];

const fields = [{ field: 'jdbcUrl' }, { field: 'user' }];

const field = [{ field: 'password' }];

const truncateMode = [
    {
        value: 'None',
        label: 'None'
    },
    {
        value: 'Simple',
        label: 'Simple'
    }
];
const truncateModeCascade = [
    {
        value: 'None',
        label: 'None'
    },
    {
        value: 'Simple',
        label: 'Simple'
    },
    {
        value: 'Cascade',
        label: 'Cascade'
    }
];

const showCascade = storage => !(storage !== 'postgresql' && storage !== 'oracle');

const Db2Storage = ({
    inputValues,
    handleInputChange,
    openModal,
    ableToEdit,
    connectionPage,
    connection
}) => {
    const { t } = useTranslation();
    const itemsList = showCascade(inputValues.storage)
        ? truncateModeCascade
        : truncateMode;

    useEffect(() => {
        if (
            inputValues.operation === WRITE &&
            inputValues.storage &&
            !showCascade(inputValues.storage) &&
            inputValues.truncateMode === 'Cascade'
        ) {
            handleInputChange({
                target: {
                    name: 'truncateMode',
                    value: 'None'
                }
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputValues.storage]);

    return (
        <>
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={fields}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
                connection={connection}
                required
            />
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={field}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
                connection={connection}
                hidden
                required
            />

            <IncrementalLoad
                inputValues={inputValues}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
                connection={connection}
                openModal={openModal}
            />

            {inputValues.operation === READ && (
                <>
                    <ParamsSwitchField
                        ableToEdit={ableToEdit}
                        label={t('jobDesigner:readConfiguration.customSql')}
                        name="customSql"
                        value={
                            inputValues.customSql === undefined
                                ? undefined
                                : inputValues.customSql === 'true'
                        }
                        onChange={handleInputChange}
                        type={READWRITE}
                        defaultValue={false}
                    />
                    {!inputValues.customSql || inputValues.customSql === 'false' ? (
                        <ReadTextFields
                            ableToEdit={ableToEdit}
                            fields={customFields}
                            inputValues={inputValues}
                            handleInputChange={handleInputChange}
                            openModal={openModal}
                            required
                        />
                    ) : (
                        <ReadWriteEditorField
                            name="option.dbtable"
                            placeholder={t(
                                'jobDesigner:readConfiguration.optiondbtable'
                            )}
                            inputValues={inputValues}
                            onChange={handleInputChange}
                            ableToEdit={ableToEdit}
                            openModal={openModal}
                            storageName={inputValues.storage}
                        />
                    )}
                </>
            )}
            {inputValues.operation === WRITE && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={customFields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    required
                />
            )}
            {!connectionPage && (
                <>
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={[{ field: 'prepareQuery' }]}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                    />
                    <JDBCProperties
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        ableToEdit={ableToEdit}
                    />
                </>
            )}
            {inputValues.operation === WRITE && (
                <>
                    <WriteMode
                        disabled={!ableToEdit}
                        value={inputValues.writeMode}
                        onChange={handleInputChange}
                    />
                    {inputValues.writeMode === 'Overwrite' && (
                        <SelectField
                            ableToEdit={ableToEdit}
                            label="jobDesigner:readConfiguration.truncateMode"
                            name="truncateMode"
                            value={
                                itemsList.find(
                                    item => item.value === inputValues.truncateMode
                                )?.value || ''
                            }
                            handleInputChange={handleInputChange}
                            menuItems={itemsList}
                            type={READWRITE}
                        />
                    )}
                </>
            )}
            {!connectionPage && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={[{ field: 'certData', rows: 6 }]}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                />
            )}
        </>
    );
};

Db2Storage.propTypes = {
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    inputValues: PropTypes.shape({
        format: PropTypes.string,
        operation: PropTypes.string,
        writeMode: PropTypes.string,
        truncateMode: PropTypes.string,
        customSql: PropTypes.string,
        partitionBy: PropTypes.string,
        storage: PropTypes.string
    }),
    connectionPage: PropTypes.bool,
    connection: PropTypes.object
};

export default Db2Storage;

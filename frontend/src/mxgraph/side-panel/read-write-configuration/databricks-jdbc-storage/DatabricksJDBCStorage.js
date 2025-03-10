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
import { useTranslation } from 'react-i18next';
import ReadTextFields from '../../../../components/rw-text-fields';
import { READ, WRITE, READWRITE } from '../../../constants';
import WriteMode from '../helpers/WriteMode';
import { ParamsSwitchField } from '../../../sidebar/params/fields';
import JDBCProperties from '../jdbc-properties/JDBCProperties';
import ReadWriteEditorField from '../../../../components/rw-editor-field';

const fields = [{ field: 'jdbcUrl' }, { field: 'user' }];
const passwordField = [{ field: 'password' }];
const schemaTableFields = [{ field: 'schema' }, { field: 'table' }];

const DatabricksJDBCStorage = ({
    inputValues,
    handleInputChange,
    openModal,
    ableToEdit,
    connectionPage,
    connection
}) => {
    const { t } = useTranslation();

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
                fields={passwordField}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
                connection={connection}
                hidden
                required
            />
            {!connectionPage && (
                <>
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={[{ field: 'catalog' }]}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        required
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
                            {!inputValues.customSql ||
                            inputValues.customSql === 'false' ? (
                                <ReadTextFields
                                    ableToEdit={ableToEdit}
                                    fields={schemaTableFields}
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
                                />
                            )}
                        </>
                    )}
                    {inputValues.operation === WRITE && (
                        <ReadTextFields
                            ableToEdit={ableToEdit}
                            fields={schemaTableFields}
                            inputValues={inputValues}
                            handleInputChange={handleInputChange}
                            openModal={openModal}
                            required
                        />
                    )}
                    <JDBCProperties
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        ableToEdit={ableToEdit}
                    />
                    {inputValues.operation === WRITE && (
                        <WriteMode
                            disabled={!ableToEdit}
                            value={inputValues.writeMode}
                            onChange={handleInputChange}
                            required
                        />
                    )}
                </>
            )}
        </>
    );
};

DatabricksJDBCStorage.propTypes = {
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    inputValues: PropTypes.shape({
        writeMode: PropTypes.string,
        operation: PropTypes.string,
        customSql: PropTypes.string
    }),
    connectionPage: PropTypes.bool,
    connection: PropTypes.object
};

export default DatabricksJDBCStorage;

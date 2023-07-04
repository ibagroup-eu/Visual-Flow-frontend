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
import ReadTextFields from '../../../../components/rw-text-fields';
import SelectField from '../../../../components/select-field';
import WriteMode from '../helpers/WriteMode';
import { WRITE, READWRITE } from '../../../constants';

const fields = [
    [{ field: 'host' }, { field: 'port' }, { field: 'user' }, { field: 'database' }]
];

const field = [{ field: 'password' }];

const customSql = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const customSqlFields = [[{ field: 'schema' }, { field: 'table' }]];

const ClickHouseStorage = ({
    inputValues,
    handleInputChange,
    openModal,
    ableToEdit,
    connectionPage,
    connection
}) => (
    <>
        <ReadTextFields
            ableToEdit={ableToEdit}
            fields={fields[0]}
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

        {!connectionPage && (
            <>
                {inputValues.operation === WRITE ? (
                    <>
                        <WriteMode
                            disabled={!ableToEdit}
                            value={inputValues.writeMode}
                            onChange={handleInputChange}
                            storage="clickHouse"
                        />
                        <ReadTextFields
                            ableToEdit={ableToEdit}
                            fields={customSqlFields[0]}
                            inputValues={inputValues}
                            handleInputChange={handleInputChange}
                            openModal={openModal}
                            required
                        />
                    </>
                ) : (
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:readConfiguration.customSql"
                        name="customSql"
                        value={inputValues.customSql}
                        handleInputChange={handleInputChange}
                        menuItems={customSql}
                        type={READWRITE}
                        required
                    />
                )}
                {inputValues.customSql === 'false' && (
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={customSqlFields[0]}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        required
                    />
                )}
                {inputValues.customSql === 'true' && (
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={[{ field: 'option.dbtable', rows: 6 }]}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        nameWIthPoint
                        required
                    />
                )}
            </>
        )}
    </>
);

ClickHouseStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    connectionPage: PropTypes.bool,
    connection: PropTypes.object
};

export default ClickHouseStorage;

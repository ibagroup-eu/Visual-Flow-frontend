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
import { Divider } from '@material-ui/core';
import { isEqual } from 'lodash';
import ReadTextFields from '../../../../components/rw-text-fields';
import WriteMode from '../helpers/WriteMode';
import { WRITE, READ, READWRITE } from '../../../constants';
import SelectField from '../../../../components/select-field';
import Ssl from '../helpers/Ssl';

const fields = [
    [{ field: 'host' }, { field: 'port' }, { field: 'user' }],
    [{ field: 'bucket' }],
    [{ field: 'extraCopyOptions' }],
    [{ field: 'table' }]
];

const keyFields = [{ field: 'accessKey' }, { field: 'secretKey' }];
const dataBaseField = [{ field: 'database' }];

const field = [{ field: 'password' }];

const booleanFields = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const RedshiftStorage = ({
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
        />
        <ReadTextFields
            ableToEdit={ableToEdit}
            fields={field}
            inputValues={inputValues}
            handleInputChange={handleInputChange}
            openModal={openModal}
            connection={connection}
            hidden
        />
        <ReadTextFields
            ableToEdit={ableToEdit}
            fields={dataBaseField}
            inputValues={inputValues}
            handleInputChange={handleInputChange}
            openModal={openModal}
            connection={connection}
        />
        <Ssl
            ableToEdit={ableToEdit}
            value={inputValues.ssl}
            handleInputChange={handleInputChange}
            connection={connection}
        />
        <ReadTextFields
            ableToEdit={ableToEdit}
            fields={keyFields}
            inputValues={inputValues}
            handleInputChange={handleInputChange}
            openModal={openModal}
            connection={connection}
            hidden
        />

        {!connectionPage && (
            <>
                {!isEqual(connection, {}) && <Divider style={{ marginTop: 8 }} />}
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={fields[1]}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                />
            </>
        )}
        {inputValues.operation === READ && (
            <SelectField
                ableToEdit={ableToEdit}
                label="jobDesigner:readConfiguration.customSql"
                name="customSql"
                value={inputValues.customSql}
                handleInputChange={handleInputChange}
                menuItems={booleanFields}
                type={READWRITE}
            />
        )}
        {(inputValues.customSql === 'false' || inputValues.operation === WRITE) && (
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={fields[3]}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
        )}
        {inputValues.customSql === 'true' && inputValues.operation === READ && (
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={[{ field: 'query', rows: 6 }]}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
        )}
        {inputValues.operation === WRITE && (
            <WriteMode
                disabled={!ableToEdit}
                value={inputValues.writeMode}
                onChange={handleInputChange}
            />
        )}
    </>
);

RedshiftStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    connectionPage: PropTypes.bool,
    connection: PropTypes.object
};

export default RedshiftStorage;

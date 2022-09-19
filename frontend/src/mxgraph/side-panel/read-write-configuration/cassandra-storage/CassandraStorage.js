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
import { WRITE, READWRITE } from '../../../constants';
import WriteMode from '../helpers/WriteMode';
import SelectField from '../../../../components/select-field';
import Ssl from '../helpers/Ssl';

const dropdownOptions = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const fields = [
    [
        { field: 'keyspace' },
        { field: 'cluster' },
        { field: 'host' },
        { field: 'port' }
    ],
    [{ field: 'table' }]
];

const userFields = [{ field: 'username' }];

const field = [{ field: 'password' }];

const CassandraStorage = ({
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
        <Ssl
            ableToEdit={ableToEdit}
            value={inputValues.ssl}
            handleInputChange={handleInputChange}
            connection={connection}
        />
        <ReadTextFields
            ableToEdit={ableToEdit}
            fields={userFields}
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
                <SelectField
                    ableToEdit={ableToEdit}
                    label="jobDesigner:readConfiguration.pushdownEnabled"
                    name="pushdownEnabled"
                    value={inputValues.pushdownEnabled}
                    handleInputChange={handleInputChange}
                    menuItems={dropdownOptions}
                    type={READWRITE}
                />
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={[{ field: 'certData', rows: 6 }]}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                />
            </>
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

CassandraStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    connectionPage: PropTypes.bool,
    connection: PropTypes.object
};

export default CassandraStorage;

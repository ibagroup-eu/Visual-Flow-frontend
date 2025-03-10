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
import DatabricksConfigurationPage from './DatabricksConfigurationPage';
import { DATABRICKS } from '../../../constants';

const fields = [{ field: 'jdbcUrl' }, { field: 'user' }];
const passwordField = [{ field: 'password' }];

const DatabricksStorage = ({
    inputValues,
    handleInputChange,
    openModal,
    ableToEdit,
    connectionPage,
    connection
}) => {
    return (
        <>
            {connectionPage ? (
                <>
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={fields}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        connection={connection}
                        required={window.PLATFORM !== DATABRICKS}
                    />
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={passwordField}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                        connection={connection}
                        hidden
                        required={window.PLATFORM !== DATABRICKS}
                    />
                </>
            ) : (
                <DatabricksConfigurationPage
                    ableToEdit={ableToEdit}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                />
            )}
        </>
    );
};

DatabricksStorage.propTypes = {
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    inputValues: PropTypes.object,
    connectionPage: PropTypes.bool,
    connection: PropTypes.object
};

export default DatabricksStorage;

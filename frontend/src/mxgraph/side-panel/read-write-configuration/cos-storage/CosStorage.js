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
import CosProperties from '../common';
import SelectField from '../../../../components/select-field';
import { READWRITE } from '../../../constants';

const authType = [
    {
        value: 'HMAC',
        label: 'HMAC'
    },
    {
        value: 'IAM',
        label: 'IAM'
    }
];

const endpointField = [{ field: 'Endpoint' }];

const fields = [{ field: 'Bucket' }, { field: 'Path' }];

const keyFields = [{ field: 'Access key' }, { field: 'Secret key' }];

const iamFields = [{ field: 'iamApiKey' }, { field: 'iamServiceId' }];

const CosStorage = ({ inputValues, handleInputChange, openModal, ableToEdit }) => {
    return (
        <>
            <ReadTextFields
                fields={endpointField}
                openModal={openModal}
                inputValues={inputValues}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
            />
            <SelectField
                ableToEdit={ableToEdit}
                label="jobDesigner:readConfiguration.authType"
                name="authType"
                value={inputValues.authType}
                handleInputChange={handleInputChange}
                menuItems={authType}
                type={READWRITE}
            />
            {inputValues.authType === 'HMAC' && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={keyFields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    hidden
                />
            )}
            {inputValues.authType === 'IAM' && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={iamFields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    hidden
                />
            )}
            <CosProperties
                fields={fields}
                openModal={openModal}
                inputValues={inputValues}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
            />
        </>
    );
};

CosStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default CosStorage;

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

import { READWRITE } from '../../../constants';
import ReadTextFields from '../../../../components/rw-text-fields';
import CosProperties from '../common/CosProperties';
import SelectField from '../../../../components/select-field';
import Ssl from '../helpers/Ssl';

const anonymousAccess = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const ANONYMOUS_ACCESS_DEFAULT_VALUES = 'true';

const endpointField = [{ field: 'Endpoint' }];

const fields = [{ field: 'Bucket' }, { field: 'Path' }];

const keyFields = [{ field: 'Access key' }, { field: 'Secret key' }];

const AwsStorage = ({ inputValues, handleInputChange, openModal, ableToEdit }) => (
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
            label="jobDesigner:readConfiguration.AnonymousAccess"
            name="anonymousAccess"
            value={inputValues.anonymousAccess}
            handleInputChange={handleInputChange}
            menuItems={anonymousAccess}
            type={READWRITE}
            defaultValue={ANONYMOUS_ACCESS_DEFAULT_VALUES}
            required
        />
        <Ssl
            ableToEdit={ableToEdit}
            value={inputValues.ssl}
            handleInputChange={handleInputChange}
        />
        {inputValues.anonymousAccess === 'false' && (
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={keyFields}
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

AwsStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default AwsStorage;

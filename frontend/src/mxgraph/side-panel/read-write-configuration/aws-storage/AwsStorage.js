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
import { READWRITE } from '../../../constants';
import ReadTextFields from '../../../../components/rw-text-fields';
import CosProperties from '../common/CosProperties';
import Ssl from '../helpers/Ssl';
import ParamsSwitchField from '../../../sidebar/params/fields/switch/ParamsSwitchField';
import IncrementalLoad from '../helpers/IncrementalLoad';

const ANONYMOUS_ACCESS_DEFAULT_VALUES = 'true';

const endpointField = [{ field: 'endpoint' }];
const fields = [{ field: 'bucket' }, { field: 'path' }];
const keyFields = [{ field: 'accessKey' }, { field: 'secretKey' }];

const AwsStorage = ({
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
                fields={endpointField}
                openModal={openModal}
                inputValues={inputValues}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
                connection={connection}
                required
            />

            <IncrementalLoad
                inputValues={inputValues}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
                connection={connection}
                openModal={openModal}
            />

            <ParamsSwitchField
                ableToEdit={ableToEdit}
                label={t('jobDesigner:readConfiguration.anonymousAccess')}
                name="anonymousAccess"
                value={
                    inputValues.anonymousAccess === undefined
                        ? undefined
                        : inputValues.anonymousAccess === 'true'
                }
                onChange={handleInputChange}
                type={READWRITE}
                defaultValue={ANONYMOUS_ACCESS_DEFAULT_VALUES === 'true'}
                connection={connection}
            />
            {inputValues.anonymousAccess === 'false' && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={keyFields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                    connection={connection}
                    hidden
                    required
                />
            )}

            <Ssl
                ableToEdit={ableToEdit}
                value={
                    inputValues.ssl === undefined
                        ? undefined
                        : inputValues.ssl === 'true'
                }
                handleInputChange={handleInputChange}
                connection={connection}
            />
            {!connectionPage && (
                <>
                    <CosProperties
                        fields={fields}
                        openModal={openModal}
                        inputValues={inputValues}
                        ableToEdit={ableToEdit}
                        handleInputChange={handleInputChange}
                    />
                </>
            )}
        </>
    );
};

AwsStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    connectionPage: PropTypes.bool,
    connection: PropTypes.object
};

export default AwsStorage;

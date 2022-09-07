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
import { READ, WRITE, READWRITE } from '../../../constants';
import WriteMode from '../helpers/WriteMode';
import SelectField from '../../../../components/select-field';
import NumberField from '../../../../components/number-field';
import Ssl from '../helpers/Ssl';

const DEFAULT_TTL = 0;

const fields = [{ field: 'Host' }, { field: 'Port' }, { field: 'KeyColumn' }];

const field = [{ field: 'Password' }];

const model = [
    {
        value: 'binary',
        label: 'Binary'
    },
    {
        value: 'hash',
        label: 'Hash'
    }
];

const readMode = [
    {
        value: 'key',
        label: 'Key'
    },
    {
        value: 'pattern',
        label: 'Pattern'
    }
];
const RedisStorage = ({ inputValues, handleInputChange, openModal, ableToEdit }) => {
    return (
        <>
            <ReadTextFields
                fields={fields}
                openModal={openModal}
                inputValues={inputValues}
                ableToEdit={ableToEdit}
                handleInputChange={handleInputChange}
            />
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={field}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
                hidden
            />
            <Ssl
                ableToEdit={ableToEdit}
                value={inputValues.ssl}
                handleInputChange={handleInputChange}
            />
            <SelectField
                ableToEdit={ableToEdit}
                label="jobDesigner:readConfiguration.Model"
                name="model"
                value={inputValues.model}
                handleInputChange={handleInputChange}
                menuItems={model}
                type={READWRITE}
            />
            {inputValues.operation === READ && (
                <>
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:readConfiguration.ReadMode"
                        name="readMode"
                        value={inputValues.readMode}
                        handleInputChange={handleInputChange}
                        menuItems={readMode}
                        type={READWRITE}
                    />
                    {inputValues.readMode === 'pattern' && (
                        <ReadTextFields
                            fields={[{ field: 'KeysPattern' }]}
                            openModal={openModal}
                            inputValues={inputValues}
                            ableToEdit={ableToEdit}
                            handleInputChange={handleInputChange}
                        />
                    )}
                </>
            )}
            {(inputValues.readMode === 'key' || inputValues.operation === WRITE) && (
                <ReadTextFields
                    fields={[{ field: 'Table' }]}
                    openModal={openModal}
                    inputValues={inputValues}
                    ableToEdit={ableToEdit}
                    handleInputChange={handleInputChange}
                />
            )}
            {inputValues.operation === WRITE && (
                <>
                    <NumberField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:readConfiguration.ttl"
                        name="ttl"
                        value={inputValues.ttl}
                        handleInputChange={handleInputChange}
                        type={READWRITE}
                        defaultValue={DEFAULT_TTL}
                    />
                    <WriteMode
                        disabled={!ableToEdit}
                        value={inputValues.writeMode}
                        onChange={handleInputChange}
                    />
                </>
            )}
        </>
    );
};

RedisStorage.propTypes = {
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default RedisStorage;

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
import WriteMode from '../helpers/WriteMode';
import { READ, WRITE, READWRITE } from '../../../constants';
import SelectField from '../../../../components/select-field';

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

const customFields = [{ field: 'Schema' }, { field: 'Table' }];

const fields = [{ field: 'JDBC URL' }, { field: 'User' }];

const field = [{ field: 'Password' }];

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

const Db2Storage = ({ inputValues, handleInputChange, openModal, ableToEdit }) => {
    let value = inputValues.truncateMode;
    if (!showCascade(inputValues.storage)) {
        const valueTruncateMode = truncateMode.map(v => v.value);
        if (!valueTruncateMode.includes(inputValues.truncateMode)) {
            value = 'None';
        }
    }

    return (
        <>
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={fields}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={field}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
                hidden
            />
            {inputValues.operation === READ && (
                <SelectField
                    ableToEdit={ableToEdit}
                    label="jobDesigner:readConfiguration.CustomSql"
                    name="customSql"
                    value={inputValues.customSql}
                    handleInputChange={handleInputChange}
                    menuItems={customSql}
                    type={READWRITE}
                />
            )}
            {inputValues.customSql === 'false' && (
                <ReadTextFields
                    ableToEdit={ableToEdit}
                    fields={customFields}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
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
                />
            )}
            {inputValues.operation === WRITE && (
                <>
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={customFields}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                    />
                    <WriteMode
                        disabled={!ableToEdit}
                        value={inputValues.writeMode}
                        onChange={handleInputChange}
                    />
                    {inputValues.writeMode === 'Overwrite' && (
                        <SelectField
                            ableToEdit={ableToEdit}
                            label="jobDesigner:writeConfiguration.TruncateMode"
                            name="truncateMode"
                            value={value || ''}
                            handleInputChange={handleInputChange}
                            menuItems={
                                showCascade(inputValues.storage)
                                    ? truncateModeCascade
                                    : truncateMode
                            }
                            type={READWRITE}
                        />
                    )}
                </>
            )}
            <ReadTextFields
                ableToEdit={ableToEdit}
                fields={[{ field: 'Cert Data', rows: 6 }]}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
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
    })
};

export default Db2Storage;

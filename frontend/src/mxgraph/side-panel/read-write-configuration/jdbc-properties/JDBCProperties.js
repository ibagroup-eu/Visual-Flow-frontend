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
import { READWRITE, READ, WRITE } from '../../../constants';
import ReadWriteTextFields from '../../../../components/rw-text-fields';
import NumberField from '../../../../components/number-field';
import { ParamsSwitchField } from '../../../sidebar/params/fields';

export const readingInParallelFields = [
    { field: 'partitionColumn' },
    { field: 'lowerBound' },
    { field: 'upperBound' }
];

export const writeFields = [
    { field: 'createTableOptions' },
    { field: 'createTableColumnTypes' }
];

const JDBCProperties = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    openModal
}) => {
    const { t } = useTranslation();

    return (
        <>
            {inputValues.operation === READ && (
                <ReadWriteTextFields
                    ableToEdit={ableToEdit}
                    fields={[{ field: 'sessionInitStatement' }]}
                    inputValues={inputValues}
                    handleInputChange={handleInputChange}
                    openModal={openModal}
                />
            )}
            {inputValues.operation === READ && (
                <ParamsSwitchField
                    ableToEdit={ableToEdit}
                    label={t('jobDesigner:readConfiguration.readingInParallel')}
                    name="readingInParallel"
                    value={
                        inputValues.readingInParallel === undefined
                            ? undefined
                            : inputValues.readingInParallel === 'true'
                    }
                    onChange={handleInputChange}
                    type={READWRITE}
                    defaultValue={false}
                />
            )}
            {inputValues.operation === WRITE && (
                <NumberField
                    ableToEdit={ableToEdit}
                    label="jobDesigner:readConfiguration.numPartitions"
                    name="numPartitions"
                    value={inputValues.numPartitions}
                    handleInputChange={handleInputChange}
                    type={READWRITE}
                    minValue={1}
                />
            )}
            {inputValues.readingInParallel === 'true' && (
                <>
                    {inputValues.operation === READ && (
                        <ReadWriteTextFields
                            ableToEdit={ableToEdit}
                            fields={readingInParallelFields}
                            inputValues={inputValues}
                            handleInputChange={handleInputChange}
                            openModal={openModal}
                        />
                    )}
                    <NumberField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:readConfiguration.numPartitions"
                        name="numPartitions"
                        value={inputValues.numPartitions}
                        handleInputChange={handleInputChange}
                        type={READWRITE}
                        minValue={1}
                    />
                </>
            )}
            {inputValues.operation === READ && (
                <>
                    <NumberField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:readConfiguration.fetchsize"
                        name="fetchsize"
                        value={inputValues.fetchsize}
                        handleInputChange={handleInputChange}
                        type={READWRITE}
                        minValue={0}
                    />
                    <ReadWriteTextFields
                        ableToEdit={ableToEdit}
                        fields={[{ field: 'customSchema' }]}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                    />
                </>
            )}
            {inputValues.operation === WRITE && (
                <>
                    <NumberField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:writeConfiguration.batchsize"
                        name="batchsize"
                        value={inputValues.batchsize}
                        handleInputChange={handleInputChange}
                        type={READWRITE}
                        minValue={1}
                    />
                    <ReadWriteTextFields
                        ableToEdit={ableToEdit}
                        fields={writeFields}
                        inputValues={inputValues}
                        handleInputChange={handleInputChange}
                        openModal={openModal}
                    />
                </>
            )}
        </>
    );
};

JDBCProperties.propTypes = {
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    inputValues: PropTypes.object,
    openModal: PropTypes.func
};

export default JDBCProperties;

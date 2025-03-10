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
import { READ, READWRITE } from '../../../constants';
import { ParamsSwitchField } from '../../../sidebar/params/fields';
import NumberField from '../../../../components/number-field';
import ReadWriteTextFields from '../../../../components/rw-text-fields';
import DateTimeField from '../../../../components/date-time-field';

const TableProperties = ({
    inputValues,
    handleInputChange,
    ableToEdit,
    openModal
}) => {
    const { t } = useTranslation();

    return inputValues.operation === READ ? (
        <>
            <ParamsSwitchField
                ableToEdit={ableToEdit}
                label={t('jobDesigner:readConfiguration.mergeSchema')}
                name="mergeSchema"
                value={
                    inputValues.mergeSchema === undefined
                        ? undefined
                        : inputValues.mergeSchema === 'true'
                }
                onChange={handleInputChange}
                type={READWRITE}
                defaultValue={false}
            />
            <DateTimeField
                name="timestampAsOf"
                label={t('jobDesigner:readConfiguration.timestampAsOf')}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                ableToEdit={ableToEdit}
            />
            <NumberField
                ableToEdit={ableToEdit}
                label="jobDesigner:readConfiguration.versionAsOf"
                name="versionAsOf"
                value={inputValues.versionAsOf}
                handleInputChange={handleInputChange}
                type={READWRITE}
                minValue={1}
            />
        </>
    ) : (
        <>
            <ParamsSwitchField
                ableToEdit={ableToEdit}
                label={t('jobDesigner:writeConfiguration.overwriteSchema')}
                name="overwriteSchema"
                value={
                    inputValues.overwriteSchema === undefined
                        ? undefined
                        : inputValues.overwriteSchema === 'true'
                }
                onChange={handleInputChange}
                type={READWRITE}
                defaultValue={false}
            />
            <ReadWriteTextFields
                ableToEdit={ableToEdit}
                fields={[{ field: 'replaceWhere' }]}
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                openModal={openModal}
            />
            <NumberField
                ableToEdit={ableToEdit}
                label="jobDesigner:writeConfiguration.maxRecordsPerFile"
                name="maxRecordsPerFile"
                value={inputValues.maxRecordsPerFile}
                handleInputChange={handleInputChange}
                type={READWRITE}
            />
        </>
    );
};

TableProperties.propTypes = {
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    inputValues: PropTypes.object,
    openModal: PropTypes.func
};

export default TableProperties;

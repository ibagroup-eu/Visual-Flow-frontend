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
import SelectField from '../../../../components/select-field';
import { READWRITE } from '../../../constants';

const columnType = [
    'boolean',
    'byte',
    'short',
    'integer',
    'long',
    'float',
    'double',
    'date',
    'timestamp',
    'string',
    'binary',
    'decimal'
].map(value => ({
    value,
    label: value
}));

const ChangeTypeOperation = ({ state, ableToEdit, handleInputChange }) => {
    const { t } = useTranslation();

    return (
        <SelectField
            ableToEdit={ableToEdit}
            label={t('jobDesigner:withColumnConfiguration.columnType')}
            name="option.columnType"
            value={state['option.columnType']}
            menuItems={columnType}
            handleInputChange={handleInputChange}
            type={READWRITE}
            required
        />
    );
};

ChangeTypeOperation.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    handleInputChange: PropTypes.func
};

export default ChangeTypeOperation;

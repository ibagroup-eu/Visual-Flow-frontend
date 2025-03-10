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
import { Divider, TextField } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import useStyles from './WithColumnConfiguration.Styles';
import SelectField from '../../../components/select-field';
import {
    ADD_CONSTANT,
    CHANGE_TYPE,
    DERIVE_COLUMN,
    OTHER,
    RENAME_COLUMN,
    REPLACE_VALUES,
    REPLACE_VALUES_CHAR_BY_CHAR,
    REPLACE_VALUES_USING_CONDITIONS,
    USE_CONDITIONS,
    USE_WINDOW_FUNCTION
} from '../../constants';

import DeriveColumnOperation from './derive-column-operation';
import ChangeTypeOperation from './change-type-operation';
import AddConstantOperation from './add-constant-operation';
import RenameColumnOperation from './rename-column-operation';
import UseConditionsOperation from './use-conditions-operation';
import UseWindowFunctionOperation from './use-window-function-operation';
import ReplaceValuesOperation from './replace-values-operation';
import ReplaceValuesCharByCharOperation from './replace-values-byChar-operation';

const OPERATION_TYPES = [
    {
        value: 'deriveColumn',
        label: 'deriveColumn'
    },
    {
        value: 'addConstant',
        label: 'addConstant'
    },
    {
        value: 'changeType',
        label: 'changeType'
    },
    {
        value: 'renameColumn',
        label: 'renameColumn'
    },
    {
        value: 'useConditions',
        label: 'useConditions'
    },
    {
        value: 'useWindowFunction',
        label: 'useWindowFunction'
    },
    {
        value: 'replaceValues',
        label: 'replaceValues'
    },
    {
        value: 'replaceValuesUsingConditions',
        label: 'replaceValuesUsingConditions'
    },
    {
        value: 'replaceValuesCharByChar',
        label: 'replaceValuesCharByChar'
    }
];

export const getOperationComponent = name => {
    switch (name) {
        case DERIVE_COLUMN:
            return DeriveColumnOperation;
        case ADD_CONSTANT:
            return AddConstantOperation;
        case CHANGE_TYPE:
            return ChangeTypeOperation;
        case RENAME_COLUMN:
            return RenameColumnOperation;
        case USE_CONDITIONS:
        case REPLACE_VALUES_USING_CONDITIONS:
            return UseConditionsOperation;
        case USE_WINDOW_FUNCTION:
            return UseWindowFunctionOperation;
        case REPLACE_VALUES:
            return ReplaceValuesOperation;
        case REPLACE_VALUES_CHAR_BY_CHAR:
            return ReplaceValuesCharByCharOperation;
        default:
            throw new Error(`Unsupported operation: ${name}`);
    }
};

const WithColumnConfiguration = ({ ableToEdit, state, onChange }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const renderOperationComponent = name => {
        const Comp = getOperationComponent(name);
        return (
            <Comp
                ableToEdit={ableToEdit}
                state={state}
                handleInputChange={event =>
                    onChange(event.target.name, event.target.value)
                }
            />
        );
    };

    return (
        <>
            {state.name && (
                <>
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:withColumnConfiguration.operationType"
                        name="operationType"
                        value={state.operationType}
                        handleInputChange={onChange}
                        menuItems={OPERATION_TYPES}
                        type={OTHER}
                        required
                        className={classes.operationType}
                    />
                    <Divider className={classes.divider} />
                    <TextField
                        label={t('jobDesigner:withColumnConfiguration.Column')}
                        placeholder={t('jobDesigner:withColumnConfiguration.Column')}
                        variant="outlined"
                        fullWidth
                        name="column"
                        value={state.column || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        required
                    />

                    {state.operationType &&
                        renderOperationComponent(state.operationType)}
                </>
            )}
        </>
    );
};

WithColumnConfiguration.propTypes = {
    ableToEdit: PropTypes.bool,
    state: PropTypes.object,
    onChange: PropTypes.func
};

export default WithColumnConfiguration;

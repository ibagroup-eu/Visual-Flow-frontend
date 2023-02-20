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

import { TextField } from '@material-ui/core';
import useStyles from './DropModeConfiguration.Styles';
import SelectField from '../../../../components/select-field';
import { OTHER } from '../../../constants';
import AutocompleteParameter from '../../autocomplete-parameter';
import { dropChoiceValues } from './DropModeConfiguration';
import { PairsList } from '../../property-list';
import { aggregateFunctions } from '../../groupby-configuration/GroupByConfiguration';

const fillTypes = [
    {
        value: 'custom',
        label: 'Custom'
    },
    {
        value: 'agg',
        label: 'Agg'
    }
];

const fillStrategy = [
    {
        value: 'mean',
        label: 'mean'
    },
    {
        value: 'median',
        label: 'median'
    },
    {
        value: 'mode',
        label: 'mode'
    }
];

const fillValueType = 'option.fillValueType';
const fillChoice = 'option.fillChoice';

const DEFAULT = [['', '']];

const fromState = state => {
    const fillColumns = state['option.fillColumns']?.split(',') || [];
    const fillValues = state['option.fillValues']?.split(',') || [];

    const length = Math.max(fillColumns.length, fillValues.length);

    const res = [];
    for (let i = 0; i < length; i += 1) {
        res.push([fillColumns[i], fillValues[i]]);
    }
    return res;
};

const toState = array => {
    if (array?.length > 0) {
        const [fillColumns, fillValues] = array.reduce(
            (acc, [column, value]) => {
                const [first, second] = acc;
                first.push(column);
                second.push(value);
                return acc;
            },
            [[], []]
        );
        return {
            'option.fillColumns': fillColumns.join(','),
            'option.fillValues': fillValues.join(',')
        };
    }
    return {};
};

const FillModeConfiguration = ({ state, ableToEdit, onChange, setState }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const values = fromState(state);

    const handlePairsChange = value => {
        const newState = toState(value);

        setState(
            ({
                'option.fillColumns': fillColumns,
                'option.fillValues': fillValues,
                ...prevState
            }) => ({
                ...prevState,
                ...newState
            })
        );
    };

    const renderCustomParameters = () => {
        return (
            <>
                <SelectField
                    ableToEdit={ableToEdit}
                    label={t('jobDesigner:handleNullConfiguration.fillChoice')}
                    name={fillChoice}
                    value={state[fillChoice]}
                    menuItems={dropChoiceValues}
                    handleInputChange={onChange}
                    type={OTHER}
                    defaultValue={dropChoiceValues[0].value}
                    required
                />
                {state[fillChoice] === 'all' && (
                    <TextField
                        label={t('jobDesigner:handleNullConfiguration.fillValues')}
                        placeholder={t(
                            'jobDesigner:handleNullConfiguration.fillValues'
                        )}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        name="option.fillValues"
                        value={state['option.fillValues'] || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        required
                    />
                )}
                {state[fillChoice] === 'names' && (
                    <PairsList
                        required
                        ableToEdit={ableToEdit}
                        items={values}
                        onAddItem={() => handlePairsChange(values.concat(DEFAULT))}
                        onChange={handlePairsChange}
                        label={t('jobDesigner:handleNullConfiguration.fillNulls')}
                        options={aggregateFunctions}
                    />
                )}
            </>
        );
    };

    return (
        <>
            {state.mode && (
                <>
                    <SelectField
                        ableToEdit={ableToEdit}
                        label={t(
                            'jobDesigner:handleNullConfiguration.fillValueType'
                        )}
                        name="option.fillValueType"
                        value={state[fillValueType]}
                        menuItems={fillTypes}
                        handleInputChange={onChange}
                        type={OTHER}
                        defaultValue={fillTypes[0].value}
                        required
                    />

                    {state?.[fillValueType] === 'custom' && renderCustomParameters()}
                    {state?.[fillValueType] === 'agg' && (
                        <>
                            <AutocompleteParameter
                                handleInputChange={event =>
                                    onChange(event.target.name, event.target.value)
                                }
                                ableToEdit={ableToEdit}
                                className={classes.columns}
                                id="fillColumns"
                                name="option.fillColumns"
                                state={state}
                                label={t(
                                    'jobDesigner:handleNullConfiguration.fillColumns'
                                )}
                                required
                            />
                            <SelectField
                                ableToEdit={ableToEdit}
                                label={t(
                                    'jobDesigner:handleNullConfiguration.fillStrategy'
                                )}
                                name="option.fillStrategy"
                                value={state['option.fillStrategy']}
                                menuItems={fillStrategy}
                                handleInputChange={onChange}
                                type={OTHER}
                                defaultValue={fillStrategy[0].value}
                                required
                            />
                        </>
                    )}
                </>
            )}
        </>
    );
};

FillModeConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    setState: PropTypes.func
};

export default FillModeConfiguration;

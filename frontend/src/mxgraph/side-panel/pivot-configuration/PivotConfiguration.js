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
import useStyles from './PivotConfiguration.Styles';
import SelectField from '../../../components/select-field';
import { OTHER } from '../../constants';
import ConfigurationDivider from '../../../components/divider';
import AggregationField from './aggregation-field/AggregationField';
import AutocompleteParameter from '../autocomplete-parameter/AutocompleteParameter';

const operationType = [
    {
        value: 'pivot',
        label: 'pivot'
    },
    {
        value: 'unpivot',
        label: 'unpivot'
    }
];

const unpivotFields = [
    'option.unchangedColumns',
    'option.unpivotColumns',
    'option.unpivotNames'
];

const PIVOT_DEFAULT_VALUE = 'unpivot';

const PivotConfiguration = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const handleInputChange = event =>
        onChange(event.target.name, event.target.value);

    return (
        <>
            {state.name && (
                <>
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:pivotConfiguration.operationType"
                        name="operationType"
                        value={state.operationType}
                        menuItems={operationType}
                        handleInputChange={onChange}
                        type={OTHER}
                        defaultValue={PIVOT_DEFAULT_VALUE}
                        required
                    />
                    <ConfigurationDivider />
                    {state.operationType === 'pivot' ? (
                        <>
                            <AutocompleteParameter
                                ableToEdit={ableToEdit}
                                className={classes.columns}
                                label={t(
                                    'jobDesigner:pivotConfiguration.option.groupBy'
                                )}
                                name="option.groupBy"
                                state={state}
                                handleInputChange={handleInputChange}
                                required
                            />
                            <AutocompleteParameter
                                ableToEdit={ableToEdit}
                                className={classes.columns}
                                label={t(
                                    'jobDesigner:pivotConfiguration.option.pivotColumns'
                                )}
                                name="option.pivotColumn"
                                state={state}
                                handleInputChange={handleInputChange}
                                required
                            />
                            <AggregationField
                                label={t(
                                    'jobDesigner:pivotConfiguration.option.aggregation'
                                )}
                                name="option.aggregation"
                                value={state['option.aggregation']}
                                ableToEdit={ableToEdit}
                                onChange={onChange}
                                required
                            />
                            <AutocompleteParameter
                                ableToEdit={ableToEdit}
                                className={classes.columns}
                                label={t(
                                    'jobDesigner:pivotConfiguration.option.pivotValues'
                                )}
                                name="option.pivotValues"
                                state={state}
                                handleInputChange={handleInputChange}
                            />
                        </>
                    ) : (
                        <>
                            {unpivotFields.map(field => (
                                <AutocompleteParameter
                                    key={field}
                                    className={classes.columns}
                                    ableToEdit={ableToEdit}
                                    label={t(
                                        `jobDesigner:pivotConfiguration.${field}`
                                    )}
                                    name={field}
                                    state={state}
                                    handleInputChange={handleInputChange}
                                    required
                                />
                            ))}
                        </>
                    )}
                </>
            )}
        </>
    );
};

PivotConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func
};

export default PivotConfiguration;

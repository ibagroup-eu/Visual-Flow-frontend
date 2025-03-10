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
import {
    READWRITE,
    RANK,
    DENSE_RANK,
    PERCENT_RANK,
    CUME_DIST,
    ROW_NUMBER,
    NTILE,
    LAG,
    LEAD,
    COUNT,
    SUM,
    AVG,
    MAX,
    MIN
} from '../../../constants';
import PropertyList from '../../property-list';
import {
    AggregationParameter,
    NTileParameter,
    PositionalParameter
} from './window-function-parameters';
import useStyles from './UseWindowFunctionOperation.Styles';
import AutocompleteParameter from '../../autocomplete-parameter';
import { orderBy as orderMode } from '../../remove-duplicates-configuration/RemoveDuplicatesConfiguration';

const windowFunctionValues = [
    {
        value: RANK,
        label: RANK
    },
    {
        value: DENSE_RANK,
        label: DENSE_RANK
    },
    {
        value: PERCENT_RANK,
        label: PERCENT_RANK
    },
    {
        value: CUME_DIST,
        label: CUME_DIST
    },
    {
        value: ROW_NUMBER,
        label: ROW_NUMBER
    },
    {
        value: NTILE,
        label: NTILE
    },
    {
        value: LAG,
        label: LAG
    },
    {
        value: LEAD,
        label: LEAD
    },
    {
        value: COUNT,
        label: COUNT
    },
    {
        value: SUM,
        label: SUM
    },
    {
        value: AVG,
        label: AVG
    },
    {
        value: MAX,
        label: MAX
    },
    {
        value: MIN,
        label: MIN
    }
];

export const getParameterComponent = name => {
    switch (name) {
        case COUNT:
        case SUM:
        case AVG:
        case MIN:
        case MAX:
            return AggregationParameter;
        case NTILE:
            return NTileParameter;
        case LAG:
        case LEAD:
            return PositionalParameter;
        default:
            throw new Error(`Unsupported parameter: ${name}`);
    }
};

const windowFunction = 'option.windowFunction';
const orderBy = 'option.orderBy';

const UseWindowFunctionOperation = ({ state, ableToEdit, handleInputChange }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const orderColumns = state[orderBy]?.split(',') || [];

    const handleItemChange = (index, value) =>
        handleInputChange({
            target: {
                name: orderBy,
                value: [
                    ...orderColumns.slice(0, index),
                    value,
                    ...orderColumns.slice(index + 1)
                ].join(',')
            }
        });

    const renderParameterComponent = name => {
        const Comp = getParameterComponent(name);
        return (
            <Comp
                ableToEdit={ableToEdit}
                state={state}
                handleInputChange={handleInputChange}
            />
        );
    };

    return (
        <>
            <SelectField
                ableToEdit={ableToEdit}
                label={t('jobDesigner:withColumnConfiguration.windowFunction')}
                name="option.windowFunction"
                value={state[windowFunction]}
                menuItems={windowFunctionValues}
                handleInputChange={handleInputChange}
                type={READWRITE}
                required
                className={classes.windowFunction}
            />
            {state[windowFunction] && (
                <>
                    <PropertyList
                        required={
                            ![COUNT, SUM, AVG, MAX, MIN].includes(
                                state[windowFunction]
                            )
                        }
                        ableToEdit={ableToEdit}
                        items={orderColumns}
                        defaultValue={orderMode[0].value}
                        onAddItem={() =>
                            handleInputChange({
                                target: {
                                    name: orderBy,
                                    value: orderColumns.concat(':').join(',')
                                }
                            })
                        }
                        onChange={value =>
                            handleInputChange({
                                target: {
                                    name: orderBy,
                                    value: value.join(',')
                                }
                            })
                        }
                        label={t('jobDesigner:withColumnConfiguration.orderBy')}
                        handleItemChange={handleItemChange}
                        options={orderMode}
                    />
                    <AutocompleteParameter
                        className={classes.partitionBy}
                        ableToEdit={ableToEdit}
                        id="partitionBy"
                        name="option.partitionBy"
                        handleInputChange={handleInputChange}
                        state={state}
                        label={t('jobDesigner:withColumnConfiguration.partitionBy')}
                    />
                    {state[windowFunction] &&
                        ![
                            RANK,
                            DENSE_RANK,
                            PERCENT_RANK,
                            CUME_DIST,
                            ROW_NUMBER
                        ].includes(state[windowFunction]) &&
                        renderParameterComponent(state[windowFunction])}
                </>
            )}
        </>
    );
};

UseWindowFunctionOperation.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    handleInputChange: PropTypes.func
};

export default UseWindowFunctionOperation;

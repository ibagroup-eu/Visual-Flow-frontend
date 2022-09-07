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
import { Divider } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useStyles from './SortConfiguration.Styles';
import SelectField from '../../../components/select-field';
import { OTHER, SORT_TYPES } from '../../constants';
import PropertyList from '../property-list';

const sortFunctions = [
    {
        value: 'asc',
        label: 'asc'
    },
    {
        value: 'asc_nulls_first',
        label: 'asc nulls first'
    },
    {
        value: 'asc_nulls_last',
        label: 'asc nulls last'
    },
    {
        value: 'desc',
        label: 'desc'
    },
    {
        value: 'desc_nulls_first',
        label: 'desc nulls first'
    },
    {
        value: 'desc_nulls_last',
        label: 'desc nulls last'
    }
];

const SortConfiguration = ({ ableToEdit, state, onChange }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const DEFAULT_SORT_TYPE = 'fullSort';

    const orderColumns = state.orderColumns?.split(',') || [];

    const handleItemChange = (index, value) => {
        onChange(
            'orderColumns',
            [
                ...orderColumns.slice(0, index),
                value,
                ...orderColumns.slice(index + 1)
            ].join(',')
        );
    };

    return (
        <>
            <Divider className={classes.divider} />
            {state.name && (
                <>
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:sortConfiguration.SortType"
                        name="sortType"
                        value={state.sortType}
                        handleInputChange={onChange}
                        menuItems={SORT_TYPES}
                        type={OTHER}
                        defaultValue={DEFAULT_SORT_TYPE}
                        required
                    />
                    <Divider className={classes.divider} />
                    <PropertyList
                        ableToEdit={ableToEdit}
                        items={orderColumns}
                        defaultValue={sortFunctions[0].value}
                        onAddItem={() =>
                            onChange(
                                'orderColumns',
                                orderColumns.concat(':').join(',')
                            )
                        }
                        onChange={value => onChange('orderColumns', value.join(','))}
                        label={`${t(
                            'jobDesigner:sortConfiguration.OrderColumns'
                        )} *`}
                        handleItemChange={handleItemChange}
                        options={sortFunctions}
                    />
                </>
            )}
        </>
    );
};

SortConfiguration.propTypes = {
    ableToEdit: PropTypes.bool,
    state: PropTypes.object,
    onChange: PropTypes.func
};

export default SortConfiguration;

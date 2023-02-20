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

import useStyles from './DropModeConfiguration.Styles';
import SelectField from '../../../../components/select-field';
import { OTHER } from '../../../constants';
import AutocompleteParameter from '../../autocomplete-parameter';

const dropTypeValues = [
    {
        value: 'column',
        label: 'Column'
    },
    {
        value: 'row',
        label: 'Row'
    }
];

export const dropChoiceValues = [
    {
        value: 'all',
        label: 'All'
    },
    {
        value: 'names',
        label: 'Names'
    }
];

const dropType = 'option.dropType';
const dropChoice = 'option.dropChoice';

const DropModeConfiguration = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <>
            {state.mode && (
                <>
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:handleNullConfiguration.DropType"
                        name="option.dropType"
                        value={state[dropType]}
                        menuItems={dropTypeValues}
                        handleInputChange={onChange}
                        type={OTHER}
                        defaultValue={dropTypeValues[0].value}
                        required
                    />
                    <SelectField
                        ableToEdit={ableToEdit}
                        label="jobDesigner:handleNullConfiguration.DropChoice"
                        name="option.dropChoice"
                        value={state[dropChoice]}
                        menuItems={dropChoiceValues}
                        handleInputChange={onChange}
                        type={OTHER}
                        defaultValue={dropChoiceValues[0].value}
                        required
                    />
                    {state?.[dropChoice] === 'names' && (
                        <AutocompleteParameter
                            handleInputChange={event =>
                                onChange(event.target.name, event.target.value)
                            }
                            ableToEdit={ableToEdit}
                            className={classes.columns}
                            id="dropColumns"
                            name="option.dropColumns"
                            state={state}
                            label={t(
                                'jobDesigner:handleNullConfiguration.DropColumns'
                            )}
                            required
                        />
                    )}
                </>
            )}
        </>
    );
};

DropModeConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func
};

export default DropModeConfiguration;

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
import SelectField from '../../../components/select-field';
import { OTHER } from '../../constants';

import { DropModeConfiguration, FillModeConfiguration } from './mode';
import ConfigurationDivider from '../../../components/divider';

const MODE = [
    {
        value: 'DROP',
        label: 'Drop'
    },
    {
        value: 'fill',
        label: 'Fill'
    }
];

const HandleNullConfiguration = ({ ableToEdit, state, onChange, setState }) => {
    const { t } = useTranslation();
    return (
        <>
            {state.name && (
                <>
                    <ConfigurationDivider />
                    <SelectField
                        ableToEdit={ableToEdit}
                        label={t('jobDesigner:handleNullConfiguration.Mode')}
                        name="mode"
                        value={state.mode}
                        handleInputChange={onChange}
                        defaultValue={MODE[0].value}
                        menuItems={MODE}
                        type={OTHER}
                        required
                    />

                    {state.mode === 'DROP' ? (
                        <DropModeConfiguration
                            ableToEdit={ableToEdit}
                            state={state}
                            onChange={onChange}
                        />
                    ) : (
                        <FillModeConfiguration
                            ableToEdit={ableToEdit}
                            state={state}
                            setState={setState}
                            onChange={onChange}
                        />
                    )}
                </>
            )}
        </>
    );
};

HandleNullConfiguration.propTypes = {
    ableToEdit: PropTypes.bool,
    state: PropTypes.object,
    onChange: PropTypes.func,
    setState: PropTypes.func
};

export default HandleNullConfiguration;

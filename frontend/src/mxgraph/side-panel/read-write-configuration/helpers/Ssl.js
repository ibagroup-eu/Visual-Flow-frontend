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
import SelectField from '../../../../components/select-field';
import { READWRITE } from '../../../constants';

const sslDropdown = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const Ssl = ({ ableToEdit, value, handleInputChange }) => (
    <SelectField
        ableToEdit={ableToEdit}
        label="jobDesigner:readConfiguration.SSL"
        name="ssl"
        value={value}
        handleInputChange={handleInputChange}
        menuItems={sslDropdown}
        type={READWRITE}
    />
);

Ssl.propTypes = {
    ableToEdit: PropTypes.bool,
    value: PropTypes.any,
    handleInputChange: PropTypes.func
};

export default Ssl;

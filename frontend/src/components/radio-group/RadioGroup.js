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
import {
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup as RadioGroupMU
} from '@material-ui/core';

const RadioGroup = ({ ableToEdit, name, value, onChange, radios }) => {
    return (
        <FormControl>
            <RadioGroupMU
                disabled={!ableToEdit}
                name={name}
                value={value}
                onChange={onChange}
                row
            >
                {radios.map(radioItem => (
                    <FormControlLabel
                        key={radioItem.value}
                        value={radioItem.value}
                        control={<Radio />}
                        label={radioItem.label}
                    />
                ))}
            </RadioGroupMU>
        </FormControl>
    );
};

RadioGroup.propTypes = {
    ableToEdit: PropTypes.bool,
    name: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    radios: PropTypes.arrayOf(PropTypes.object)
};

export default RadioGroup;

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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextField, MenuItem } from '@material-ui/core';
import useStyles from './CustomTextFiled.Styles';

const PATTERN = '([\\d]*)([a-zA-Z]*)';

const NAMES = {
    TEXT: 'text',
    SELECT: 'select'
};

const CustomTextField = ({
    className,
    variant,
    margin,
    selectValues,
    textLabel,
    textPlaceholder,
    selectLabel,
    selectPlaceholder,
    textType,
    disabled,
    value,
    parseFunction,
    onChange,
    name,
    defaultValue,
    inputProps,
    required,
    defaultTextValue
}) => {
    const classes = useStyles();

    const parsedValue = parseFunction(value) || [];
    const textValue = parsedValue[1] || '';
    const [selectValue, setCurrenValue] = useState(defaultValue);

    const handleOnChange = event => {
        if (event.target.name === NAMES.TEXT) {
            onChange({
                target: {
                    value: event.target.value
                        ? event.target.value + selectValue
                        : '',
                    name
                }
            });
        } else {
            onChange({
                target: { value: textValue + event.target.value, name }
            });
        }
    };

    React.useEffect(() => {
        if (!textValue && defaultTextValue) {
            const event = {
                target: {
                    name: NAMES.TEXT,
                    value: defaultTextValue
                }
            };
            handleOnChange(event);
        }
        setCurrenValue(parsedValue[2]);
    });

    return (
        <div className={classNames(classes.root, className)}>
            <TextField
                className={classNames(classes.text)}
                margin={margin}
                name={NAMES.TEXT}
                variant={variant}
                disabled={disabled}
                value={textValue}
                onChange={handleOnChange}
                label={textLabel}
                placeholder={textPlaceholder || textLabel}
                type={textType}
                inputProps={inputProps}
                required={required}
            />
            <TextField
                className={classNames(classes.select)}
                margin={margin}
                select
                disabled={disabled}
                value={selectValue}
                onChange={handleOnChange}
                name={NAMES.SELECT}
                variant={variant}
                label={selectLabel}
                placeholder={selectPlaceholder || selectLabel}
            >
                {selectValues.map(option => (
                    <MenuItem key={option.key || option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>
        </div>
    );
};

CustomTextField.defaultProps = {
    parseFunction: value => new RegExp(PATTERN, 'gi').exec(value),
    textType: 'number',
    variant: 'outlined',
    margin: 'normal'
};

CustomTextField.propTypes = {
    className: PropTypes.string,
    variant: PropTypes.string,
    margin: PropTypes.string,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    textLabel: PropTypes.string,
    textPlaceholder: PropTypes.string,
    selectLabel: PropTypes.string,
    selectPlaceholder: PropTypes.string,
    value: PropTypes.string,
    parseFunction: PropTypes.func,
    selectValues: PropTypes.arrayOf(PropTypes.object),
    textType: PropTypes.string,
    disabled: PropTypes.bool,
    inputProps: PropTypes.object,
    required: PropTypes.bool,
    defaultTextValue: PropTypes.string
};

export default CustomTextField;

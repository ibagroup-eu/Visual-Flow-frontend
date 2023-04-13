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
import { TextField, withStyles } from '@material-ui/core';

import PasswordInput from '../../../../../components/password-input';
import styles from './ValueField.Styles';

export const ValueField = ({
    value,
    secret,
    error,
    helperText,
    disabled,
    onChange
}) => {
    const { t } = useTranslation();

    const defaultTextProps = {
        disabled,
        onChange,
        error,
        helperText,
        fullWidth: true,
        required: true,
        name: 'value',
        label: t('setting:parameter.Value'),
        placeholder: t('setting:parameter.Value'),
        value: value || ''
    };

    return secret ? (
        <PasswordInput {...defaultTextProps} isTouched fromDesigner />
    ) : (
        <TextField {...defaultTextProps} variant="outlined" />
    );
};

ValueField.propTypes = {
    value: PropTypes.string,
    secret: PropTypes.bool,
    error: PropTypes.bool,
    helperText: PropTypes.string,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    t: PropTypes.func,
    classes: PropTypes.object
};

ValueField.defaultProps = {
    secret: false
};

export default withStyles(styles)(ValueField);

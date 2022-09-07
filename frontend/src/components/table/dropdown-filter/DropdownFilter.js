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
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    withStyles
} from '@material-ui/core';
import { kebabCase } from 'lodash';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from './DropdownFilter.Styles';

const DropdownFilter = ({ items, label, value, onChange, classes }) => {
    const id = kebabCase(label);
    const { t } = useTranslation();

    return (
        <FormControl className={classes.root}>
            <InputLabel id={id}>{t(`jobs:${label}`)}</InputLabel>
            <Select
                labelId={id}
                id={`${id}-select`}
                value={value}
                onChange={onChange}
            >
                <MenuItem value="">
                    <em>{t('filters:dropDown.None')}</em>
                </MenuItem>
                {items?.map(item => (
                    <MenuItem value={item.value} key={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

DropdownFilter.propTypes = {
    items: PropTypes.array,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    classes: PropTypes.object
};

export default withStyles(styles)(DropdownFilter);

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
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FormControl, MenuItem, Select } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import useStyles from './PropertySelect.Styles';

const PropertySelect = ({
    className,
    handleChange,
    placeholder,
    properties,
    isConnections
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [newProperty, setNewProperty] = React.useState('-1');

    const handleChangeSelect = event => {
        handleChange(event);
        setNewProperty('-1');
    };

    return (
        <FormControl variant="outlined">
            <Select
                onChange={handleChangeSelect}
                inputProps={{ 'aria-label': 'Without label' }}
                className={classNames(classes.selectButton, className)}
                value={newProperty}
                MenuProps={{
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                    },
                    getContentAnchorEl: null,
                    style: {
                        maxHeight: 300,
                        maxWidth: 0
                    }
                }}
            >
                <MenuItem value="-1" disabled>
                    {placeholder}
                </MenuItem>
                {properties.map(({ value, name }) => (
                    <MenuItem key={value} value={value}>
                        {isConnections
                            ? name
                            : t(`setting:parameter.tooltip.${name}`)}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

PropertySelect.propTypes = {
    className: PropTypes.string,
    handleChange: PropTypes.func,
    placeholder: PropTypes.string,
    properties: PropTypes.arrayOf(PropTypes.object),
    isConnections: PropTypes.bool
};

export default PropertySelect;

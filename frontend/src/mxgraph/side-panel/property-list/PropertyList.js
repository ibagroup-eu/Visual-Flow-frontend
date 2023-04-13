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
    Input,
    Select,
    TextField,
    withStyles
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import styles from './PropertyList.Styles';
import getMenuItems from '../helpers/getMenuItems';
import { PropertyListWrapper } from './PropertyListWrapper';

export const PropertyList = ({
    ableToEdit,
    items,
    defaultValue = '',
    onChange,
    onAddItem,
    classes,
    label,
    handleItemChange,
    options,
    required
}) => {
    const { t } = useTranslation();

    const splitItem = item => item?.split(':');

    React.useEffect(() => {
        items.forEach((item, index) => {
            const [column, aggregate] = splitItem(item);
            if (!aggregate && defaultValue) {
                handleItemChange(index, `${column}:${defaultValue}`);
            }
        });
    }, [items, defaultValue, handleItemChange]);

    const renderItem = (item, index) => {
        const [column, aggregate] = splitItem(item);
        return (
            <>
                <FormControl className={classes.formControl}>
                    <Select
                        disabled={!ableToEdit}
                        value={aggregate}
                        className={classes.orderColumn}
                        onChange={event =>
                            handleItemChange(
                                index,
                                `${column}:${event.target.value}`
                            )
                        }
                        required
                        input={<Input />}
                    >
                        {getMenuItems(options)}
                    </Select>
                </FormControl>
                <TextField
                    disabled={!ableToEdit}
                    value={column}
                    onChange={event =>
                        handleItemChange(index, `${event.target.value}:${aggregate}`)
                    }
                    label={t('jobDesigner:Column')}
                    placeholder={t('jobDesigner:Column')}
                />
            </>
        );
    };

    return (
        <PropertyListWrapper
            ableToEdit={ableToEdit}
            items={items}
            onChange={onChange}
            onAddItem={onAddItem}
            label={label}
            classes={classes}
            required={required}
            renderItem={renderItem}
        />
    );
};

PropertyList.propTypes = {
    required: PropTypes.bool,
    ableToEdit: PropTypes.bool,
    classes: PropTypes.object,
    defaultValue: PropTypes.string,
    onChange: PropTypes.func,
    onAddItem: PropTypes.func,
    label: PropTypes.string,
    items: PropTypes.array,
    handleItemChange: PropTypes.func,
    options: PropTypes.array
};

PropertyList.defaultProps = {
    required: false
};

export default withStyles(styles)(PropertyList);

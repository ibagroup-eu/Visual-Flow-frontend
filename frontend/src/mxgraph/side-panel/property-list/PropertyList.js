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

import {
    IconButton,
    Tooltip,
    Typography,
    FormControl,
    Select,
    TextField,
    Input,
    withStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import RemoveIcon from '@material-ui/icons/Remove';
import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import styles from './PropertyList.Styles';
import getMenuItems from '../helpers/getMenuItems';

const PropertyList = ({
    ableToEdit,
    items,
    defaultValue = '',
    onChange,
    onAddItem,
    classes,
    label,
    handleItemChange,
    options
}) => {
    const { t } = useTranslation();
    const handleRemove = index => () =>
        onChange([...items.slice(0, index), ...items.slice(index + 1)]);

    const handleMove = index => () => {
        const result = [...items];
        [result[index], result[index + 1]] = [result[index + 1], result[index]];
        onChange(result);
    };

    const splitItem = item => item?.split(':');

    React.useEffect(() => {
        items.forEach((item, index) => {
            const [column, aggregate] = splitItem(item);
            if (!aggregate && defaultValue) {
                handleItemChange(index, `${column}:${defaultValue}`);
            }
        });
    }, [items]);

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

    const renderRow = (item, index) => (
        <div key={index} className={classes.row}>
            {renderItem(item, index)}
            {index < items.length - 1 && (
                <Tooltip title={t('main:tooltip.MoveDown')} arrow>
                    <IconButton
                        disabled={!ableToEdit}
                        onClick={handleMove(index)}
                        aria-label={t('main:tooltip.MoveDown')}
                        className={classes.icon}
                        size="small"
                    >
                        <ArrowDownwardIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            )}
            {index > 0 && (
                <Tooltip title={t('main:tooltip.MoveUp')} arrow>
                    <IconButton
                        disabled={!ableToEdit}
                        onClick={handleMove(index - 1)}
                        aria-label={t('main:tooltip.MoveUp')}
                        className={classes.icon}
                        size="small"
                    >
                        <ArrowUpwardIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            )}
            <Tooltip title={t('main:tooltip.Delete')} arrow>
                <IconButton
                    disabled={!ableToEdit}
                    onClick={handleRemove(index)}
                    aria-label={t('main:tooltip.Delete')}
                    className={classes.icon}
                    size="small"
                >
                    <RemoveIcon fontSize="inherit" />
                </IconButton>
            </Tooltip>
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <Typography
                    variant="body2"
                    color="textSecondary"
                    className={classes.text}
                >
                    {label}
                </Typography>
                <Tooltip title={t('main:tooltip.Add')} placement="left" arrow>
                    <IconButton disabled={!ableToEdit} onClick={onAddItem}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
            {items.map(renderRow)}
        </div>
    );
};

PropertyList.propTypes = {
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

export default withStyles(styles)(PropertyList);

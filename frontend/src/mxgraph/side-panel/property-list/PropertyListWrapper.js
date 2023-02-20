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
import { IconButton, Tooltip, Typography, withStyles } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import RemoveIcon from '@material-ui/icons/Remove';
import styles from './PropertyList.Styles';

export const PropertyListWrapper = ({
    ableToEdit,
    items,
    onChange,
    onAddItem,
    classes,
    label,
    renderItem,
    required
}) => {
    const { t } = useTranslation();
    const handleRemove = index => () =>
        onChange([...items.slice(0, index), ...items.slice(index + 1)]);

    const handleMove = index => () => {
        const result = [...items];
        [result[index], result[index + 1]] = [result[index + 1], result[index]];
        onChange(result);
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
                    variant="subtitle1"
                    color="textSecondary"
                    className={classNames(classes.text, {
                        [classes.required]: required
                    })}
                >
                    {label}
                </Typography>
                <Tooltip
                    title={!ableToEdit ? '' : t('main:tooltip.Add')}
                    placement="left"
                    arrow
                >
                    <IconButton disabled={!ableToEdit} onClick={onAddItem}>
                        <AddIcon />
                    </IconButton>
                </Tooltip>
            </div>
            <div className={classes.rows}>{items.map(renderRow)}</div>
        </div>
    );
};

PropertyListWrapper.propTypes = {
    required: PropTypes.bool,
    ableToEdit: PropTypes.bool,
    classes: PropTypes.object,
    onChange: PropTypes.func,
    onAddItem: PropTypes.func,
    label: PropTypes.string,
    items: PropTypes.array,
    renderItem: PropTypes.func
};

PropertyListWrapper.defaultProps = {
    required: false
};

export default withStyles(styles)(PropertyListWrapper);

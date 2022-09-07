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

import ToggleButton from '@material-ui/lab/ToggleButton';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import styles from './TableSort.Styles';

const TableSort = ({ orderColumns, order, orderBy, onRequestSort, classes }) => {
    const { t } = useTranslation();
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    const ariaLabel =
        order === 'desc' ? t('main:sorted.descending') : t('main:sorted.ascending');

    return (
        <ToggleButtonGroup exclusive className={classes.root}>
            {orderColumns.map(column => (
                <ToggleButton
                    key={column.id}
                    value={column.id}
                    selected={orderBy === column.id}
                    onClick={createSortHandler(column.id)}
                >
                    <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                    >
                        {column.name}
                        {orderBy === column.id ? (
                            <span className={classes.visuallyHidden}>
                                {ariaLabel}
                            </span>
                        ) : null}
                    </TableSortLabel>
                </ToggleButton>
            ))}
        </ToggleButtonGroup>
    );
};

TableSort.propTypes = {
    orderColumns: PropTypes.array,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    classes: PropTypes.object
};

export default withStyles(styles)(TableSort);

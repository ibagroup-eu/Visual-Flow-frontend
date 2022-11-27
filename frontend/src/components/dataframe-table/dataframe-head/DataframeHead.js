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

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, TableCell, TableHead, TableRow } from '@material-ui/core';
import useStyles from './DataframeHead.Styles';
import DataframeColumnCell from '../dataframe-column-cell/DataframeColumnCell';

const DataframeHead = ({
    columns,
    handleSelectAllClick,
    rowsLength,
    selectedLength,
    order,
    orderBy,
    onSetRename,
    onDeleteColumn,
    handleRequestSort,
    isVisibled,
    setInvisibled,
    editable
}) => {
    const classes = useStyles();
    const lastColumnRef = useRef(null);

    useEffect(
        () =>
            lastColumnRef?.current?.scrollIntoView({
                behavior: 'smooth',
                inline: 'end'
            }),
        [columns.length]
    );

    return (
        <TableHead>
            <TableRow>
                <TableCell className={classes.checkBoxCell}>
                    <Checkbox
                        className={classes.checkbox}
                        disabled={rowsLength === 0 || !editable}
                        indeterminate={
                            selectedLength > 0 && selectedLength < rowsLength
                        }
                        checked={rowsLength > 0 && selectedLength === rowsLength}
                        onChange={handleSelectAllClick}
                    />
                </TableCell>
                {columns.map((item, index) => {
                    return (
                        <DataframeColumnCell
                            key={item.column}
                            name={item.column}
                            index={index}
                            onSetRename={onSetRename}
                            onDelete={onDeleteColumn}
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={handleRequestSort}
                            isVisibled={isVisibled}
                            setInvisibled={setInvisibled}
                            editable={editable}
                        />
                    );
                })}
                <TableCell className={classes.emptyCell} ref={lastColumnRef} />
            </TableRow>
        </TableHead>
    );
};

DataframeHead.propTypes = {
    columns: PropTypes.array,
    handleSelectAllClick: PropTypes.func,
    rowsLength: PropTypes.number,
    selectedLength: PropTypes.number,
    order: PropTypes.string,
    orderBy: PropTypes.number,
    onSetRename: PropTypes.func,
    onDeleteColumn: PropTypes.func,
    handleRequestSort: PropTypes.func,
    isVisibled: PropTypes.func,
    setInvisibled: PropTypes.func,
    editable: PropTypes.bool
};

export default DataframeHead;

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
import { Checkbox, TableBody, TableCell, TableRow } from '@material-ui/core';
import { debounce, map } from 'lodash';
import useStyles from './DataframeBody.Styles';
import DataframeRowCell from '../dataframe-row-cell/DataframeRowCell';

const DataframeBody = ({
    rows,
    columns,
    page,
    rowsPerPage,
    scrollTop,
    changeField,
    isSelected,
    onSelect,
    isVisibled,
    editable
}) => {
    const classes = useStyles();
    const lastRowRef = useRef(null);
    const beforeLastRowRef = useRef(null);

    const pageRows = rows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const emptyRows =
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    useEffect(() => {
        if (rows.length === pageRows.length + page * rowsPerPage) {
            if (scrollTop > lastRowRef?.current?.offsetTop) {
                beforeLastRowRef?.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                lastRowRef?.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }
    }, [rows.length, pageRows.length, page, rowsPerPage, scrollTop]);

    const onDebounce = (rowId, columnIndex) => newValue =>
        changeField(newValue, rowId, columnIndex);

    return (
        <TableBody>
            {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                    <TableRow
                        ref={
                            (pageRows.length - 1 === index ? lastRowRef : null) ||
                            (pageRows.length - 2 === index ? beforeLastRowRef : null)
                        }
                        hover={editable}
                        key={row.rowId}
                        selected={isSelected(row.rowId)}
                    >
                        <TableCell className={classes.checkBoxCell}>
                            <Checkbox
                                disabled={!editable}
                                onClick={() => onSelect(row.rowId)}
                                checked={isSelected(row.rowId)}
                            />
                        </TableCell>
                        {map(columns, (item, columnIndex) => (
                            <DataframeRowCell
                                padding="none"
                                editable={editable}
                                key={row.rowId + item.column}
                                rowFieldValue={row.data[columnIndex]}
                                onChange={debounce(
                                    onDebounce(row.rowId, columnIndex),
                                    50
                                )}
                                isVisibled={isVisibled(item.column)}
                            />
                        ))}
                        <TableCell className={classes.emptyCell} />
                    </TableRow>
                ))}
            <TableRow
                style={{
                    height: emptyRows > 0 ? 52 * emptyRows : 0
                }}
            />
        </TableBody>
    );
};

DataframeBody.propTypes = {
    rows: PropTypes.array,
    columns: PropTypes.array,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    scrollTop: PropTypes.number,
    changeField: PropTypes.func,
    isSelected: PropTypes.func,
    onSelect: PropTypes.func,
    isVisibled: PropTypes.func,
    editable: PropTypes.bool
};

export default DataframeBody;

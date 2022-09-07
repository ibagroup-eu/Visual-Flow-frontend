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
import { uniqueId } from 'lodash';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    Box,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell
} from '@material-ui/core';
import useStyles from '../CronModal.Styles';

export const helperTable = [
    { sign: '*', description: 'any value' },
    { sign: ',', description: 'separator or value list' },
    { sign: '-', description: 'range of values' },
    { sign: '/', description: 'step values' }
];

const HelperTable = ({ isUseCron }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const cellTextClass = isUseCron ? classes.activeCell : classes.disabledColor;

    return (
        <Box boxShadow={2} className={classes.tableBox}>
            <TableContainer>
                <Table>
                    <TableBody>
                        {helperTable.map(rowValue => (
                            <TableRow key={uniqueId()}>
                                <TableCell
                                    className={classNames(
                                        classes.cell,
                                        cellTextClass
                                    )}
                                >
                                    {rowValue.sign}
                                </TableCell>
                                <TableCell
                                    className={classNames(
                                        classes.cell,
                                        cellTextClass
                                    )}
                                >
                                    {t(rowValue.description)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

HelperTable.propTypes = {
    isUseCron: PropTypes.bool
};

export default HelperTable;

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
import { Box, Button } from '@material-ui/core';
import classNames from 'classnames';
import { AddOutlined } from '@material-ui/icons';
import useStyles from './DataframeToolbar.Styles';
import DataframeAddColumnButton from './dataframe-add-column-button/DataframeAddColumnButton';
import DataframeColumnsButton from './dataframe-columns-button/DataframeColumnsButton';

const DataframeToolbar = ({
    columns,
    addRow,
    addColumn,
    deleteDisabled,
    onDeleteRows,
    renameFieldIndex,
    onCancelRename,
    columnTypes,
    invisibled,
    setInvisibled,
    setPage,
    editable
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const isDisabledAddRowBtn = columns.length === 0 || !editable;
    const isDisabledDeleteBtn = deleteDisabled || !editable;

    return (
        <Box className={classes.root}>
            <Box>
                <DataframeAddColumnButton
                    columns={columns}
                    columnTypes={columnTypes}
                    addColumn={addColumn}
                    renameFieldIndex={renameFieldIndex}
                    onCancelRename={onCancelRename}
                    editable={editable}
                />
                <Button
                    disabled={isDisabledAddRowBtn}
                    className={classNames({ [classes.btn]: !isDisabledAddRowBtn })}
                    onClick={addRow}
                    startIcon={<AddOutlined />}
                >
                    {t('jobDesigner:Dataframe.toolbar.addRow')}
                </Button>
                <Button
                    disabled={isDisabledDeleteBtn}
                    className={classNames({ [classes.btn]: !isDisabledDeleteBtn })}
                    onClick={onDeleteRows}
                >
                    {t('jobDesigner:Dataframe.toolbar.remove')}
                </Button>
            </Box>
            <DataframeColumnsButton
                columns={columns}
                invisibled={invisibled}
                setInvisibled={setInvisibled}
                setPage={setPage}
            />
        </Box>
    );
};

DataframeToolbar.propTypes = {
    deleteDisabled: PropTypes.bool,
    addRow: PropTypes.func,
    addColumn: PropTypes.func,
    onDeleteRows: PropTypes.func,
    onCancelRename: PropTypes.func,
    renameFieldIndex: PropTypes.number,
    editable: PropTypes.bool,
    columns: PropTypes.array,
    columnTypes: PropTypes.array,
    invisibled: PropTypes.array,
    setInvisibled: PropTypes.func,
    setPage: PropTypes.func
};

export default DataframeToolbar;

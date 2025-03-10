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

import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Box } from '@material-ui/core';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { uniqueId } from 'lodash';
import useStyles from './DataframeModal.Styles';
import PopupForm from '../popup-form';
import DataframeTable from '../dataframe-table/DataframeTable';

const columnTypes = [
    'String',
    'Byte',
    'Short',
    'Integer',
    'Long',
    'Float',
    'Double',
    'Boolean',
    'Timestamp',
    'Date'
];

const toJsonString = str => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return [];
    }
};

const DataframeModal = ({
    rowsData,
    schema,
    onChange,
    display,
    onClose,
    editable
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const parsedRows = useMemo(() => {
        return toJsonString(rowsData).map(row => ({
            rowId: uniqueId(),
            data: row
        }));
    }, [rowsData]);

    const parsedColumns = useMemo(() => {
        return toJsonString(schema);
    }, [schema]);

    const [columnsState, setColumns] = useState(parsedColumns);
    const [rowsState, setRows] = useState(parsedRows);

    useEffect(() => {
        setColumns(parsedColumns);
        setRows(parsedRows);
    }, [parsedColumns, parsedRows]);

    const onSave = () => {
        onChange({
            target: {
                name: 'schema',
                value: JSON.stringify(columnsState)
            }
        });
        onChange({
            target: {
                name: 'data',
                value: JSON.stringify(rowsState.map(({ data }) => data))
            }
        });
        onClose();
    };

    const onCancel = () => {
        setColumns(parsedColumns);
        setRows(parsedRows);
        onClose();
    };

    return (
        <PopupForm
            display={display}
            title={t('jobDesigner:Dataframe.modal.title')}
            onClose={onCancel}
            isNotHelper
        >
            <Box className={classes.modalWrapper}>
                <DataframeTable
                    columns={columnsState}
                    rows={rowsState}
                    columnTypes={columnTypes}
                    editable={editable}
                    setRows={setRows}
                    setColumns={setColumns}
                />
                <Box className={classes.buttonsGroup}>
                    {editable && (
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            disabled={
                                rowsState.length === 0 || columnsState.length === 0
                            }
                            onClick={onSave}
                        >
                            {t('main:button.Save')}
                        </Button>
                    )}

                    <Button
                        className={classNames(classes.button, classes.cancelBtn)}
                        variant="contained"
                        onClick={onCancel}
                    >
                        {t('main:button.Cancel')}
                    </Button>
                </Box>
            </Box>
        </PopupForm>
    );
};

DataframeModal.propTypes = {
    rowsData: PropTypes.string,
    schema: PropTypes.string,
    onChange: PropTypes.func,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    editable: PropTypes.bool
};

export default DataframeModal;

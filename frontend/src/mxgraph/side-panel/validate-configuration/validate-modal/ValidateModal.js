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

import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Button,
    Box,
    TableContainer,
    Paper,
    Table,
    TableBody,
    TableRow
} from '@material-ui/core';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { isEqual } from 'lodash';
import useStyles from './ValidateModal.Styles';
import PopupForm from '../../../../components/popup-form';
import ValidateModalToolbar from './validate-modal-toolbar/ValidateModalToolbar';
import ValidateModalRow from './validate-modal-row/ValidateModalRow';

const toJsonString = str => {
    try {
        return JSON.parse(str);
    } catch (e) {
        return [];
    }
};

const ValidateModal = ({ validateConfig, onChange, display, onClose, editable }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const parsedValidateConfig = useMemo(
        () =>
            toJsonString(validateConfig).map(item => ({
                ...item,
                id: item.column,
                validations: toJsonString(item.validations)
            })),
        [validateConfig]
    );
    const [validationState, setValidationState] = useState(parsedValidateConfig);
    const [renameIndex, setRenameIndex] = useState(null);
    const lastRowRef = useRef(null);

    useEffect(() => {
        setValidationState(prev => {
            if (!isEqual(parsedValidateConfig, prev)) {
                return parsedValidateConfig;
            }
            return prev;
        });
    }, [validateConfig, parsedValidateConfig]);

    useEffect(() => {
        lastRowRef?.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }, [validationState.length]);

    const onSave = () => {
        onChange(
            'validateConfig',
            JSON.stringify(
                validationState.map(({ id, ...data }) => ({
                    ...data,
                    validations: JSON.stringify(data.validations)
                }))
            )
        );
        onClose();
    };

    const onCancel = () => {
        onClose();
        if (!isEqual(parsedValidateConfig, validationState)) {
            setValidationState(parsedValidateConfig);
        }
    };

    const addColumn = name => {
        if (renameIndex !== null) {
            const newData = [...validationState];
            newData[renameIndex] = {
                ...newData[renameIndex],
                column: name
            };
            setValidationState(newData);
        } else {
            setValidationState([
                ...validationState,
                { column: name, validations: [], id: name + uuid() }
            ]);
        }
    };

    const deleteColumn = columnIndex =>
        setValidationState(
            validationState.filter((item, index) => index !== columnIndex)
        );

    const addValidation = (columnIndex, data, changeIndex) => {
        if (changeIndex !== null) {
            const newData = [...validationState];
            newData[columnIndex].validations[changeIndex] = data;
            setValidationState(newData);
        } else {
            const newData = [...validationState];
            newData[columnIndex].validations.push(data);
            setValidationState(newData);
        }
    };

    const deleteValidation = (columnIndex, validationIndex) => {
        const newData = [...validationState];
        newData[columnIndex].validations = newData[columnIndex].validations.filter(
            (item, itemIndex) => itemIndex !== validationIndex
        );
        setValidationState(newData);
    };

    const cancelRename = () => setRenameIndex(null);

    return (
        <PopupForm
            display={display}
            title={
                parsedValidateConfig.length === 0
                    ? t('jobDesigner:Validate.modal.addValidation')
                    : t('jobDesigner:Validate.modal.editValidation')
            }
            onClose={onCancel}
            isNotHelper
        >
            <Box className={classes.modalWrapper}>
                <TableContainer className={classes.columnsList} component={Paper}>
                    <Table stickyHeader>
                        <ValidateModalToolbar
                            validationState={validationState}
                            addColumn={addColumn}
                            editable={editable}
                            renameColumnIndex={renameIndex}
                            cancelRename={cancelRename}
                        />
                        <TableBody>
                            {validationState.map((item, index) => (
                                <TableRow ref={lastRowRef} key={item.id}>
                                    <ValidateModalRow
                                        addValidation={(data, changeIndex) =>
                                            addValidation(index, data, changeIndex)
                                        }
                                        deleteValidation={validationIndex =>
                                            deleteValidation(index, validationIndex)
                                        }
                                        onSetRename={() => setRenameIndex(index)}
                                        onDeleteColumn={() => deleteColumn(index)}
                                        editable={editable}
                                        expand={
                                            display && (index === 0 || index === 1)
                                        }
                                        rowData={item}
                                    />
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box className={classes.buttonsGroup}>
                    {editable && (
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            onClick={onSave}
                            disabled={validationState.length === 0}
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

ValidateModal.propTypes = {
    validateConfig: PropTypes.string,
    onChange: PropTypes.func,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    editable: PropTypes.bool
};

export default ValidateModal;

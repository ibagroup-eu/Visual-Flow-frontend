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

import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    IconButton,
    MenuItem,
    Popover,
    TextField
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { AddOutlined } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import classNames from 'classnames';
import { isEqual } from 'lodash';
import useStyles from './ValidateAddValidationButton.Styles';

export const validationType = [
    'dataType',
    'minValue',
    'maxValue',
    'minLength',
    'maxLength',
    'notNull',
    'inValues',
    'regex',
    'uniqueness'
];

const dataTypeValues = [
    'string',
    'boolean',
    'byte',
    'short',
    'integer',
    'long',
    'float',
    'double',
    'date',
    'timestamp',
    'binary',
    'decimal'
];

export const validationTypeWithoutField = ['notNull', 'uniqueness'];

// eslint-disable-next-line complexity
const ValidateAddValidationButton = ({
    addValidation,
    changeValidationIndex,
    cancelChangeValidation,
    editable,
    validations
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [validation, setValidation] = useState({});
    const buttonRef = useRef(null);
    const withoutField = validationTypeWithoutField.some(
        type => type === validation.type
    );
    const validationForChange = validations.find(
        (item, itemIndex) => itemIndex === changeValidationIndex
    );
    const saveDisabled =
        isEqual(validationForChange, validation) ||
        (!withoutField && !validation[validation.type]);

    const onAddValidation = useCallback(
        event => {
            if (changeValidationIndex !== null) {
                setValidation(validationForChange);
            } else {
                const currentType = validationType.find(
                    item => !validations.find(({ type }) => type === item)
                );
                const currentValidation = {
                    type: currentType
                };
                if (currentType === 'dataType') {
                    // eslint-disable-next-line prefer-destructuring
                    currentValidation[currentType] = dataTypeValues[0];
                }
                setValidation(currentValidation);
            }
            setAnchorEl(event.currentTarget);
        },
        [changeValidationIndex, validationForChange, validations]
    );

    useEffect(() => {
        if (changeValidationIndex !== null) {
            onAddValidation({ currentTarget: buttonRef.current });
        }
    }, [changeValidationIndex, onAddValidation]);

    const handleClose = () => {
        setAnchorEl(null);
        cancelChangeValidation();
    };

    const handleSelectChange = event => {
        const newValidate = {
            type: event.target.value
        };

        if (newValidate.type === 'dataType') {
            // eslint-disable-next-line prefer-destructuring
            newValidate[newValidate.type] = dataTypeValues[0];
        }
        setValidation(newValidate);
    };

    const handleValudationValueChange = event =>
        setValidation({ ...validation, [validation.type]: event.target.value });

    const handleAddValidaton = () => {
        addValidation(validation, changeValidationIndex);
        setAnchorEl(null);
        cancelChangeValidation();
    };

    const onInputValues = event => {
        if (
            validation.type !== 'regex' &&
            !/^\d+$/.test(event.key) &&
            event.key !== 'Backspace'
        ) {
            event.preventDefault();
        }
    };

    return (
        <>
            <IconButton
                ref={buttonRef}
                color="secondary"
                className={classes.addValidate}
                onClick={onAddValidation}
                disabled={!editable || validations.length === validationType.length}
            >
                <AddOutlined className={classes.addValidateIcon} />
            </IconButton>
            <Popover
                id="add-column"
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                }}
            >
                <Box className={classes.addValidationMenu}>
                    <Box className={classes.typeBox}>
                        <TextField
                            variant="outlined"
                            size="small"
                            disabled={!!validationForChange || !anchorEl}
                            className={classes.typeField}
                            label={t('jobDesigner:Validate.popupMenu.type')}
                            required
                            onChange={handleSelectChange}
                            value={validation.type}
                            select
                            SelectProps={{
                                MenuProps: {
                                    style: {
                                        maxHeight: 300
                                    }
                                }
                            }}
                        >
                            {validationType.map(type => (
                                <MenuItem
                                    disabled={
                                        !!validations.find(
                                            item => item.type === type
                                        )
                                    }
                                    key={type}
                                    value={type}
                                >
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                    <Box
                        className={classNames(
                            classes.valuesBox,
                            !withoutField && classes.marginBottom
                        )}
                    >
                        {validation.type === 'inValues' ? (
                            <Autocomplete
                                size="small"
                                multiple
                                fullWidth
                                freeSolo
                                autoSelect
                                disabled={!anchorEl}
                                className={classes.inValuesField}
                                options={[]}
                                value={
                                    validation[validation.type]
                                        ? validation[validation.type].split(',')
                                        : []
                                }
                                onChange={(event, value) =>
                                    handleValudationValueChange({
                                        target: { value: value?.join(',') }
                                    })
                                }
                                ChipProps={{ variant: 'outlined' }}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        autoFocus
                                        required
                                        variant="outlined"
                                        label={t(
                                            'jobDesigner:Validate.popupMenu.values'
                                        )}
                                    />
                                )}
                            />
                        ) : (
                            !withoutField && (
                                <TextField
                                    disabled={!anchorEl}
                                    autoFocus
                                    fullWidth
                                    required
                                    type={
                                        validation.type === 'regex'
                                            ? 'text'
                                            : 'number'
                                    }
                                    onKeyDown={onInputValues}
                                    select={validation.type === 'dataType'}
                                    label={validation.type}
                                    value={validation[validation.type] || ''}
                                    onChange={handleValudationValueChange}
                                    variant="outlined"
                                    size="small"
                                    SelectProps={{
                                        MenuProps: {
                                            style: {
                                                maxHeight: 300
                                            }
                                        }
                                    }}
                                >
                                    {dataTypeValues.map(value => (
                                        <MenuItem key={value} value={value}>
                                            {value}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )
                        )}
                    </Box>
                    <Button
                        disabled={saveDisabled || !anchorEl}
                        variant="outlined"
                        onClick={handleAddValidaton}
                    >
                        {t('jobDesigner:Validate.popupMenu.ok')}
                    </Button>
                </Box>
            </Popover>
        </>
    );
};

ValidateAddValidationButton.propTypes = {
    addValidation: PropTypes.func,
    changeValidationIndex: PropTypes.number,
    cancelChangeValidation: PropTypes.func,
    editable: PropTypes.bool,
    validations: PropTypes.array
};

export default ValidateAddValidationButton;

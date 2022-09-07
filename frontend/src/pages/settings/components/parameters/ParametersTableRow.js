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
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { IconButton, TableCell, TableRow, TextField } from '@material-ui/core';
import { DeleteOutline } from '@material-ui/icons';

import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PasswordInput from '../../../../components/password-input';

import useStyles from './ParametersTableRow.Styles';
import toggleConfirmationWindow from '../../../../redux/actions/modalsActions';

const MESSAGES = {
    KEY_DUPLICATION: 'main:validation.projectParameters.keyDuplication',
    VALUE_DUPLICATION: 'main:validation.projectParameters.valueDuplication',
    KEY_LENGTH: 'main:validation.projectParameters.keyLength',
    KEY_SYMBOLS: 'main:validation.projectParameters.keySymbols',
    KEY_START_END: 'main:validation.projectParameters.keyStartEnd',
    VALUE_EMPTY: 'main:validation.projectParameters.valueEmpty'
};

const ParametersTableRow = ({
    editMode,
    handleRemoveParameter,
    handleChangeParameter,
    parameter: { key, value, secret, id },
    confirmationWindow,
    isErrorParameter,
    parameters
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [keyError, setKeyError] = React.useState({
        error: false,
        helperText: ''
    });
    const [valueError, setValueError] = React.useState({
        error: false,
        helperText: ''
    });
    const [isKeyTouched, setIsKeyTouched] = React.useState(false);
    const [isValueTouched, setIsValueTouched] = React.useState(false);

    const validateKey = changeKey => {
        if (changeKey.length > 50 || changeKey === '') {
            keyError.helperText !== t(MESSAGES.KEY_LENGTH) &&
                setKeyError({
                    error: true,
                    helperText: t(MESSAGES.KEY_LENGTH)
                });
        } else if (changeKey.search(/^[-A-Za-z0-9_]*?$/)) {
            keyError.helperText !== t(MESSAGES.KEY_SYMBOLS) &&
                setKeyError({
                    error: true,
                    helperText: t(MESSAGES.KEY_SYMBOLS)
                });
        } else if (changeKey.search(/^([A-Za-z0-9][-A-Za-z0-9_]*)?[A-Za-z0-9]$/)) {
            keyError.helperText !== t(MESSAGES.KEY_START_END) &&
                setKeyError({
                    error: true,
                    helperText: t(MESSAGES.KEY_START_END)
                });
        } else if (keyError.error) {
            setKeyError({
                error: false,
                helperText: ''
            });
        }
    };

    const validateValue = changeValue => {
        if (!changeValue.trim()) {
            setValueError({
                error: true,
                helperText: t(MESSAGES.VALUE_EMPTY)
            });
        } else if (valueError.error || valueError.helperText) {
            setValueError({ error: false, helperText: '' });
        }
    };

    const keyTouch = () => !isKeyTouched && setIsKeyTouched(true);
    const valueTouch = () => !isValueTouched && setIsValueTouched(true);

    React.useEffect(() => {
        const validateParams = parameters.filter(par => par.id !== id);

        if (validateParams.find(par => par.key === key) && key) {
            if (keyError.helperText !== t(MESSAGES.KEY_DUPLICATION)) {
                keyTouch();
                setKeyError({
                    error: true,
                    helperText: t(MESSAGES.KEY_DUPLICATION)
                });
            }
        } else if (keyError.helperText === t(MESSAGES.KEY_DUPLICATION)) {
            validateKey(key);
        }

        if (validateParams.find(par => par.value === value) && value) {
            if (valueError.helperText !== t(MESSAGES.VALUE_DUPLICATION)) {
                valueTouch();
                setValueError({
                    error: false,
                    helperText: t(MESSAGES.VALUE_DUPLICATION)
                });
            }
        } else if (valueError.helperText === t(MESSAGES.VALUE_DUPLICATION)) {
            validateValue(value);
        }
    }, [parameters]);

    React.useEffect(() => {
        !key &&
            setKeyError({
                error: true,
                helperText: t(MESSAGES.KEY_LENGTH)
            });

        !value &&
            setValueError({
                error: true,
                helperText: t(MESSAGES.VALUE_EMPTY)
            });
    }, []);

    React.useEffect(() => {
        isErrorParameter(keyError.error || valueError.error, id);
    }, [keyError, valueError]);

    const inputValueProps = () => ({
        disabled: !editMode,
        onChange: event => {
            handleChangeParameter(event, id, 'value');
            valueTouch();
            validateValue(event.target.value);
        },
        fullWidth: true,
        placeholder: t('setting:parameter.Value'),
        error: isValueTouched && valueError.error,
        helperText: isValueTouched && editMode && valueError.helperText,
        onBlur: valueTouch,
        value
    });

    return (
        <TableRow>
            <TableCell className={classNames(classes.cell, classes.keyCell)}>
                <TextField
                    disabled={!editMode}
                    variant="outlined"
                    value={key}
                    onChange={event => {
                        handleChangeParameter(event, id, 'key');
                        keyTouch();
                        validateKey(event.target.value);
                    }}
                    placeholder={t('setting:parameter.Name')}
                    error={isKeyTouched && keyError.error}
                    helperText={isKeyTouched && keyError.helperText}
                    onBlur={keyTouch}
                />
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.valueCell)}>
                {secret ? (
                    <PasswordInput
                        {...inputValueProps()}
                        isTouched={isValueTouched}
                    />
                ) : (
                    <TextField {...inputValueProps()} variant="outlined" />
                )}
            </TableCell>
            <TableCell className={classes.cell}>
                <IconButton
                    className={classNames({
                        [classes.hidden]: !editMode
                    })}
                    onClick={() =>
                        confirmationWindow({
                            body: `${t('main:confirm.sure')} '${key}'?`,
                            callback: () => handleRemoveParameter(id)
                        })
                    }
                >
                    <DeleteOutline color="action" />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};

ParametersTableRow.propTypes = {
    editMode: PropTypes.bool,
    index: PropTypes.number,
    parameter: PropTypes.object,
    handleRemoveParameter: PropTypes.func,
    handleChangeParameter: PropTypes.func,
    confirmationWindow: PropTypes.func.isRequired,
    isErrorParameter: PropTypes.func,
    parameters: PropTypes.array
};
const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default connect(null, mapDispatchToProps)(ParametersTableRow);

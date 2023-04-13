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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
    Box,
    Drawer,
    Toolbar,
    Typography,
    IconButton,
    TextField,
    withStyles,
    Divider
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { compose } from 'redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { find, isEmpty, isEqual, isNil } from 'lodash';

import styles from './ParametersPanel.Styles';
import ParametersPanelButtons from './buttons';
import toggleConfirmationWindow from '../../../../redux/actions/modalsActions';
import useParamValidation from '../validation';
import ValueField from './fields';

export const ParametersPanel = ({
    open,
    close,
    save,
    data,
    parameterTypes,
    title,
    classes,
    confirmationWindow,
    saving
}) => {
    const { t } = useTranslation();

    const [parameter, setParameter] = useState(data);

    const [validationErrors, validateParam] = useParamValidation(parameter);

    useEffect(() => {
        data && setParameter({ ...data });
        data && validateParam(data);
    }, [data, open, validateParam]);

    const updateParam = param => {
        setParameter(param);
        validateParam(param);
    };

    const handleOnTypeChange = target => {
        updateParam({
            ...parameter,
            value: target ? parameter.value : null,
            secret: find(parameterTypes, { name: target?.name })?.secret
        });
    };

    const handleOnChange = ({ target: { name, value } }) => {
        updateParam({
            ...parameter,
            [name]: value
        });
    };

    const handleOnCancel = () => {
        if (open && !isEqual(data, parameter)) {
            confirmationWindow({
                body: `${t('main:unsavedChanges.leaveWithUnsavedChanges')}`,
                callback: close
            });
        } else {
            close();
        }
    };

    const handleOnSave = () => {
        save({ ...parameter, id: parameter.id || parameter.key });
    };

    const defaultTextProps = {
        disabled: !open,
        fullWidth: true,
        required: true
    };

    return (
        <div className={classes.root}>
            <Drawer open={open} anchor="right" variant="persistent">
                <Toolbar />
                <div className={classes.content}>
                    <Box className={classes.form}>
                        <Box className={classes.header}>
                            <Typography variant="h6">
                                {t(`setting:parameter.${title}`)}
                            </Typography>
                            <IconButton
                                className={classes.leftAuto}
                                onClick={handleOnCancel}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <Box className={classes.fieldsRoot}>
                            <Box>
                                <Box className={classes.field}>
                                    <TextField
                                        {...defaultTextProps}
                                        label={t('setting:parameter.Name')}
                                        placeholder={t('setting:parameter.Name')}
                                        variant="outlined"
                                        name="key"
                                        value={parameter?.key || ''}
                                        onChange={handleOnChange}
                                        error={
                                            !isNil(parameter?.key) &&
                                            'key' in validationErrors
                                        }
                                        helperText={
                                            !isNil(parameter?.key)
                                                ? validationErrors.key
                                                : undefined
                                        }
                                    />
                                </Box>
                                <Autocomplete
                                    disabled={!open}
                                    name="type"
                                    options={parameterTypes}
                                    getOptionLabel={option => option.name || option}
                                    value={
                                        parameterTypes.find(
                                            ({ secret }) =>
                                                secret === parameter.secret
                                        ) || null
                                    }
                                    onChange={(_, value) =>
                                        handleOnTypeChange(value)
                                    }
                                    renderInput={params => (
                                        <Box className={classes.field}>
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                placeholder={t(
                                                    'setting:parameter.Type'
                                                )}
                                                label={t('setting:parameter.Type')}
                                                required
                                            />
                                        </Box>
                                    )}
                                />
                                {!isNil(parameter.secret) && (
                                    <>
                                        <Divider className={classes.divider} />
                                        <ValueField
                                            value={parameter?.value || ''}
                                            secret={parameter.secret}
                                            error={
                                                !isNil(parameter?.value) &&
                                                'value' in validationErrors
                                            }
                                            helperText={
                                                !isNil(parameter?.value)
                                                    ? validationErrors.value
                                                    : undefined
                                            }
                                            disabled={!open}
                                            onChange={handleOnChange}
                                        />
                                    </>
                                )}
                            </Box>
                            <ParametersPanelButtons
                                cancel={handleOnCancel}
                                save={handleOnSave}
                                saving={saving}
                                disabled={
                                    isEqual(parameter, data) ||
                                    !isEmpty(validationErrors) ||
                                    Object.values(parameter).some(x => isNil(x))
                                }
                            />
                        </Box>
                    </Box>
                </div>
            </Drawer>
        </div>
    );
};

ParametersPanel.propTypes = {
    open: PropTypes.bool,
    close: PropTypes.func,
    save: PropTypes.func,
    saving: PropTypes.bool,
    setPanelState: PropTypes.func,
    confirmationWindow: PropTypes.func,
    title: PropTypes.string,
    classes: PropTypes.object,
    data: PropTypes.shape({
        id: PropTypes.string,
        key: PropTypes.string,
        value: PropTypes.string,
        secret: PropTypes.bool
    }),
    parameterTypes: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string
        })
    )
};

const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default compose(
    withStyles(styles),
    connect(null, mapDispatchToProps)
)(ParametersPanel);

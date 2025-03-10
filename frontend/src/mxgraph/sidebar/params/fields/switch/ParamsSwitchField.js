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

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { isNil, noop, has } from 'lodash';

import { Switch, Typography } from '@material-ui/core';
import classNames from 'classnames';
import useStyles from './ParamsSwitchField.Styles';
import { READWRITE } from '../../../../constants';
import ConfirmationDialog from '../../../../side-panel/helpers/ConfirmationDialog';

const ParamsSwitchField = ({
    name,
    value,
    label,
    onChange,
    ableToEdit,
    connection,
    type,
    defaultValue,
    showConfirmation,
    initialValue,
    fieldsToClear
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    React.useEffect(() => {
        if (value === undefined && String(defaultValue)) {
            onChange({
                target: {
                    name,
                    value: type === READWRITE ? String(defaultValue) : defaultValue
                },
                persist: noop
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const changeHandlerConfirmation = event => {
        if (initialValue && showConfirmation && !event.target.checked) {
            setOpen(true);
        } else {
            onChange({
                target: {
                    name,
                    value:
                        type === READWRITE
                            ? String(event.target.checked)
                            : event.target.checked
                },
                persist: noop
            });
        }
    };

    const handleClose = () => setOpen(false);

    const confirmChange = () => {
        setOpen(false);
        onChange({
            target: {
                name,
                value: 'false'
            },
            persist: noop
        });

        fieldsToClear.forEach(element => {
            onChange({
                target: {
                    name: element.field,
                    value: ''
                }
            });
        });
    };

    return (
        <>
            <ConfirmationDialog
                open={open}
                title={t(
                    'jobDesigner:readConfiguration.incrementalLoadConfirmation.title'
                )}
                message={t(
                    'jobDesigner:readConfiguration.incrementalLoadConfirmation.message'
                )}
                onClose={handleClose}
                onConfirm={confirmChange}
            />
            <div
                className={classNames(
                    classes.root,
                    type === READWRITE && classes.paddings
                )}
            >
                <Typography
                    className={classNames({ [classes.disabled]: !ableToEdit })}
                    variant="subtitle1"
                    color="textSecondary"
                    display="block"
                >
                    {label}
                </Typography>
                <Switch
                    disabled={has(connection, name) || !ableToEdit}
                    color="primary"
                    onChange={event => changeHandlerConfirmation(event)}
                    checked={!isNil(value) ? value : false}
                />
            </div>
        </>
    );
};

ParamsSwitchField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.bool,
    label: PropTypes.string,
    onChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    connection: PropTypes.object,
    type: PropTypes.string,
    defaultValue: PropTypes.bool,
    showConfirmation: PropTypes.bool,
    initialValue: PropTypes.any,
    fieldsToClear: PropTypes.array
};

export default ParamsSwitchField;

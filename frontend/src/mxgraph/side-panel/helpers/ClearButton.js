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

import { isEmpty, isUndefined } from 'lodash';
import { IconButton } from '@material-ui/core';
import { Cancel } from '@material-ui/icons';

import { READWRITE } from '../../constants';

import useStyles from './ClearButton.Styles';
import ConfirmationDialog from './ConfirmationDialog';

const ClearButton = ({
    name,
    value,
    ableToEdit,
    handleInputChange,
    type,
    hide,
    showConfirm,
    fieldToClear,
    fieldToClearValue
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const handleClose = () => setOpen(false);

    const handleOpen = () => setOpen(true);

    const clearHandler = () => {
        type === READWRITE
            ? handleInputChange({
                  target: {
                      name,
                      value: ''
                  }
              })
            : handleInputChange(name, '');
    };

    const isValueEmpty = v => isEmpty(v) || isUndefined(v);

    const clearAfterConfirm = () => {
        if (fieldToClear && !isValueEmpty(fieldToClearValue)) {
            handleInputChange({
                target: {
                    name: fieldToClear,
                    value: ''
                }
            });
        }

        clearHandler();
        handleClose();
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
                onConfirm={clearAfterConfirm}
            />
            <IconButton
                className={hide ? classes.buttonHidden : classes.button}
                disabled={!(ableToEdit && Boolean(value))}
                onClick={
                    showConfirm || (fieldToClear && !isValueEmpty(fieldToClearValue))
                        ? handleOpen
                        : clearHandler
                }
            >
                <Cancel />
            </IconButton>
        </>
    );
};
ClearButton.propTypes = {
    name: PropTypes.string,
    value: PropTypes.any,
    ableToEdit: PropTypes.bool,
    handleInputChange: PropTypes.func,
    type: PropTypes.string,
    hide: PropTypes.bool,
    showConfirm: PropTypes.bool,
    fieldToClear: PropTypes.string,
    fieldToClearValue: PropTypes.any
};

export default ClearButton;

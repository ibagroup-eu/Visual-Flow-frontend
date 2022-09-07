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
import { camelCase } from 'lodash';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { TextField, InputAdornment, IconButton, Box } from '@material-ui/core';
import { Visibility, VisibilityOff, TuneOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';
import useStyles from './ReadWriteTextFields.Styles';
import ClearButton from '../../mxgraph/side-panel/helpers/ClearButton';
import { READWRITE } from '../../mxgraph/constants';

const valueIsLink = value =>
    Boolean(value) &&
    value.length > 4 &&
    value.charAt(0) === '#' &&
    value.charAt(value.length - 1) === '#';

const ReadWriteTextFields = ({
    fields,
    inputValues,
    handleInputChange,
    openModal,
    ableToEdit,
    nameWIthPoint = false,
    required,
    hidden,
    disabled
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    // eslint-disable-next-line complexity
    return fields.map(({ field, rows = 1 }) => {
        const fieldName = nameWIthPoint ? field : camelCase(field);
        const [visible, setVisibility] = React.useState(false);
        const hiddenField = visible ? <Visibility /> : <VisibilityOff />;

        return (
            <Box
                key={field}
                className={classNames(classes.fieldWrapper, {
                    [classes.multilineCross]: rows > 1
                })}
            >
                <TextField
                    label={t(
                        `jobDesigner:readConfiguration.${field.replace(
                            /[\s.]/g,
                            ''
                        )}`
                    )}
                    placeholder={t(
                        `jobDesigner:readConfiguration.${field.replace(
                            /[\s.]/g,
                            ''
                        )}`
                    )}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    multiline={rows > 1}
                    minRows={rows}
                    type={
                        !visible && hidden && !valueIsLink(inputValues[fieldName])
                            ? 'password'
                            : 'text'
                    }
                    disabled={!ableToEdit || valueIsLink(inputValues[fieldName])}
                    name={fieldName}
                    value={inputValues[fieldName] || ''}
                    onChange={handleInputChange}
                    InputProps={{
                        endAdornment: !disabled && (
                            <InputAdornment position="end">
                                {!valueIsLink(inputValues[fieldName]) && hidden ? (
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setVisibility(!visible)}
                                        className={classes.button}
                                    >
                                        {hiddenField}
                                    </IconButton>
                                ) : null}
                                <IconButton
                                    className={classNames(classes.button, {
                                        [classes.multilineButton]: rows > 1
                                    })}
                                    onClick={() => openModal(fieldName)}
                                >
                                    <TuneOutlined />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    required={required}
                />
                <ClearButton
                    name={fieldName}
                    value={inputValues[fieldName]}
                    ableToEdit={ableToEdit}
                    handleInputChange={handleInputChange}
                    type={READWRITE}
                />
            </Box>
        );
    });
};

ReadWriteTextFields.propTypes = {
    fields: PropTypes.array,
    inputValues: PropTypes.object,
    handleInputChange: PropTypes.func,
    openModal: PropTypes.func,
    ableToEdit: PropTypes.bool,
    nameWIthPoint: PropTypes.bool,
    required: PropTypes.bool,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool
};

export default ReadWriteTextFields;

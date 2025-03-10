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
import { TextField, InputAdornment, IconButton, Box } from '@material-ui/core';
import { TabOutlined } from '@material-ui/icons';
import useStyles from './FileTextField.Styles';
import { READWRITE } from '../../mxgraph/constants';
import ClearButton from '../../mxgraph/side-panel/helpers/ClearButton';

const FileTextField = ({
    required,
    name = 'path',
    value,
    handleInputChange,
    ableToEdit,
    uploadStage,
    setFile,
    clearable,
    label,
    accept
}) => {
    const classes = useStyles();

    const selectFile = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    return (
        <Box className={classes.wrapper}>
            <TextField
                label={label}
                placeholder={label}
                variant="outlined"
                margin="normal"
                fullWidth
                type="text"
                disabled={uploadStage || !ableToEdit}
                name={name}
                required={required}
                value={value || ''}
                onChange={event =>
                    setFile({
                        name: event.target.value.replace(/\..*|[\\?*|:"/]/g, '')
                    })
                }
                InputProps={{
                    endAdornment: uploadStage && (
                        <InputAdornment position="end">
                            <input
                                hidden
                                type="file"
                                id="icon-button-file"
                                accept={accept}
                                onChange={e => selectFile(e)}
                            />
                            <label htmlFor="icon-button-file">
                                <IconButton
                                    className={classes.button}
                                    disabled={!ableToEdit}
                                    component="span"
                                >
                                    <TabOutlined />
                                </IconButton>
                            </label>
                        </InputAdornment>
                    )
                }}
            />
            {clearable && (
                <ClearButton
                    name={name}
                    value={value}
                    ableToEdit={ableToEdit}
                    handleInputChange={handleInputChange}
                    type={READWRITE}
                />
            )}
        </Box>
    );
};

FileTextField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    handleInputChange: PropTypes.func,
    ableToEdit: PropTypes.bool,
    uploadStage: PropTypes.bool,
    setFile: PropTypes.func,
    required: PropTypes.bool,
    clearable: PropTypes.bool,
    label: PropTypes.string,
    accept: PropTypes.string
};

export default FileTextField;

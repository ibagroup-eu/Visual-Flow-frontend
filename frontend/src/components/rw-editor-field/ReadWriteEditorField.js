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
import { has } from 'lodash';
import { Box, IconButton } from '@material-ui/core';
import { OpenInNew } from '@material-ui/icons';
import SQLEditor from '../sql-editor';
import useStyles from './ReadWriteEditorField.Styles';

const ReadWriteEditorField = ({
    inputValues,
    name,
    placeholder,
    onChange,
    connection,
    ableToEdit,
    openModal,
    storageName,
    required
}) => {
    const classes = useStyles();
    const disabled = has(connection, name) || !ableToEdit;

    return (
        <Box className={classes.wrapper}>
            <SQLEditor
                height="9.2rem"
                placeholder={placeholder}
                value={inputValues[name] || ''}
                onChange={value => onChange({ target: { name, value } })}
                storageName={storageName}
                disabled={disabled}
                required={required}
            />
            <IconButton className={classes.button} onClick={() => openModal(name)}>
                <OpenInNew />
            </IconButton>
        </Box>
    );
};

ReadWriteEditorField.propTypes = {
    name: PropTypes.string,
    placeholder: PropTypes.string,
    inputValues: PropTypes.object,
    onChange: PropTypes.func,
    connection: PropTypes.object,
    ableToEdit: PropTypes.bool,
    openModal: PropTypes.func,
    storageName: PropTypes.string,
    required: PropTypes.bool
};

ReadWriteEditorField.defaultProps = {
    connection: {},
    storageName: 'default'
};

export default ReadWriteEditorField;

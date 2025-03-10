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
import classNames from 'classnames';
import { Box } from '@material-ui/core';
import CodeMirror from '@uiw/react-codemirror';
import { sql, MSSQL, MySQL, PostgreSQL, StandardSQL } from '@codemirror/lang-sql';
import { materialLightInit } from '@uiw/codemirror-theme-material';
import useStyles from './SQLEditor.Styles';

const dialects = {
    mysql: MySQL,
    mssql: MSSQL,
    postgresql: PostgreSQL,
    default: StandardSQL
};

const SQLEditor = ({
    height,
    placeholder,
    value,
    onChange,
    storageName,
    disabled,
    required
}) => {
    const classes = useStyles();

    return (
        <Box
            className={classNames(classes.wrapper, {
                [classes.editable]: !disabled
            })}
        >
            <CodeMirror
                height={height}
                placeholder={`${placeholder}${required ? ' *' : ''}`}
                theme={materialLightInit({
                    settings: {
                        background: '#ffffff'
                    }
                })}
                extensions={[
                    sql({
                        upperCaseKeywords: true,
                        dialect: dialects[storageName] || dialects.default
                    })
                ]}
                value={value}
                onChange={onChange}
                readOnly={disabled}
            />
        </Box>
    );
};

SQLEditor.propTypes = {
    height: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    storageName: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool
};

SQLEditor.defaultProps = {
    storageName: 'default'
};

export default SQLEditor;

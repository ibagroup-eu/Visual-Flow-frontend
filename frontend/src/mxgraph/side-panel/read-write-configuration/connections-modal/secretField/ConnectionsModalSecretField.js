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
import { IconButton, Typography, Input } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import useStyles from './ConnectionsModalSecretField.Styles';

const ConnectionsModalSecretField = ({ name, value, secret }) => {
    const classes = useStyles();
    const [visible, setVisibility] = useState(false);

    return (
        <>
            <Typography className={classes.fieldName}>{name}</Typography>
            <Input
                disabled
                disableUnderline
                fullWidth
                classes={{
                    input: classes.withoutPadding
                }}
                type={secret && !visible ? 'password' : 'text'}
                value={value}
                endAdornment={
                    secret && (
                        <IconButton
                            className={classes.withoutPadding}
                            onClick={() => setVisibility(!visible)}
                        >
                            {visible ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    )
                }
            />
        </>
    );
};

ConnectionsModalSecretField.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string,
    secret: PropTypes.bool
};

export default ConnectionsModalSecretField;

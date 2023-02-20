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
import { IconButton, Typography, ListItem, Box, Tooltip } from '@material-ui/core';
import {
    CheckCircleOutlined,
    DeleteOutlined,
    EditOutlined
} from '@material-ui/icons';
import { truncate } from 'lodash';
import useStyles from './ValidateModalRowValidation.Styles';
import { validationTypeWithoutField } from '../validate-add-validation-button/ValidateAddValidationButton';

const ValidateModalRowValidation = ({
    data,
    onChangeValidation,
    onDeleteValidation,
    editable
}) => {
    const classes = useStyles();
    const inValuesText = data[data.type]?.split(',').join(', ');

    return (
        <ListItem disableGutters className={classes.listItem}>
            <Typography variant="subtitle1" className={classes.type}>
                {data.type}
            </Typography>
            <Box className={classes.parameter}>
                {validationTypeWithoutField.some(type => type === data.type) ? (
                    <CheckCircleOutlined className={classes.iconCheck} />
                ) : (
                    <Tooltip
                        arrow
                        title={
                            data.type === 'inValues' && inValuesText.length > 30
                                ? inValuesText
                                : ''
                        }
                    >
                        <Typography variant="subtitle1">
                            {data.type === 'inValues'
                                ? truncate(inValuesText, { length: 30 })
                                : data[data.type]}
                        </Typography>
                    </Tooltip>
                )}
            </Box>
            <Box className={classes.iconsBox}>
                <IconButton
                    className={classes.icon}
                    disabled={!editable}
                    onClick={onChangeValidation}
                >
                    <EditOutlined />
                </IconButton>
                <IconButton
                    className={classes.icon}
                    disabled={!editable}
                    onClick={onDeleteValidation}
                >
                    <DeleteOutlined />
                </IconButton>
            </Box>
        </ListItem>
    );
};

ValidateModalRowValidation.propTypes = {
    data: PropTypes.object,
    onChangeValidation: PropTypes.func,
    onDeleteValidation: PropTypes.func,
    editable: PropTypes.bool
};

export default ValidateModalRowValidation;

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

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Divider, TextField, MenuItem, Box, Typography } from '@material-ui/core';
import { isEqual, pickBy } from 'lodash';
import useStyles from './EdgeConfiguration.Styles';

import SaveCancelButtons from '../buttons';

const path = [
    {
        value: 'true',
        label: 'True'
    },
    {
        value: 'false',
        label: 'False'
    }
];

const EdgeConfiguration = ({
    configuration,
    saveCell,
    setPanelDirty,
    sourceAndTarget,
    ableToEdit
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [inputValues, setInputValues] = React.useState(configuration);

    // when new current cell
    useEffect(() => {
        setInputValues(configuration);
    }, [configuration]);

    const handleInputChange = event => {
        const newValue = pickBy(
            {
                ...inputValues,
                [event.target.name]: event.target.value
            },
            value => value !== ''
        );

        setInputValues(newValue);
        setPanelDirty(!isEqual(configuration, newValue));
    };

    const cancelChanges = () => {
        setInputValues(configuration);
        setPanelDirty(false);
    };

    return (
        <Box>
            <Box>
                <Box>
                    <Typography
                        variant="body2"
                        color="textSecondary"
                        className={classes.sourceAndTarget}
                    >
                        Source and target
                    </Typography>
                    <Typography variant="body2" className={classes.source}>
                        <span className={classes.textColor}>Source: </span>
                        {sourceAndTarget?.source?.value?.attributes?.name
                            ?.nodeValue ||
                            sourceAndTarget?.source?.value?.attributes?.operation
                                ?.nodeValue}
                    </Typography>
                    <Typography variant="body2" className={classes.target}>
                        <span className={classes.textColor}>Target: </span>
                        {sourceAndTarget?.target?.value?.attributes?.name
                            ?.nodeValue ||
                            sourceAndTarget?.target?.value?.attributes?.operation
                                ?.nodeValue}
                    </Typography>
                </Box>
                <Divider />
                <TextField
                    label={t('jobDesigner:edgeConfiguration.Successpath')}
                    placeholder={t('jobDesigner:edgeConfiguration.Successpath')}
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    select
                    name="successPath"
                    value={inputValues?.successPath || ''}
                    onChange={handleInputChange}
                >
                    {path.map(option => (
                        <MenuItem key={option.label} value={option.value}>
                            {option.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <SaveCancelButtons
                ableToEdit={ableToEdit}
                saveCell={() => saveCell(inputValues)}
                cancelChanges={cancelChanges}
            />
        </Box>
    );
};

EdgeConfiguration.propTypes = {
    saveCell: PropTypes.func,
    setPanelDirty: PropTypes.func,
    configuration: PropTypes.object,
    sourceAndTarget: PropTypes.object,
    ableToEdit: PropTypes.bool
};

export default EdgeConfiguration;

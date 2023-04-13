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
import { useTranslation } from 'react-i18next';
import { TextField, IconButton, Box } from '@material-ui/core';
import { TuneOutlined } from '@material-ui/icons';
import { OTHER } from '../../constants';
import { findParamByKey } from '../../../components/helpers/PipelinesValidation';
import useStyles from './NotificationConfiguration.Styles';
import ClearButton from '../helpers/ClearButton';
import ConfigurationDivider from '../../../components/divider';

const NotificationConfiguration = ({
    state,
    ableToEdit,
    onChange,
    openModal,
    params
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    return (
        <>
            {state.name && (
                <>
                    <ConfigurationDivider />
                    <Box className={classes.wrapper}>
                        <TextField
                            disabled={!ableToEdit}
                            label={t(
                                'jobDesigner:notificationConfiguration.Addressees'
                            )}
                            placeholder={t(
                                'jobDesigner:notificationConfiguration.Addressees'
                            )}
                            variant="outlined"
                            fullWidth
                            multiline
                            name="addressees"
                            value={
                                findParamByKey(params, [state.addressees])
                                    ? state.addressees
                                    : ''
                            }
                            onChange={event =>
                                onChange(event.target.name, event.target.value)
                            }
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        className={classes.button}
                                        onClick={() => openModal('addressees')}
                                    >
                                        <TuneOutlined />
                                    </IconButton>
                                )
                            }}
                            required
                        />
                        <ClearButton
                            name="addressees"
                            value={state.addressees}
                            ableToEdit={ableToEdit}
                            handleInputChange={onChange}
                            type={OTHER}
                        />
                    </Box>
                    <TextField
                        disabled={!ableToEdit}
                        label={t('jobDesigner:notificationConfiguration.Message')}
                        placeholder={t(
                            'jobDesigner:notificationConfiguration.Message'
                        )}
                        variant="outlined"
                        fullWidth
                        multiline
                        minRows={16}
                        name="message"
                        value={state.message || ''}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        required
                    />
                </>
            )}
        </>
    );
};

NotificationConfiguration.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    openModal: PropTypes.func,
    params: PropTypes.array
};

export default NotificationConfiguration;

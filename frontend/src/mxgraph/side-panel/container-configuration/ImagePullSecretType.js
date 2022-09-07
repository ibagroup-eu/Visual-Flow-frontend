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
import { useTranslation } from 'react-i18next';
import { IconButton, TextField, Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import { TuneOutlined } from '@material-ui/icons';
import useStyles from './ContainerConfiguration.Styles';
import { IMAGE_PULL_SECRET_TYPE } from '../constants/container';
import SelectField from '../../../components/select-field';
import { OTHER } from '../../constants';
import ClearButton from '../helpers/ClearButton';
import ReadTextFields from '../../../components/rw-text-fields';

const ImagePullSecretType = ({
    ableToEdit,
    state,
    onChange,
    openModal,
    required,
    checkParam
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const field = [{ field: 'Password' }];

    return (
        <>
            <SelectField
                ableToEdit={ableToEdit}
                label="pipelineDesigner:containerConfiguration.ImagePullSecretType"
                name="imagePullSecretType"
                value={state.imagePullSecretType || ''}
                handleInputChange={onChange}
                menuItems={Object.values(IMAGE_PULL_SECRET_TYPE)}
                type={OTHER}
                defaultValue={IMAGE_PULL_SECRET_TYPE.NOT_APPLICABLE.value}
                required={required}
            />
            {state.imagePullSecretType === IMAGE_PULL_SECRET_TYPE.NEW.value && (
                <>
                    <Box className={classes.wrapper}>
                        <TextField
                            disabled={!ableToEdit}
                            label={t(
                                'pipelineDesigner:containerConfiguration.Username'
                            )}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            multiline
                            name="username"
                            value={checkParam(state.username)}
                            onChange={event =>
                                onChange(event.target.name, event.target.value)
                            }
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        className={classes.button}
                                        onClick={() => openModal('username')}
                                    >
                                        <TuneOutlined />
                                    </IconButton>
                                )
                            }}
                            required={required}
                        />
                        <ClearButton
                            name="username"
                            value={state.username}
                            ableToEdit={ableToEdit}
                            handleInputChange={onChange}
                            type={OTHER}
                        />
                    </Box>
                    <ReadTextFields
                        ableToEdit={ableToEdit}
                        fields={field}
                        inputValues={state}
                        handleInputChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        openModal={openModal}
                        hidden
                        required
                    />
                    <Box className={classes.wrapper}>
                        <TextField
                            disabled={!ableToEdit}
                            label={t(
                                'pipelineDesigner:containerConfiguration.Registry'
                            )}
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            multiline
                            name="registry"
                            value={checkParam(state.registry)}
                            onChange={event =>
                                onChange(event.target.name, event.target.value)
                            }
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        className={classes.button}
                                        onClick={() => openModal('registry')}
                                    >
                                        <TuneOutlined />
                                    </IconButton>
                                )
                            }}
                            required={required}
                        />
                        <ClearButton
                            name="registry"
                            value={state.registry}
                            ableToEdit={ableToEdit}
                            handleInputChange={onChange}
                            type={OTHER}
                        />
                    </Box>
                </>
            )}
            {state.imagePullSecretType === IMAGE_PULL_SECRET_TYPE.PROVIDED.value && (
                <Box className={classes.wrapper}>
                    <TextField
                        disabled={!ableToEdit}
                        label={t(
                            'pipelineDesigner:containerConfiguration.ImagePullSecretName'
                        )}
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        multiline
                        name="imagePullSecretName"
                        value={checkParam(state.imagePullSecretName)}
                        onChange={event =>
                            onChange(event.target.name, event.target.value)
                        }
                        InputProps={{
                            endAdornment: (
                                <IconButton
                                    className={classes.button}
                                    onClick={() => openModal('imagePullSecretName')}
                                >
                                    <TuneOutlined />
                                </IconButton>
                            )
                        }}
                        required={required}
                    />
                    <ClearButton
                        name="imagePullSecretName"
                        value={state.imagePullSecretName}
                        ableToEdit={ableToEdit}
                        handleInputChange={onChange}
                        type={OTHER}
                    />
                </Box>
            )}
        </>
    );
};

ImagePullSecretType.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    openModal: PropTypes.func,
    required: PropTypes.bool,
    checkParam: PropTypes.func
};

export default ImagePullSecretType;

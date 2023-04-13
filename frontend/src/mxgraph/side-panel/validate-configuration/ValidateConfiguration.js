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
import { Button, FormControlLabel, Switch } from '@material-ui/core';

import useStyles from './ValidateConfiguration.Styles';
import ValidateModal from './validate-modal';
import ConfigurationDivider from '../../../components/divider/ConfigurationDivider';

const ValidateConfiguration = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {state.name && (
                <>
                    <ConfigurationDivider />
                    <FormControlLabel
                        className={classes.valErrorLabel}
                        control={
                            <Switch
                                checked={
                                    state.isError ? state.isError === 'true' : true
                                }
                                value={
                                    state.isError
                                        ? String(!(state.isError === 'true'))
                                        : 'false'
                                }
                                color="primary"
                                name="isError"
                                onChange={event =>
                                    onChange(event.target.name, event.target.value)
                                }
                            />
                        }
                        label={t('jobDesigner:Validate.isError')}
                        labelPlacement="start"
                    />
                    <ValidateModal
                        validateConfig={state.validateConfig}
                        editable={ableToEdit}
                        onChange={onChange}
                        display={showModal}
                        onClose={() => setShowModal(false)}
                    />
                    <Button
                        className={classes.divider}
                        variant="outlined"
                        disabled={!ableToEdit}
                        onClick={() => setShowModal(true)}
                    >
                        {state.validateConfig
                            ? t('main:button.EditValidation')
                            : t('main:button.AddValidation')}
                    </Button>
                </>
            )}
        </>
    );
};

ValidateConfiguration.propTypes = {
    state: PropTypes.object,
    onChange: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default ValidateConfiguration;

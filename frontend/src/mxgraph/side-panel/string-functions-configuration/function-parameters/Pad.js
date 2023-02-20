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
import { TextField, Box } from '@material-ui/core';
import useStyles from './InstrLocate.Styles';
import { LPAD, RPAD } from '../constants';

const PadParameter = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    return (
        <>
            {state.function === LPAD || state.function === RPAD ? (
                <Box className={classes.field}>
                    <TextField
                        disabled={!ableToEdit}
                        label={t('jobDesigner:stringFunctionsConfiguration.Pad')}
                        placeholder={t(
                            'jobDesigner:stringFunctionsConfiguration.Pad'
                        )}
                        variant="outlined"
                        fullWidth
                        name="pad"
                        value={state['option.pad'] || ''}
                        onChange={event =>
                            onChange('option.pad', event.target.value)
                        }
                        required
                    />
                </Box>
            ) : (
                <Box className={classes.field}>
                    <TextField
                        disabled={!ableToEdit}
                        label={t(
                            'jobDesigner:stringFunctionsConfiguration.Position'
                        )}
                        placeholder={t(
                            'jobDesigner:stringFunctionsConfiguration.Position'
                        )}
                        variant="outlined"
                        fullWidth
                        name="substring"
                        value={state['option.position'] || ''}
                        onChange={event =>
                            onChange('option.position', event.target.value)
                        }
                    />
                </Box>
            )}
            <Box className={classes.field}>
                <TextField
                    disabled={!ableToEdit}
                    label={t('jobDesigner:stringFunctionsConfiguration.Length')}
                    placeholder={t(
                        'jobDesigner:stringFunctionsConfiguration.Length'
                    )}
                    variant="outlined"
                    fullWidth
                    name="length"
                    value={state['option.length'] || ''}
                    onChange={event => onChange('option.length', event.target.value)}
                    required
                />
            </Box>
        </>
    );
};

PadParameter.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func
};

export default PadParameter;

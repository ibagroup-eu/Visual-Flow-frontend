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
import { REGEXP_EXTRACT } from '../constants';
import useStyles from './InstrLocate.Styles';

const RegexpParameter = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    return (
        <>
            <Box className={classes.field}>
                <TextField
                    disabled={!ableToEdit}
                    label={t('jobDesigner:stringFunctionsConfiguration.Regex')}
                    placeholder={t('jobDesigner:stringFunctionsConfiguration.Regex')}
                    variant="outlined"
                    fullWidth
                    name="regex"
                    value={state['option.regex'] || ''}
                    onChange={event => onChange('option.regex', event.target.value)}
                    required
                />
            </Box>

            {state.function === REGEXP_EXTRACT ? (
                <TextField
                    disabled={!ableToEdit}
                    label={t('jobDesigner:stringFunctionsConfiguration.groupIndex')}
                    placeholder={t(
                        'jobDesigner:stringFunctionsConfiguration.groupIndex'
                    )}
                    variant="outlined"
                    fullWidth
                    name="groupIndex"
                    margin="normal"
                    value={state['option.groupIndex'] || ''}
                    onChange={event =>
                        onChange('option.groupIndex', event.target.value)
                    }
                    required
                />
            ) : (
                <TextField
                    disabled={!ableToEdit}
                    label={t('jobDesigner:stringFunctionsConfiguration.Limit')}
                    placeholder={t('jobDesigner:stringFunctionsConfiguration.Limit')}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    name="limit"
                    defaultValue={-1}
                    onChange={event => onChange('option.limit', event.target.value)}
                />
            )}
        </>
    );
};

RegexpParameter.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func
};

export default RegexpParameter;

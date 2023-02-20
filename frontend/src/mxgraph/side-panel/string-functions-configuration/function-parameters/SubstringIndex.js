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
import useStyles from '../StringFunctionsConfiguration.Styles';

const SubstringIndexParameter = ({ state, ableToEdit, onChange }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    return (
        <>
            <Box className={classes.sourceColumn}>
                <TextField
                    disabled={!ableToEdit}
                    label={t('jobDesigner:stringFunctionsConfiguration.Delimiter')}
                    placeholder={t(
                        'jobDesigner:stringFunctionsConfiguration.Delimiter'
                    )}
                    variant="outlined"
                    fullWidth
                    name="delimiter"
                    value={state['option.delimiter'] || ''}
                    onChange={event =>
                        onChange('option.delimiter', event.target.value)
                    }
                    required
                />
            </Box>
            <TextField
                disabled={!ableToEdit}
                label={t('jobDesigner:stringFunctionsConfiguration.Count')}
                placeholder={t('jobDesigner:stringFunctionsConfiguration.Count')}
                variant="outlined"
                fullWidth
                name="count"
                value={state['option.count'] || ''}
                onChange={event => onChange('option.count', event.target.value)}
                required
            />
        </>
    );
};

SubstringIndexParameter.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func
};

export default SubstringIndexParameter;

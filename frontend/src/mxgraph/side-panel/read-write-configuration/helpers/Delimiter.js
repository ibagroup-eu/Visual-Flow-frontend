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
import { TextField, Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import ClearButton from '../../helpers/ClearButton';
import useStyles from '../ReadWriteConfiguration.Styles';
import { READWRITE } from '../../../constants';

const Delimiter = ({ value, onChange, ableToEdit }) => {
    const classes = useStyles();
    const { t } = useTranslation();
    return (
        <Box className={classNames(classes.wrapper, classes.delimiter)}>
            <TextField
                label={t('jobDesigner:writeConfiguration.Delimiter')}
                placeholder={t('jobDesigner:writeConfiguration.Delimiter')}
                variant="outlined"
                fullWidth
                name="delimiter"
                value={value || ''}
                onChange={onChange}
            />
            <ClearButton
                name="delimiter"
                value={value}
                ableToEdit={ableToEdit}
                handleInputChange={onChange}
                type={READWRITE}
            />
        </Box>
    );
};
Delimiter.propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    ableToEdit: PropTypes.bool
};

export default Delimiter;

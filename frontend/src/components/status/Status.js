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

import { Chip, withStyles } from '@material-ui/core';
import { capitalize } from 'lodash';
import classNames from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import styles from './Status.Styles';

const Status = ({ value, classes }) => {
    const { t } = useTranslation();

    return (
        <Chip
            label={t(`main:${value}`)}
            variant="outlined"
            className={classNames(
                classes.chip,
                value && classes[`chip${capitalize(value)}`]
            )}
        />
    );
};

Status.propTypes = {
    value: PropTypes.string,
    classes: PropTypes.object
};

export default withStyles(styles)(Status);

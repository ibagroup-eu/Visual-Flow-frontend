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

import { TableCell, Typography, withStyles } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './StatusCell.Styles';
import Status from '../../../status';

const StatusCell = ({ status, hint, classes, ...rest }) => {
    const { t } = useTranslation();
    return (
        <TableCell className={classNames(classes.cell)} {...rest}>
            <Typography
                align="center"
                variant="body2"
                paragraph
                className={classes.hint}
            >
                {hint || t('jobs:Status')}
            </Typography>
            <Status value={status} />
        </TableCell>
    );
};
StatusCell.propTypes = {
    status: PropTypes.string,
    hint: PropTypes.string,
    classes: PropTypes.object
};

export default withStyles(styles, { name: 'CellStatus' })(StatusCell);

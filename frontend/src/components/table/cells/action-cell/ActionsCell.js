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

import { Box, TableCell, withStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './ActionsCell.Styles';
import ActionButton from '../../../action-button';

export const ActionsCell = ({ actions, className, classes, ...rest }) => (
    <TableCell width={1} className={classNames(classes.cell, className)} {...rest}>
        <Box className={classes.wrapper}>
            {actions.map(action => (
                <ActionButton
                    key={action.title}
                    {...action}
                    className={classes.button}
                />
            ))}
        </Box>
    </TableCell>
);

ActionsCell.propTypes = {
    actions: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string
};

export default withStyles(styles, { name: 'ActionsCell' })(ActionsCell);

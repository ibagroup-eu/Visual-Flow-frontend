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
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import useStyles from './Arrows.Styles';

const Arrows = ({ onMoveTop, onMoveDown, className }) => {
    const classes = useStyles();

    return (
        <Box className={classNames(classes.root, className)}>
            <ExpandLessIcon className={classes.arrow} onClick={onMoveTop} />
            <ExpandMoreIcon className={classes.arrow} onClick={onMoveDown} />
        </Box>
    );
};

Arrows.propTypes = {
    className: PropTypes.string,
    onMoveTop: PropTypes.func.isRequired,
    onMoveDown: PropTypes.func.isRequired
};

export default Arrows;

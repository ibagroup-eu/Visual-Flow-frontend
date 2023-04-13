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
import {
    CircularProgress,
    IconButton,
    Tooltip,
    withStyles
} from '@material-ui/core';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import styles from './ActionButton.Styles';

export const ActionButton = ({
    title,
    className,
    classes,
    disabled,
    loading,
    Icon,
    onClick
}) => {
    const Wrapper = loading ? React.Fragment : Tooltip;

    const defaultProps = loading
        ? {}
        : {
              title,
              arrow: true
          };

    return (
        <Wrapper {...defaultProps}>
            <span>
                <IconButton
                    className={classNames(classes.btn, className)}
                    disabled={disabled || loading}
                    onClick={onClick}
                >
                    {loading ? (
                        <CircularProgress className={classes.circular} size={22} />
                    ) : (
                        <Icon />
                    )}
                </IconButton>
            </span>
        </Wrapper>
    );
};

ActionButton.defaultProps = {
    loading: false
};

ActionButton.propTypes = {
    title: PropTypes.string,
    classes: PropTypes.object,
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    Icon: PropTypes.object,
    onClick: PropTypes.func,
    className: PropTypes.string
};

export default withStyles(styles)(ActionButton);

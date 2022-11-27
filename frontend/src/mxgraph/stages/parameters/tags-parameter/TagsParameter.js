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

import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import useStyles from './TagsParameter.Styles';
import makeTooltip from '../../helpers/makeTooltip';
import Parameter from '../parameter/Parameter';

const TagsParameter = ({ name, values, className }) => {
    const classes = useStyles();
    return (
        <Parameter name={name} className={classes.caption}>
            {values.slice(0, 5).map(value => (
                <Typography
                    title={value}
                    key={value}
                    variant="caption"
                    component="span"
                    className={classNames(classes.column, className)}
                >
                    {value}
                </Typography>
            ))}
            <span className={classes.dots}>
                {values.length > 5 && makeTooltip(values.join(', '), ' ...')}
            </span>
        </Parameter>
    );
};

TagsParameter.propTypes = {
    name: PropTypes.string,
    values: PropTypes.arrayOf(PropTypes.string),
    className: PropTypes.string
};

export default TagsParameter;

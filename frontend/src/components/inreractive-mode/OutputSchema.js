/* eslint-disable complexity */
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
import { isUndefined } from 'lodash';

import { Typography } from '@material-ui/core';

import { WRITE } from '../../mxgraph/constants';
import SortedTable from './SortedTable';
import { getHeader } from './helpers';

import useStyles from './InteractiveMode.Styles';

const OutputSchema = ({ operation, outputData }) => {
    const classes = useStyles();
    const { t } = useTranslation();

    if (operation === WRITE || isUndefined(outputData)) {
        return (
            <Typography className={classes.schemaWarning}>
                {t('jobDesigner:interactiveMode.noOutputSchema')}
            </Typography>
        );
    }
    return (
        <>
            <Typography style={{ marginBottom: '24px' }}>
                {t('jobDesigner:interactiveMode.outputSchema')}
            </Typography>
            <SortedTable
                className={classes.inputTable}
                headers={getHeader(outputData)}
                originalRows={outputData}
            />
        </>
    );
};

OutputSchema.propTypes = {
    operation: PropTypes.string,
    outputData: PropTypes.array
};

export default OutputSchema;

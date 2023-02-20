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
import { Box } from '@material-ui/core';
import PropTypes from 'prop-types';
import useStyles from '../job-configuration/JobConfiguration.Styles';
import SaveCancelButtons from '../../buttons';

const ConfigurationWrapper = ({
    configuration,
    ableToEdit,
    isDisabled,
    onSave,
    setPanelDirty,
    render: Component,
    state,
    setState
}) => {
    const classes = useStyles();

    const handleInputChange = (key, value) =>
        setState(prevState => ({
            ...prevState,
            [key]: value
        }));

    const cancelChanges = () => {
        setState(configuration);
        setPanelDirty(false);
    };

    return (
        <Box className={classes.root}>
            <Component
                ableToEdit={ableToEdit}
                state={state}
                onStateChange={handleInputChange}
            />
            <SaveCancelButtons
                ableToEdit={ableToEdit}
                saveCell={() => onSave(state)}
                cancelChanges={cancelChanges}
                isDisabled={isDisabled(state)}
            />
        </Box>
    );
};

ConfigurationWrapper.propTypes = {
    isDisabled: PropTypes.func,
    ableToEdit: PropTypes.bool,
    configuration: PropTypes.object,
    onSave: PropTypes.func,
    setPanelDirty: PropTypes.func,
    render: PropTypes.elementType,
    state: PropTypes.object,
    setState: PropTypes.func
};

export default ConfigurationWrapper;

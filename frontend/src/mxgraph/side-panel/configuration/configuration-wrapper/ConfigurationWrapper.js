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

import React, { useEffect } from 'react';
import { isEqual } from 'lodash';
import { Box } from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import useStyles from '../job-configuration/JobConfiguration.Styles';
import SaveCancelButtons from '../../buttons';

const ConfigurationWrapper = ({
    configuration,
    ableToEdit,
    isDisabled,
    onSave,
    setPanelDirty,
    sidePanelIsOpen,
    render: Component
}) => {
    const classes = useStyles();

    const [inputValues, setInputValues] = React.useState(configuration);

    useEffect(() => {
        setInputValues(configuration);
    }, [configuration, sidePanelIsOpen]);

    useEffect(() => {
        setPanelDirty(!isEqual(configuration, inputValues));
    }, [inputValues]);

    const handleInputChange = (key, value) =>
        setInputValues(prevState => ({
            ...prevState,
            [key]: value
        }));

    const cancelChanges = () => {
        setInputValues(configuration);
        setPanelDirty(false);
    };

    return (
        <Box className={classes.root}>
            <Component
                ableToEdit={ableToEdit}
                state={inputValues}
                onStateChange={handleInputChange}
            />
            <SaveCancelButtons
                ableToEdit={ableToEdit}
                saveCell={() => onSave(inputValues)}
                cancelChanges={cancelChanges}
                isDisabled={isDisabled(inputValues)}
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
    sidePanelIsOpen: PropTypes.bool,
    render: PropTypes.elementType
};

const mapStateToProps = state => ({
    sidePanelIsOpen: state.mxGraph.sidePanelIsOpen
});

export default connect(mapStateToProps)(ConfigurationWrapper);

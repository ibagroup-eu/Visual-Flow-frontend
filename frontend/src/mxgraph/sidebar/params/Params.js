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
import { Button } from '@material-ui/core';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { entries, get, isFunction, set, keys, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { setParams, setParamsDirty } from '../../../redux/actions/mxGraphActions';
import ParamsTextField from './ParamsTextField';
import useStyles from './Params.Styles';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';

const defaultParams = {
    NAME: '',
    DRIVER_REQUEST_CORES: 0.1,
    DRIVER_CORES: 1,
    DRIVER_MEMORY: 1,
    EXECUTOR_REQUEST_CORES: 0.1,
    EXECUTOR_CORES: 1,
    EXECUTOR_MEMORY: 1,
    EXECUTOR_INSTANCES: 2,
    SHUFFLE_PARTITIONS: 10
};

const Params = ({
    store: { fields, data },
    save,
    setDirty,
    ableToEdit,
    paramsIsDirty,
    confirmationWindow
}) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const params = { ...data.params, NAME: data.name };
    const initialState = keys(fields).reduce(
        (acc, name) => set(acc, name, get(params, name, `${defaultParams[name]}`)),
        {}
    );

    const [state, setState] = React.useState(initialState);

    const handleChange = event => {
        event.persist();
        const newValue = {
            ...state,
            [event.target.name]: event.target.value
        };
        setState(newValue);
        setDirty(!isEqual(newValue, { ...data.params, NAME: data.name }));
    };

    const isSaveBtnDisabled = () =>
        isEqual(state, { ...data.params, NAME: data.name }) ||
        entries(fields).some(
            ([key, field]) =>
                isFunction(field.validate) && field.validate(state[key])
        );

    return (
        <div className={classes.root}>
            <div className={classes.params}>
                {entries(fields).map(([key, field]) => {
                    const value = state[key];
                    return (
                        <ParamsTextField
                            ableToEdit={ableToEdit}
                            key={key}
                            name={key}
                            {...field}
                            value={value}
                            onChange={handleChange}
                        />
                    );
                })}
            </div>
            <div className={classes.buttons}>
                {ableToEdit && (
                    <>
                        <Button
                            size="large"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            onClick={() => save(state)}
                            disabled={isSaveBtnDisabled()}
                        >
                            {t('main:button.Confirm')}
                        </Button>
                        <Button
                            size="large"
                            variant="contained"
                            onClick={() => {
                                if (paramsIsDirty) {
                                    confirmationWindow({
                                        body: `${t(
                                            'main:unsavedChanges.leaveWithUnsavedChanges'
                                        )}`,
                                        callback: () => {
                                            setState(initialState);
                                            setDirty();
                                        }
                                    });
                                } else {
                                    setState(initialState);
                                    setDirty();
                                }
                            }}
                            className={classNames(classes.cancelBtn, classes.button)}
                        >
                            {t('main:button.Discard')}
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

Params.propTypes = {
    save: PropTypes.func,
    setDirty: PropTypes.func,
    store: PropTypes.object,
    ableToEdit: PropTypes.bool,
    paramsIsDirty: PropTypes.bool,
    confirmationWindow: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    store: state.mxGraph,
    paramsIsDirty: state.mxGraph.paramsIsDirty
});
const mapDispatchToProps = {
    save: setParams,
    setDirty: setParamsDirty,
    confirmationWindow: toggleConfirmationWindow
};

export default connect(mapStateToProps, mapDispatchToProps)(Params);

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

import React, { memo, useRef, useState } from 'react';
import { Button } from '@material-ui/core';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { cloneDeep, entries, get, isEqual, isFunction, set } from 'lodash';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { setParams, setParamsDirty } from '../../../redux/actions/mxGraphActions';

import useStyles from './Params.Styles';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';
import FieldFactory from './FieldFactory';

const getProperties = (fields, mapper) => {
    const names = [];

    const rec = structure => {
        entries(structure).forEach(entry => {
            const [, v] = entry;
            if (v.fields) {
                rec(v.fields);
            } else {
                const value = mapper(entry);
                names.push(value);
            }
        });
    };

    rec(fields);

    return names;
};

export const getFieldNames = fields => {
    return getProperties(fields, ([k]) => k);
};

const DEFAULT_PARAMS = {
    NAME: '',
    DRIVER_REQUEST_CORES: 0.1,
    DRIVER_CORES: 1,
    DRIVER_MEMORY: 1,
    EXECUTOR_REQUEST_CORES: 0.1,
    EXECUTOR_CORES: 1,
    EXECUTOR_MEMORY: 1,
    EXECUTOR_INSTANCES: 2,
    SHUFFLE_PARTITIONS: 10,
    EMAIL: {
        NOTIFY_FAILURE: false,
        NOTIFY_SUCCESS: false,
        RECIPIENTS: []
    },
    SLACK: {
        NOTIFY_FAILURE: false,
        NOTIFY_SUCCESS: false,
        RECIPIENTS: [],
        CHANNELS: []
    },
    TAGS: []
};

export const Params = ({
    store: { fields, data = {} } = {},
    save,
    setDirty,
    ableToEdit,
    paramsIsDirty,
    confirmationWindow
}) => {
    const classes = useStyles();
    const { t } = useTranslation();

    const ref = useRef();
    const params = {
        ...data.params,
        NAME: data.name,
        NOTIFY_FAILURE: false,
        NOTIFY_SUCCESS: false,
        RECIPIENTS: []
    };

    const initialState = getFieldNames(fields).reduce(
        (acc, name) => set(acc, name, get(params, name, get(DEFAULT_PARAMS, name))),
        {}
    );

    const [state, setState] = React.useState(initialState);
    const [errors, setErrors] = useState({});

    const validators = getProperties(fields, ([key, { validate }]) => ({
        key,
        validate
    })).filter(({ validate }) => isFunction(validate));

    const hasErrors = validators.some(({ key, validate }) => validate(state[key]));

    const handleChange = event => {
        event.persist();

        const newValue = cloneDeep(state);
        set(newValue, event.target.name, event.target.value);
        setState(newValue);

        setDirty(!isEqual(newValue, initialState));
    };

    const handleError = ({ name, value }) => {
        const newValue = cloneDeep(errors);
        set(newValue, name, value);
        setErrors(newValue);
    };

    const isSaveBtnDisabled = () => isEqual(state, initialState) || hasErrors;

    return (
        <div className={classes.root} ref={ref}>
            <div className={classes.params}>
                <FieldFactory
                    fields={fields}
                    state={state}
                    ableToEdit={ableToEdit}
                    onChange={handleChange}
                    onError={handleError}
                    errors={errors}
                    parentRef={ref}
                />
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
                                            setErrors({});
                                        }
                                    });
                                } else {
                                    setState(initialState);
                                    setDirty();
                                    setErrors({});
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

export default compose(connect(mapStateToProps, mapDispatchToProps), memo)(Params);

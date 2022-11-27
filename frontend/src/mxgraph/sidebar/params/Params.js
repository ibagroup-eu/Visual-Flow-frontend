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

import React, { useRef } from 'react';
import { Button, Fade } from '@material-ui/core';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { entries, get, isFunction, set, isEqual } from 'lodash';
import PropTypes from 'prop-types';
import { setParams, setParamsDirty } from '../../../redux/actions/mxGraphActions';

import useStyles from './Params.Styles';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';
import DividerWithText from '../../side-panel/helpers/DividerWithText';
import {
    ParamsEmailsField,
    ParamsSwitchField,
    ParamsTextField,
    ParamsChipsField
} from './fields';

const DEFAULT_PARAMS = {
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

const FIELD_COMPONENTS = {
    text: ParamsTextField,
    switch: ParamsSwitchField,
    emails: ParamsEmailsField,
    chips: ParamsChipsField
};

export const getFieldNames = fields => {
    const names = [];

    const rec = structure => {
        entries(structure).forEach(([k, v]) => {
            if (v.type === 'section') {
                rec(v.fields);
            } else {
                names.push(k);
            }
        });
    };

    rec(fields);

    return names;
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
    const params = { ...data.params, NAME: data.name };
    const ref = useRef();

    const initialState = getFieldNames(fields).reduce(
        (acc, name) => set(acc, name, get(params, name, get(DEFAULT_PARAMS, name))),
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

    const isVisible = field => !field.needs || field.needs.some(x => get(state, x));

    const getField = (key, field) => {
        const FieldComponent = get(FIELD_COMPONENTS, field.type, ParamsTextField);

        return (
            <FieldComponent
                ableToEdit={ableToEdit}
                parentRef={ref}
                key={key}
                name={key}
                {...field}
                value={state[key]}
                onChange={handleChange}
            />
        );
    };

    const getSection = (key, field) => (
        <Fade key={key} in>
            <div className={classes.section}>
                <DividerWithText>{field.label}</DividerWithText>
                <div className={classes.section}>
                    {entries(field.fields).map(
                        ([k, v]) => isVisible(v) && getField(k, v)
                    )}
                </div>
            </div>
        </Fade>
    );

    return (
        <div className={classes.root} ref={ref}>
            <div className={classes.params}>
                {entries(fields).map(([key, field]) =>
                    field.type === 'section'
                        ? isVisible(field) && getSection(key, field)
                        : isVisible(field) && getField(key, field)
                )}
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

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
import classNames from 'classnames';
import { TableCell, TableRow, TextField, Radio } from '@material-ui/core';
import useStyles from './ParametersModalRow.Styles';
import PasswordInput from '../../../../../components/password-input';

const ParametersModalRow = ({
    ableToEdit,
    paramKey,
    value,
    secret,
    selectedValue,
    setSelectedValue,
    defaultSelected
}) => {
    const { t } = useTranslation();
    const selectedRef = React.useRef(null);
    const classes = useStyles();

    React.useEffect(() => {
        if (defaultSelected) {
            selectedRef?.current?.scrollIntoView();
        }
    }, [defaultSelected]);

    const inputValueProps = parameterValue => ({
        disabled: true,
        fullWidth: true,
        placeholder: t('setting:parameter.Value'),
        value: parameterValue,
        InputProps: {
            classes: {
                disabled: classes.paper
            }
        }
    });

    return (
        <TableRow ref={defaultSelected ? selectedRef : null}>
            {(!!selectedValue || ableToEdit) && (
                <TableCell className={classes.cell}>
                    <Radio
                        disabled={!ableToEdit}
                        className={classes.radioButtonCell}
                        checked={selectedValue === paramKey}
                        onChange={event => setSelectedValue(event.target.value)}
                        value={paramKey}
                        color="secondary"
                    />
                </TableCell>
            )}
            <TableCell className={classNames(classes.cell, classes.keyCell)}>
                <TextField
                    disabled
                    fullWidth
                    variant="outlined"
                    value={paramKey}
                    placeholder={t('setting:parameter.Name')}
                    InputProps={{
                        classes: {
                            disabled: classes.paper
                        }
                    }}
                />
            </TableCell>
            <TableCell className={classNames(classes.cell, classes.valueCell)}>
                {secret ? (
                    <PasswordInput {...inputValueProps(value)} fromDesigner />
                ) : (
                    <TextField {...inputValueProps(value)} variant="outlined" />
                )}
            </TableCell>
        </TableRow>
    );
};

ParametersModalRow.propTypes = {
    ableToEdit: PropTypes.bool,
    paramKey: PropTypes.string,
    value: PropTypes.string,
    secret: PropTypes.bool,
    selectedValue: PropTypes.string,
    setSelectedValue: PropTypes.func,
    defaultSelected: PropTypes.bool
};

export default ParametersModalRow;

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
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TextField,
    Box,
    Button,
    Radio
} from '@material-ui/core';
import { connect } from 'react-redux';

import PopupForm from '../../../../components/popup-form';
import SearchInput from '../../../../components/search-input';
import PasswordInput from '../../../../components/password-input';
import { PageSkeleton } from '../../../../components/skeleton';

import useStyles from './ParametersModal.Styles';

const ParametersModal = ({
    ableToEdit,
    display,
    onClose,
    onSetValue,
    parameters,
    loading,
    currentValue
}) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { params = [] } = parameters;

    const [searchValue, setSearchValue] = React.useState('');
    const [projectParameters, setProjectParameters] = React.useState(params);
    const [selectedValue, setSelectedValue] = React.useState('');

    React.useEffect(() => {
        setProjectParameters(params);
    }, [parameters]);

    React.useEffect(() => {
        setSelectedValue(
            currentValue.length > 4 &&
                currentValue.charAt(0) === '#' &&
                currentValue.charAt(currentValue.length - 1) === '#'
                ? currentValue.slice(1, -1)
                : ''
        );
        setProjectParameters(params);
        setSearchValue('');
    }, [display]);

    const handleChangeSearch = value => {
        setSearchValue(value);
        setProjectParameters(
            params.filter(
                parameter =>
                    parameter.key.toLowerCase().indexOf(value.toLowerCase()) !== -1
            )
        );
    };

    const inputValueProps = parameterValue => ({
        disabled: true,
        fullWidth: true,
        placeholder: t('setting:parameter.Value'),
        value: parameterValue
    });

    return (
        <PopupForm
            display={display}
            onClose={onClose}
            title={t('main:form.header.Parameters')}
        >
            {loading ? (
                <PageSkeleton />
            ) : (
                <Box className={classes.wrapper}>
                    <Box
                        className={classNames(
                            classes.flex,
                            classes.spaceBetween,
                            classes.paddedBottom
                        )}
                    >
                        <SearchInput
                            value={searchValue}
                            onChange={event =>
                                handleChangeSearch(event.target.value)
                            }
                            placeholder={t('main:search')}
                        />
                    </Box>
                    <TableContainer
                        className={classes.parameterList}
                        component={Paper}
                    >
                        <Table>
                            <TableBody>
                                {projectParameters.map(({ key, value, secret }) => (
                                    <TableRow key={key}>
                                        {ableToEdit && (
                                            <TableCell className={classes.cell}>
                                                <Radio
                                                    checked={selectedValue === key}
                                                    onChange={event =>
                                                        setSelectedValue(
                                                            event.target.value
                                                        )
                                                    }
                                                    value={key}
                                                    color="primary"
                                                />
                                            </TableCell>
                                        )}
                                        <TableCell
                                            className={classNames(
                                                classes.cell,
                                                classes.keyCell
                                            )}
                                        >
                                            <TextField
                                                disabled
                                                variant="outlined"
                                                value={key}
                                                placeholder={t(
                                                    'setting:parameter.Name'
                                                )}
                                            />
                                        </TableCell>
                                        <TableCell
                                            className={classNames(
                                                classes.cell,
                                                classes.valueCell
                                            )}
                                        >
                                            {secret ? (
                                                <PasswordInput
                                                    {...inputValueProps(value)}
                                                    fromDesigner
                                                />
                                            ) : (
                                                <TextField
                                                    {...inputValueProps(value)}
                                                    variant="outlined"
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box className={classes.buttonsGroup}>
                        {ableToEdit && (
                            <Button
                                className={classes.button}
                                variant="contained"
                                color="primary"
                                onClick={() => onSetValue(selectedValue)}
                                disabled={!selectedValue}
                            >
                                {t('main:button.Confirm')}
                            </Button>
                        )}
                        <Button
                            className={classNames(classes.button, classes.cancelBtn)}
                            variant="contained"
                            onClick={onClose}
                        >
                            {t('main:button.Discard')}
                        </Button>
                    </Box>
                </Box>
            )}
        </PopupForm>
    );
};

const mapStateToProps = state => ({
    parameters: state.pages.settingsParameters.data,
    loading: state.pages.settingsParameters.loading
});

ParametersModal.propTypes = {
    ableToEdit: PropTypes.bool,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    onSetValue: PropTypes.func,
    parameters: PropTypes.object,
    loading: PropTypes.bool,
    getParameters: PropTypes.func,
    currentValue: PropTypes.string
};

export default connect(mapStateToProps)(ParametersModal);

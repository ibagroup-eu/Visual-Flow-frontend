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
import { Paper, Table, TableBody, TableContainer, Box } from '@material-ui/core';
import { connect } from 'react-redux';
import PopupForm from '../../../../components/popup-form';
import SearchInput from '../../../../components/search-input';
import { PageSkeleton } from '../../../../components/skeleton';
import useStyles from './ParametersModal.Styles';
import ModalConfirmButtons from '../connections-modal/confirmButtons/ModalConfirmButtons';
import { valueIsLink } from '../../../../components/rw-text-fields/ReadWriteTextField';
import ParametersModalRow from './parameters-modal-row/ParametersModalRow';

const ParametersModal = ({
    ableToEdit,
    display,
    onClose,
    onSetValue,
    params,
    loading,
    currentValue
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [searchValue, setSearchValue] = React.useState('');
    const [projectParameters, setProjectParameters] = React.useState(params);
    const [selectedValue, setSelectedValue] = React.useState('');
    const linkValue = valueIsLink(currentValue) ? currentValue.slice(1, -1) : '';

    React.useEffect(() => {
        setProjectParameters(params);
    }, [params]);

    React.useEffect(() => {
        setSelectedValue(linkValue);
        setProjectParameters(params);
        setSearchValue('');
    }, [display, linkValue, params]);

    const handleChangeSearch = value => {
        setSearchValue(value);
        setProjectParameters(
            params.filter(
                parameter =>
                    parameter.key.toLowerCase().indexOf(value.toLowerCase()) !== -1
            )
        );
    };

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
                    <Box className={classes.search}>
                        <SearchInput
                            fullWidth
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
                                    <ParametersModalRow
                                        key={key}
                                        ableToEdit={ableToEdit}
                                        paramKey={key}
                                        value={value}
                                        secret={secret}
                                        selectedValue={selectedValue}
                                        defaultSelected={linkValue === key}
                                        setSelectedValue={setSelectedValue}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ModalConfirmButtons
                        ableToEdit={ableToEdit}
                        selectedValue={selectedValue}
                        onClose={onClose}
                        onSetValue={onSetValue}
                        disabledConfirm={!selectedValue}
                    />
                </Box>
            )}
        </PopupForm>
    );
};

const mapStateToProps = state => ({
    params: state.pages.settingsParameters.params,
    loading: state.pages.settingsParameters.loading
});

ParametersModal.propTypes = {
    ableToEdit: PropTypes.bool,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    onSetValue: PropTypes.func,
    params: PropTypes.array,
    loading: PropTypes.bool,
    currentValue: PropTypes.string
};

ParametersModal.defaultProps = {
    params: []
};

export default connect(mapStateToProps)(ParametersModal);

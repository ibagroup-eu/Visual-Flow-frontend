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

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Paper, Table, TableBody, TableContainer, Box } from '@material-ui/core';
import { connect } from 'react-redux';

import PopupForm from '../../../../components/popup-form';
import { PageSkeleton } from '../../../../components/skeleton';

import useStyles from './ConnectionsModal.Styles';
import ConnectionsModalTableRow from './tableRow/ConnectionsModalTableRow';
import ConnectionsSearchAndSelect from './searchAndSelect/ConnectionsSearchAndSelect';
import { selectConnections } from '../../../../pages/settings/connections/Connections';
import ModalConfirmButtons from './confirmButtons/ModalConfirmButtons';

const ConnectionsModal = ({
    ableToEdit,
    display,
    onClose,
    onSetValue,
    connections,
    parameters,
    loading,
    currentValue
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [searchValue, setSearchValue] = useState('');
    const [projectConnections, setProjectConnections] = useState(connections);
    const [selectedValue, setSelectedValue] = useState('');
    const [storageSelection, setStorageSelection] = useState('');

    useEffect(() => {
        setProjectConnections(connections);
    }, [connections]);

    useEffect(() => {
        setSelectedValue(currentValue);
        setSearchValue('');
        setStorageSelection('');
    }, [display, currentValue]);

    const filterParameters = () =>
        projectConnections?.filter(
            ({ value }) =>
                value?.connectionName
                    .toLowerCase()
                    .indexOf(searchValue.toLowerCase()) !== -1 &&
                (!storageSelection || value?.storage === storageSelection)
        );

    return (
        <PopupForm
            display={display}
            onClose={onClose}
            title={t('main:form.header.Connections')}
        >
            {loading ? (
                <PageSkeleton />
            ) : (
                <Box className={classes.modalWrapper}>
                    <Box className={classes.searchAndSelectWrapper}>
                        <ConnectionsSearchAndSelect
                            searchValue={searchValue}
                            setSearchValue={setSearchValue}
                            storageSelection={storageSelection}
                            setStorageSelection={setStorageSelection}
                            connectionsLabels={selectConnections}
                        />
                    </Box>
                    <TableContainer
                        className={classes.connectionList}
                        component={Paper}
                    >
                        <Table>
                            <TableBody>
                                {filterParameters()?.map(({ key, value }) => (
                                    <ConnectionsModalTableRow
                                        key={key}
                                        ableToEdit={ableToEdit}
                                        connection={{
                                            ...value,
                                            storageLabel: selectConnections.find(
                                                item => item.value === value.storage
                                            )?.name
                                        }}
                                        params={parameters}
                                        defaultSelected={
                                            currentValue === value.connectionName
                                        }
                                        selectedValue={selectedValue}
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
    loading: state.pages.settingsConnections.loading,
    connections: state.pages.settingsConnections.connections,
    parameters: state.pages.settingsParameters.params
});

ConnectionsModal.propTypes = {
    ableToEdit: PropTypes.bool,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    onSetValue: PropTypes.func,
    connections: PropTypes.array,
    parameters: PropTypes.array,
    loading: PropTypes.bool,
    currentValue: PropTypes.string
};

export default connect(mapStateToProps)(ConnectionsModal);

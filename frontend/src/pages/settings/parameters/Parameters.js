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
import Box from '@material-ui/core/Box';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
    Grid,
    Table,
    TableBody,
    TableContainer,
    Paper,
    withStyles
} from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { find, get } from 'lodash';

import FormWrapper from '../../../components/form-wrapper';
import PropertySelect from '../../../components/property-select';
import { PageSkeleton } from '../../../components/skeleton';
import styles from './Parameters.Styles';
import ParametersTableRow from './table';
import {
    createParameter,
    deleteParameter,
    fetchParameters,
    updateParameter
} from '../../../redux/actions/settingsParametersActions';
import ParametersPanel from './panel';
import ParametersSearch from './search/ParametersSearch';

const PARAMETER_TYPES = [
    { name: 'string', value: 'string', secret: false },
    { name: 'secureString', value: 'secureString', secret: true }
];

export const Parameters = ({
    projectId,
    loading,
    getParameters,
    update,
    create,
    remove,
    parameters,
    editStatus,
    deleteStatus,
    saving,
    classes,
    editable
}) => {
    const { t } = useTranslation();

    const [searchValue, setSearchValue] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [panelIsOpen, setPanelIsOpen] = useState(false);
    const [selectedParam, setSelectedParam] = useState({});
    const [title, setTitle] = useState('Create');

    useEffect(() => {
        projectId && getParameters(projectId);
    }, [getParameters, projectId]);

    const onClose = () => setPanelIsOpen(false);

    const onFilter = ([search, filter]) => {
        setSearchValue(search);
        setFilterValue(filter);
    };

    const onEditPanel = param => () => {
        setPanelIsOpen(true);
        setTitle('Edit');
        setSelectedParam(param);
    };

    const onCreatePanel = ({ target: { value } }) => {
        setPanelIsOpen(true);
        setTitle('Create');
        setSelectedParam({ secret: find(PARAMETER_TYPES, { value }).secret });
    };

    const onRemove = param => () => {
        remove(projectId, param);
    };

    const onSave = param => {
        const modify = title === 'Create' ? create : update;

        modify(projectId, param).then(onClose);
    };

    const renderNewFieldDropdown = () =>
        editable && (
            <PropertySelect
                handleChange={onCreatePanel}
                placeholder={t('main:button.AddParameter')}
                properties={PARAMETER_TYPES}
                isConnections
            />
        );

    const shouldAddButtonRepeat = () => {
        const shownRows = window.innerHeight / 73 - 3.5;
        return parameters.length > shownRows;
    };

    const filterParameters = () =>
        parameters.filter(
            parameter =>
                parameter.key.toLowerCase().includes(searchValue.toLowerCase()) &&
                (!filterValue ||
                    parameter.secret ===
                        find(PARAMETER_TYPES, { value: filterValue })?.secret)
        );

    return loading ? (
        <PageSkeleton />
    ) : (
        <Grid container>
            <Grid item xs={2} />
            <Grid item xs={8} className={classNames(classes.root)}>
                <FormWrapper title="Parameters" editable editMode disableSaveButtons>
                    <Box
                        className={classNames(
                            classes.flex,
                            classes.spaceBetween,
                            classes.paddedBottom
                        )}
                    >
                        <ParametersSearch
                            searchValue={searchValue}
                            filterValue={filterValue}
                            filterOptions={PARAMETER_TYPES.map(
                                ({ name, value }) => ({
                                    value,
                                    label: name
                                })
                            )}
                            onFilter={onFilter}
                        />
                        {renderNewFieldDropdown()}
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {filterParameters().map(param => (
                                    <ParametersTableRow
                                        key={param.id}
                                        parameter={param}
                                        editing={get(editStatus, param.id, false)}
                                        deleting={get(deleteStatus, param.id, false)}
                                        handleEdit={onEditPanel(param)}
                                        handleRemove={onRemove(param)}
                                        editableMode={editable}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {shouldAddButtonRepeat() && (
                        <Box
                            className={classNames(
                                classes.flex,
                                classes.flexEnd,
                                classes.paddedTop
                            )}
                        >
                            {renderNewFieldDropdown()}
                        </Box>
                    )}
                    <ParametersPanel
                        open={panelIsOpen}
                        close={onClose}
                        save={onSave}
                        saving={saving}
                        data={selectedParam}
                        title={title}
                        parameterTypes={PARAMETER_TYPES}
                    />
                </FormWrapper>
            </Grid>
            <Grid item xs={2} />
        </Grid>
    );
};

Parameters.propTypes = {
    projectId: PropTypes.string,
    loading: PropTypes.bool,
    getParameters: PropTypes.func,
    create: PropTypes.func,
    update: PropTypes.func,
    remove: PropTypes.func,
    classes: PropTypes.object,
    parameters: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            key: PropTypes.string,
            value: PropTypes.string,
            secret: PropTypes.bool
        })
    ),
    editStatus: PropTypes.object,
    deleteStatus: PropTypes.object,
    saving: PropTypes.bool,
    editable: PropTypes.bool
};

Parameters.defaultProps = {
    parameters: [],
    deleteStatus: {},
    editStatus: {}
};

const mapStateToProps = state => ({
    projectId: state.projects.currentProject,
    parameters: state.pages.settingsParameters.params,
    deleteStatus: state.pages.settingsParameters.deleteStatus,
    editStatus: state.pages.settingsParameters.editStatus,
    loading: state.pages.settingsParameters.loading,
    saving: state.pages.settingsParameters.saving,
    editable: state.pages.settingsParameters.editable
});

const mapDispatchToProps = {
    getParameters: fetchParameters,
    create: createParameter,
    update: updateParameter,
    remove: deleteParameter
};

export default compose(
    withStyles(styles),
    connect(mapStateToProps, mapDispatchToProps)
)(Parameters);

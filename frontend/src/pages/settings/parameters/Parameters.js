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
import Box from '@material-ui/core/Box';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Table, TableBody, TableContainer, Paper } from '@material-ui/core';
import { isEqual, uniqueId } from 'lodash';
import { useTranslation } from 'react-i18next';

import FormWrapper from '../../../components/form-wrapper';
import PropertySelect from '../../../components/property-select';
import SearchInput from '../../../components/search-input';
import {
    fetchParameters,
    updateParameters
} from '../../../redux/actions/settingsParametersActions';
import { PageSkeleton } from '../../../components/skeleton';

import ParametersTableRow from '../components/parameters';
import useStyles from './Parameters.Styles';
import useUnsavedChangesWarning from '../useUnsavedChangesWarning';

const Parameters = ({ projectId, parameters, loading, getParameters, update }) => {
    const { t } = useTranslation();
    const classes = useStyles();
    const { params = [], editable } = parameters;
    const [Prompt, setDirty, setPristine] = useUnsavedChangesWarning();

    const selectProperties = [
        {
            value: '',
            name: 'string'
        },
        {
            value: '1',
            name: 'secureString'
        }
    ];

    const parameterData = params.map(p => ({ ...p, id: uniqueId() }));

    const [projectParameters, setProjectParameters] = React.useState(parameterData);
    const [editMode, setEditMode] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [errorParameters, setErrorParameters] = React.useState([]);

    React.useEffect(() => {
        projectId && getParameters(projectId);
    }, [projectId, editMode]);

    React.useEffect(() => {
        setProjectParameters(parameterData);
    }, [parameters]);

    const onSubmit = () => {
        update(projectId, {
            ...parameters,
            params: projectParameters.map(({ id, ...p }) => p)
        });
        setEditMode(false);
    };

    const onCancel = () => {
        setEditMode(false);
        setProjectParameters(parameterData);
    };

    const handleChangeParameter = (event, changedId, field) => {
        event.persist();
        setProjectParameters(prevState =>
            prevState.map(parameter =>
                parameter.id === changedId
                    ? { ...parameter, [field]: event.target.value }
                    : parameter
            )
        );
    };

    const removeParameter = removedId => {
        setErrorParameters(prevParams => {
            const index = prevParams.indexOf(removedId);
            const tempParams = [...prevParams];
            tempParams.splice(index, 1);
            return tempParams;
        });
        setProjectParameters(prevState =>
            prevState.filter(parameter => parameter.id !== removedId)
        );
    };

    const handleClickNewFieldType = event =>
        setProjectParameters(prevState => [
            ...prevState,
            {
                key: '',
                value: '',
                secret: Boolean(event.target.value),
                id: uniqueId()
            }
        ]);

    const handleChangeSearch = value => {
        setSearchValue(value);
    };

    const renderNewFieldDropdown = () => (
        <PropertySelect
            className={classNames({
                [classes.hidden]: !editMode
            })}
            handleChange={handleClickNewFieldType}
            placeholder={t('main:button.addProperty')}
            properties={selectProperties}
        />
    );

    const saveButtonIsDisabled = () => {
        useEffect(() => {
            isEqual(projectParameters.map(({ id, ...p }) => p).sort(), params.sort())
                ? setPristine()
                : setDirty();
        });

        return (
            !editable ||
            isEqual(
                projectParameters.map(({ id, ...p }) => p).sort(),
                params.sort()
            ) ||
            Boolean(errorParameters.length)
        );
    };

    const filterParameters = () =>
        projectParameters.filter(
            parameter =>
                parameter.key.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
        );

    const shouldAddButtonRepeat = () => {
        // 73px - property row height; ~3.5 row sizes used by other interfaces
        const shownRows = window.innerHeight / 73 - 3.5;
        return projectParameters.length > shownRows;
    };

    const cardTitle = editMode ? 'editProjectParameters' : 'viewProjectParameters';

    const errorParameterHandler = (err, id) => {
        err &&
            !errorParameters.includes(id) &&
            setErrorParameters(prevParams => [...prevParams, id]);
        !err &&
            errorParameters.includes(id) &&
            setErrorParameters(prevParams => {
                const index = prevParams.indexOf(id);
                const tempParams = [...prevParams];
                tempParams.splice(index, 1);
                return tempParams;
            });
    };

    return loading ? (
        <PageSkeleton />
    ) : (
        <Grid container>
            <Grid item xs={3} />
            <Grid item xs={6} className={classes.root}>
                <FormWrapper
                    title={cardTitle}
                    editable={editable}
                    editMode={editMode}
                    setEditMode={() => {
                        handleChangeSearch('');
                        setEditMode(true);
                    }}
                    onCancel={onCancel}
                    onSubmit={onSubmit}
                    isSaveBtnDisabled={saveButtonIsDisabled}
                >
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
                        {renderNewFieldDropdown()}
                    </Box>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableBody>
                                {filterParameters().map(parameter => (
                                    <ParametersTableRow
                                        key={parameter.id}
                                        parameter={parameter}
                                        editMode={editMode}
                                        handleChangeParameter={handleChangeParameter}
                                        handleRemoveParameter={removeParameter}
                                        isErrorParameter={errorParameterHandler}
                                        parameters={projectParameters}
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
                </FormWrapper>
            </Grid>
            <Grid item xs={3} />
            {Prompt}
        </Grid>
    );
};

const mapStateToProps = state => ({
    projectId: state.projects.currentProject,
    parameters: state.pages.settingsParameters.data,
    loading: state.pages.settingsParameters.loading
});

const mapDispatchToProps = {
    getParameters: fetchParameters,
    update: updateParameters
};

Parameters.propTypes = {
    projectId: PropTypes.string,
    parameters: PropTypes.object,
    loading: PropTypes.bool,
    getParameters: PropTypes.func,
    update: PropTypes.func
};

Parameters.defaultProps = {
    parameters: {
        params: []
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Parameters);

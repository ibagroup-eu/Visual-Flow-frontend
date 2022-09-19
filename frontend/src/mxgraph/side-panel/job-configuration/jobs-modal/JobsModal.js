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
import _ from 'lodash';
import {
    Table,
    TableBody,
    TableCell,
    TableRow,
    TextField,
    Box,
    Radio,
    TableContainer,
    Paper
} from '@material-ui/core';

import classNames from 'classnames';
import PopupForm from '../../../../components/popup-form';
import SearchInput from '../../../../components/search-input';
import { PageSkeleton } from '../../../../components/skeleton';
import useStyles from './JobsModal.Styles';
import ModalConfirmButtons from '../../read-write-configuration/connections-modal/confirmButtons/ModalConfirmButtons';

const JobsModal = ({
    ableToEdit,
    display,
    onClose,
    jobs,
    loading,
    currentValue,
    onSetValue
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [jobList, setJobList] = React.useState(_.sortBy(jobs, 'name'));
    const [searchValue, setSearchValue] = React.useState('');
    const [selectedValue, setSelectedValue] = React.useState('');
    const jobSelected = jobs.find(job => job.id === selectedValue);

    React.useEffect(() => {
        setSelectedValue(currentValue);
        setJobList(_.sortBy(jobs, 'name'));
        setSearchValue('');
    }, [display]);

    const handleChangeSearch = value => {
        setSearchValue(value);
        setJobList(
            jobs.filter(
                job => job.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
            )
        );
    };

    return (
        <PopupForm
            display={display}
            onClose={onClose}
            title={t('pipelineDesigner:jobModal.Jobs')}
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
                            placeholder={t('pipelineDesigner:jobModal.search')}
                        />
                    </Box>
                    <TableContainer
                        className={classes.listContent}
                        component={Paper}
                    >
                        <Table>
                            <TableBody>
                                {jobList
                                    .filter(job => job.pipelineId === null)
                                    .map(({ id, name }) => (
                                        <TableRow key={id}>
                                            {(!!jobSelected || ableToEdit) && (
                                                <TableCell className={classes.cell}>
                                                    <Radio
                                                        disabled={!ableToEdit}
                                                        className={
                                                            classes.radioButtonCell
                                                        }
                                                        checked={
                                                            selectedValue === id
                                                        }
                                                        onChange={event =>
                                                            setSelectedValue(
                                                                event.target.value
                                                            )
                                                        }
                                                        value={id}
                                                        color="primary"
                                                    />
                                                </TableCell>
                                            )}
                                            <TableCell
                                                className={classNames(
                                                    classes.cell,
                                                    classes.jobCell
                                                )}
                                            >
                                                <TextField
                                                    disabled
                                                    variant="outlined"
                                                    fullWidth
                                                    value={name}
                                                    placeholder={t(
                                                        'pipelineDesigner:jobConfiguration.Name'
                                                    )}
                                                    InputProps={{
                                                        classes: {
                                                            disabled: classes.paper
                                                        }
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <ModalConfirmButtons
                        ableToEdit={ableToEdit}
                        selectedValue={selectedValue}
                        onClose={onClose}
                        onSetValue={onSetValue}
                    />
                </Box>
            )}
        </PopupForm>
    );
};

JobsModal.propTypes = {
    ableToEdit: PropTypes.bool,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    onSetValue: PropTypes.func,
    currentValue: PropTypes.string,
    jobs: PropTypes.array,
    loading: PropTypes.bool
};

export default JobsModal;

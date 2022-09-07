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
    Radio
} from '@material-ui/core';

import PopupForm from '../../../../components/popup-form';
import SearchInput from '../../../../components/search-input';
import { PageSkeleton } from '../../../../components/skeleton';
import useStyles from './JobsModal.Styles';
import SaveCancelButtons from '../../buttons';

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
                    <Box>
                        <SearchInput
                            value={searchValue}
                            onChange={event =>
                                handleChangeSearch(event.target.value)
                            }
                            placeholder={t('pipelineDesigner:jobModal.search')}
                        />
                    </Box>
                    <Box className={classes.listContent} boxShadow={3}>
                        <Table>
                            <TableBody>
                                {jobList
                                    .filter(job => job.pipelineId === null)
                                    .map(({ id, name }) => (
                                        <TableRow key={id}>
                                            {ableToEdit && (
                                                <TableCell
                                                    className={classes.radioBtn}
                                                >
                                                    <Radio
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
                                            <TableCell className={classes.jobCell}>
                                                <TextField
                                                    disabled
                                                    variant="outlined"
                                                    fullWidth
                                                    value={name}
                                                    placeholder={t(
                                                        'pipelineDesigner:jobConfiguration.Name'
                                                    )}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </Box>
                    <Box className={classes.buttonsGroup}>
                        <SaveCancelButtons
                            ableToEdit={ableToEdit}
                            saveCell={() => onSetValue(selectedValue)}
                            cancelChanges={onClose}
                            isDisabled={!selectedValue}
                            isModal
                        />
                    </Box>
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

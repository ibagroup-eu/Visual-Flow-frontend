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

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    Box,
    Button,
    Checkbox,
    Grid,
    TablePagination,
    Typography
} from '@material-ui/core';

import { isEqual } from 'lodash';
import useStyles from './ImportModal.Styles';
import PopupForm from '../../../components/popup-form';
import ModalGridRow from './ModalGridRow';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';

const prepareData = (jobs, pipelines) =>
    pipelines.reduce((map, pipeline) => {
        const jobIds = pipeline.spec?.templates
            ?.filter(({ name }) => name === 'dagTemplate')
            .flatMap(({ dag }) =>
                dag?.tasks?.flatMap(task =>
                    task?.arguments?.parameters
                        ?.filter(({ name }) => name === 'configMap')
                        .map(({ value }) => value)
                )
            );
        const filteredJobs = jobs.filter(job =>
            jobIds?.includes(job?.metadata?.name)
        );
        map.set(pipeline, filteredJobs);
        return map;
    }, new Map());

const buildSelectedIds = (selected, checked, ...ids) => {
    let newSelected;

    if (checked) {
        newSelected = selected.concat(
            ids.filter(id => !selected.some(v => isEqual(v, id)))
        );
    } else {
        newSelected = selected.filter(v => !ids.some(id => isEqual(v, id)));
    }

    return newSelected;
};

const ImportModal = ({
    display,
    title,
    jobs,
    pipelines,
    onClose,
    importResources,
    t,
    existedList,
    confirmationWindow
}) => {
    const classes = useStyles();
    const [dataList, setDataList] = React.useState(new Map());
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const numSelected = selected?.length || 0;
    const rowsPerPage = 5;

    const map = useMemo(() => prepareData(jobs, pipelines), [jobs, pipelines]);

    React.useEffect(() => {
        const result = new Map();
        if (pipelines?.length) {
            map.forEach((value, key) => {
                result.set([key], key);
                value.forEach(v => result.set([v, key], v));
            });
        } else {
            jobs.forEach(job => result.set([job], job));
        }
        setDataList(result);

        setSelected(Array.from(result.keys()));
    }, [map, jobs, pipelines]);

    const handleSelect = (id, checked) => {
        if (checked && pipelines?.length) {
            const [item] = id;
            const pipeline = pipelines.find(v => v === item);
            if (pipeline) {
                const children = map.get(pipeline)?.map(job => [job, item]) || [];

                setSelected(v => buildSelectedIds(v, checked, id, ...children));
                return;
            }
        }
        setSelected(v => buildSelectedIds(v, checked, id));
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const items = Array.from(dataList.keys());
            setSelected(items);
        } else {
            setSelected([]);
        }
    };

    const isSelected = id => selected.some(v => isEqual(v, id));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleImportResources = () => {
        if (
            existedList.some(item =>
                selected.some(([v]) => v.metadata?.name === item.id)
            )
        ) {
            confirmationWindow({
                body: `${t('main:importPage.confirm')}`,
                callback: () => {
                    importResources(selected);
                    onClose();
                }
            });
        } else {
            importResources(selected);
            onClose();
        }
    };

    return (
        <PopupForm display={display} onClose={onClose} title={title} isNotHelper>
            <Box className={classes.wrapper}>
                <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    className={classes.header}
                >
                    <Grid item xs={1}>
                        <Checkbox
                            indeterminate={
                                numSelected > 0 && numSelected < dataList.length
                            }
                            checked={
                                dataList.size > 0 && numSelected === dataList.size
                            }
                            onChange={handleSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts'
                            }}
                        />
                    </Grid>
                    <TablePagination
                        rowsPerPageOptions={[rowsPerPage]}
                        labelDisplayedRows={args => t('main:pagination.of', args)}
                        component={Grid}
                        count={dataList.size}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                </Grid>
                {Array.from(dataList.entries())
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(([id, item], index) => {
                        const { kind, metadata } = item;
                        const [child, parent] = id;

                        const disabled = id.length > 1 && isSelected([parent]);
                        const isItemSelected = isSelected(id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                            <ModalGridRow
                                key={child?.metadata?.name + parent?.metadata?.name}
                                id={id}
                                t={t}
                                kind={kind}
                                metadata={metadata}
                                isItemSelected={isItemSelected}
                                labelId={labelId}
                                disabled={disabled}
                                handleSelect={handleSelect}
                            />
                        );
                    })}
                <Typography
                    component="div"
                    variant="body2"
                    color="textSecondary"
                    className={classes.typography}
                >
                    <strong>{t('main:export.note1')}</strong>
                    {t('pipelines:importPipelinesNote')}
                </Typography>
                <Box className={classes.buttonsGroup}>
                    <Button
                        onClick={handleImportResources}
                        size="large"
                        variant="contained"
                        color="primary"
                        disabled={!selected.length}
                        className={classes.button}
                    >
                        {t('main:button.Import')}
                    </Button>
                    <Button
                        onClick={() => {
                            onClose();
                            setSelected([]);
                        }}
                        size="large"
                        variant="contained"
                        className={classNames(classes.button, classes.cancelBtn)}
                    >
                        {t('main:button.Cancel')}
                    </Button>
                </Box>
            </Box>
        </PopupForm>
    );
};

ImportModal.propTypes = {
    display: PropTypes.bool,
    title: PropTypes.string,
    jobs: PropTypes.array,
    pipelines: PropTypes.array,
    onClose: PropTypes.func,
    importResources: PropTypes.func,
    t: PropTypes.func,
    existedList: PropTypes.array,
    confirmationWindow: PropTypes.func.isRequired
};

const mapDispatchToProps = {
    confirmationWindow: toggleConfirmationWindow
};

export default compose(connect(null, mapDispatchToProps))(
    withTranslation()(ImportModal)
);

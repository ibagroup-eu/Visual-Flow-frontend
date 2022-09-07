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
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
    Box,
    TablePagination,
    Grid,
    Typography,
    Checkbox,
    Button
} from '@material-ui/core';
import TransformOutlinedIcon from '@material-ui/icons/TransformOutlined';
import Timeline from '@material-ui/icons/Timeline';
import moment from 'moment';

import useStyles from './ImportModal.Styles';
import PopupForm from '../../../components/popup-form';
import toggleConfirmationWindow from '../../../redux/actions/modalsActions';
import { DATE_FORMAT } from '../../../globalConstants';

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

    const [dataList, setDataList] = React.useState([]);
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const numSelected = selected?.length || 0;
    const rowsPerPage = 5;

    React.useEffect(() => {
        setDataList(jobs.concat(pipelines));
        setSelected([]);
    }, [jobs, pipelines]);

    const handleSelect = id => {
        const index = selected.indexOf(id);
        let newSelected = [];
        if (index > -1) {
            newSelected = newSelected.concat(
                selected.slice(0, index),
                selected.slice(index + 1)
            );
        } else {
            newSelected = newSelected.concat(selected, id);
        }
        setSelected(newSelected);
    };

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const items = dataList.map(item => item?.metadata?.name);
            setSelected(items);
        } else {
            setSelected([]);
        }
    };

    const isSelected = id => selected.indexOf(id) !== -1;

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const renderIconType = type => {
        switch (type) {
            case 'ConfigMap':
                return <TransformOutlinedIcon className={classes.secondary} />;
            case 'WorkflowTemplate':
                return <Timeline className={classes.secondary} />;
            default:
                return null;
        }
    };

    const formatDate = date => date && moment(date, DATE_FORMAT).format(DATE_FORMAT);

    const handleImportResources = () => {
        if (existedList.some(item => selected.includes(item.id))) {
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
                                dataList.length > 0 &&
                                numSelected === dataList.length
                            }
                            onChange={handleSelectAllClick}
                            inputProps={{
                                'aria-label': 'select all desserts'
                            }}
                        />
                    </Grid>
                    <TablePagination
                        rowsPerPageOptions={[rowsPerPage]}
                        component={Grid}
                        count={dataList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                </Grid>
                {dataList
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(({ kind, metadata }, index) => {
                        const id = metadata.name;
                        const isItemSelected = isSelected(id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                            <Box
                                key={id}
                                boxShadow={3}
                                className={classNames(
                                    classes.row,
                                    isItemSelected && classes.linear
                                )}
                            >
                                <Grid
                                    container
                                    alignItems="center"
                                    onClick={() => handleSelect(id)}
                                >
                                    <Grid item xs={1} sm={1} md={1}>
                                        <Checkbox
                                            checked={isItemSelected}
                                            inputProps={{
                                                'aria-labelledby': labelId
                                            }}
                                        />
                                    </Grid>
                                    <Grid
                                        item
                                        xs={2}
                                        sm={2}
                                        md={2}
                                        className={classes.center}
                                    >
                                        {renderIconType(kind)}
                                        <Typography color="textSecondary">
                                            {t(`main:importPage.configType.${kind}`)}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={9}
                                        sm={9}
                                        md={9}
                                        className={classes.paddingLeft}
                                    >
                                        <Typography
                                            variant="h5"
                                            color="textSecondary"
                                        >
                                            {metadata?.labels?.name}
                                        </Typography>
                                        <Typography
                                            component="div"
                                            variant="body2"
                                            className={classes.hint}
                                        >
                                            {t('main:importPage.LastUpdated')}:{' '}
                                            {formatDate(
                                                metadata?.annotations?.lastModified
                                            ) || t('main:N/A')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        );
                    })}
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

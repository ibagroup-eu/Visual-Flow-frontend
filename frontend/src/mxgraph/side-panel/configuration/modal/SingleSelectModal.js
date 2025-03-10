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
import moment from 'moment';
import { Box, Paper, Table, TableBody, TableContainer } from '@material-ui/core';
import PopupForm from '../../../../components/popup-form';
import SearchInput from '../../../../components/search-input';
import { PageSkeleton } from '../../../../components/skeleton';
import useStyles from './SingleSelectModal.Styles';
import ModalConfirmButtons from '../../read-write-configuration/connections-modal/confirmButtons/ModalConfirmButtons';
import SingleSelectModalRow from './modal-row/SingleSelectModalRow';
import TableSort from '../../../../components/table/table-sort';
import { DATE_FORMAT_UTC } from '../../../../globalConstants';
import { stableSort, getComparator } from '../../../../utils/sort';

const initialSort = {
    order: 'asc',
    orderBy: 'name'
};

const initialComparator = getComparator(initialSort.order, initialSort.orderBy);

const filterItemsByName = (items, value) =>
    items.filter(
        item => item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    );

const SingleSelectModal = ({
    title,
    ableToEdit,
    display,
    onClose,
    items,
    loading,
    currentValue,
    onSetValue
}) => {
    const { t } = useTranslation();
    const classes = useStyles();

    const [itemList, setItemList] = React.useState(
        stableSort(items, initialComparator)
    );
    const [searchValue, setSearchValue] = React.useState('');
    const [selectedValue, setSelectedValue] = React.useState('');
    const [sort, setSort] = React.useState(initialSort);
    const tableRef = React.useRef();

    React.useEffect(() => {
        setSelectedValue(currentValue);
        setItemList(stableSort(items, initialComparator));
        setSearchValue('');
        setSort(initialSort);
    }, [display, items, currentValue]);

    React.useLayoutEffect(() => {
        if (!tableRef.current) {
            return;
        }

        const radio = tableRef.current.querySelector('input[type="radio"]:checked');

        if (radio) {
            radio.scrollIntoView();
        } else {
            tableRef.current.scrollTo(0, 0);
        }
    }, [sort.order, sort.orderBy, searchValue]);

    const getTooltip = item => {
        const { orderBy } = sort;

        if (orderBy === 'name') {
            return '';
        }

        if (orderBy === 'lastRun' || orderBy === 'lastModified') {
            if (!item[orderBy]) {
                return t('filters:N/A');
            }
            return moment(item[orderBy], DATE_FORMAT_UTC).format(DATE_FORMAT_UTC);
        }

        return item[orderBy] ? item[orderBy].toString() : t('filters:N/A');
    };

    const handleChangeSearch = value => {
        const filteredItems = filterItemsByName(items, value);
        setSearchValue(value);
        setItemList(
            stableSort(filteredItems, getComparator(sort.order, sort.orderBy))
        );
    };

    const handleChangeSort = (__, orderBy) => {
        const filteredItems = filterItemsByName(items, searchValue);
        const order =
            sort.orderBy === orderBy && sort.order === 'asc' ? 'desc' : 'asc';
        setSort({ order, orderBy });
        setItemList(stableSort(filteredItems, getComparator(order, orderBy)));
    };

    return (
        <PopupForm display={display} onClose={onClose} title={title}>
            {loading ? (
                <PageSkeleton />
            ) : (
                <Box className={classes.wrapper}>
                    <Box className={classes.panel}>
                        <TableSort
                            orderColumns={[
                                { id: 'name', name: t('main:form.Name') },
                                { id: 'lastRun', name: t('filters:lastRun') },
                                { id: 'lastModified', name: t('filters:lastEdit') },
                                { id: 'status', name: t('filters:status') }
                            ]}
                            order={sort.order}
                            orderBy={sort.orderBy}
                            onRequestSort={handleChangeSort}
                        />
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
                    </Box>
                    <TableContainer
                        className={classes.listContent}
                        component={Paper}
                        ref={tableRef}
                    >
                        <Table>
                            <TableBody>
                                {itemList.map(item => (
                                    <SingleSelectModalRow
                                        key={item.id}
                                        name={item.name}
                                        id={item.id}
                                        ableToEdit={ableToEdit}
                                        selectedValue={selectedValue}
                                        defaultSelected={currentValue === item.id}
                                        setSelectedValue={setSelectedValue}
                                        tooltip={getTooltip(item)}
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

SingleSelectModal.propTypes = {
    title: PropTypes.string,
    ableToEdit: PropTypes.bool,
    display: PropTypes.bool,
    onClose: PropTypes.func,
    onSetValue: PropTypes.func,
    currentValue: PropTypes.string,
    items: PropTypes.array,
    loading: PropTypes.bool
};

export default SingleSelectModal;

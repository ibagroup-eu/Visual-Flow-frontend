/*
 *  Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';
import setCurrentTablePage, {
    setRowsPerPage,
    updateOrderBy
} from '../redux/actions/enhancedTableActions';

const withPagination = WrappedComponent => props => {
    const location = useLocation();
    const dispatch = useDispatch();

    const table = useSelector(state => state.enhancedTable);

    useEffect(() => {
        const search = qs.parse(location.search, { ignoreQueryPrefix: true });

        search.page && dispatch(setCurrentTablePage(parseInt(search.page, 10)));
        search.rows && dispatch(setRowsPerPage(parseInt(search.rows, 10)));

        const sorted = search.orderBy || search.order;
        sorted && dispatch(updateOrderBy(search.orderBy, search.order));
    }, []);

    useEffect(() => {
        if (!table.isInitial) {
            // Update the URL without 'history' tracking.
            window.history.replaceState(
                {},
                '',
                window.location.pathname + table.search
            );
        }
    }, [table.page, table.rowsPerPage, table.order, table.orderBy]);

    return <WrappedComponent {...props} />;
};

export default withPagination;

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

import {
    setCurrentTablePage,
    setRowsPerPage,
    setTableDefault,
    updateOrderBy
} from './enhancedTableActions';
import {
    SET_CURRENT_PAGE,
    SET_ROWS_PER_PAGE,
    SET_DEFAULT,
    SET_ORDER_BY
} from './types';

describe('EnhancedTable Action', () => {
    it('should call SET_CURRENT_PAGE', () => {
        const expectedAction = { type: SET_CURRENT_PAGE, payload: 1 };
        expect(setCurrentTablePage(1)).toEqual(expectedAction);
    });

    it('should call SET_ROWS_PER_PAGE', () => {
        const expectedAction = { type: SET_ROWS_PER_PAGE, payload: 10 };
        expect(setRowsPerPage(10)).toEqual(expectedAction);
    });

    it('should call SET_DEFAULT', () => {
        const expectedAction = { type: SET_DEFAULT };
        expect(setTableDefault()).toEqual(expectedAction);
    });

    it('should call SET_ORDER_BY with default values', () => {
        expect(updateOrderBy()).toEqual({
            type: SET_ORDER_BY,
            payload: { orderBy: 'name', order: 'asc' }
        });
    });

    it('should call SET_ORDER_BY', () => {
        expect(updateOrderBy('status', 'desc')).toEqual({
            type: SET_ORDER_BY,
            payload: { orderBy: 'status', order: 'desc' }
        });
    });
});

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

import api from '../../api/importExport';
import {
    checkAccessToImport,
    importResources,
    exportResources,
    setExportFileName,
    setDefaultExport
} from './importExportActions';
import {
    CHECK_START,
    CHECK_SUCCESS,
    CHECK_FAIL,
    IMPORT_START,
    IMPORT_SUCCESS,
    IMPORT_FAIL,
    EXPORT_START,
    EXPORT_SUCCESS,
    EXPORT_FAIL,
    SET_EXPORT_FILENAME,
    SET_DEFAULT
} from './types';

describe('ImportExport action', () => {
    let dispatch;

    describe('checkAccessToImport', () => {
        let data;
        let projectId;
        beforeEach(() => {
            data = {};
            projectId = 'vf-test';
            dispatch = jest.fn();
            jest.spyOn(api, 'checkAccessToImport').mockResolvedValue({ data });
        });

        it('should dispatch CHECK_START', () => {
            checkAccessToImport(projectId)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: CHECK_START });
        });

        it('should dispatch CHECK_SUCCESS on success', () => {
            return checkAccessToImport(projectId)(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CHECK_START }],
                    [{ type: CHECK_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch CHECK_FAIL on failure', () => {
            jest.spyOn(api, 'checkAccessToImport').mockRejectedValue('error');
            return checkAccessToImport(projectId)(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: CHECK_START }],
                    [{ type: CHECK_FAIL, payload: { error: 'error' } }]
                ]);
            });
        });
    });

    describe('importResources', () => {
        let data;
        let projectId;
        beforeEach(() => {
            data = {};
            projectId = 'vf-test';
            dispatch = jest.fn();
            jest.spyOn(api, 'importResources').mockResolvedValue({ data });
        });

        it('should dispatch IMPORT_START', () => {
            importResources(projectId, data)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: IMPORT_START });
        });

        it('should dispatch IMPORT_SUCCESS on success', () => {
            return importResources(
                projectId,
                data
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: IMPORT_START }],
                    [{ type: IMPORT_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch IMPORT_FAIL on failure', () => {
            jest.spyOn(api, 'importResources').mockRejectedValue('error');
            return importResources(
                projectId,
                data
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: IMPORT_START }],
                    [{ type: IMPORT_FAIL, payload: { error: 'error' } }]
                ]);
            });
        });
    });

    describe('exportResources', () => {
        let data;
        let projectId;
        beforeEach(() => {
            data = {};
            projectId = 'vf-test';
            dispatch = jest.fn();
            jest.spyOn(api, 'exportResources').mockResolvedValue({ data });
        });

        it('should dispatch EXPORT_START', () => {
            exportResources(projectId, data)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: EXPORT_START });
        });

        it('should dispatch EXPORT_SUCCESS on success', () => {
            return exportResources(
                projectId,
                data
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: EXPORT_START }],
                    [{ type: EXPORT_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch EXPORT_FAIL on failure', () => {
            jest.spyOn(api, 'exportResources').mockRejectedValue('error');
            return exportResources(
                projectId,
                data
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: EXPORT_START }],
                    [{ type: EXPORT_FAIL, payload: { error: 'error' } }]
                ]);
            });
        });
    });

    it('should call SET_EXPORT_FILENAME', () => {
        const expectedAction = { type: SET_EXPORT_FILENAME, payload: 'name' };
        expect(setExportFileName('name')).toEqual(expectedAction);
    });

    it('should call SET_DEFAULT', () => {
        const expectedAction = { type: SET_DEFAULT };
        expect(setDefaultExport()).toEqual(expectedAction);
    });
});

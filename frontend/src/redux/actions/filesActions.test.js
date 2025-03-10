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

import api from '../../api/files';
import {
    UPLOAD_FILES_START,
    UPLOAD_FILES_SUCCESS,
    UPLOAD_FILES_FAIL,
    DOWNLOAD_FILES_START,
    DOWNLOAD_FILES_SUCCESS,
    DOWNLOAD_FILES_FAIL,
    CLEAR_FILES_STATE
} from './types';
import { clearFilesState, downloadFile, uploadFile } from './filesActions';

describe('Logs action', () => {
    let dispatch;

    describe('createJob', () => {
        let data;
        const filePath = 'some_path';
        const fileData = {};
        const projectId = 'some_id';
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'uploadFile').mockResolvedValue({ data });
        });

        it('should dispatch UPLOAD_FILES_START', () => {
            uploadFile(projectId, filePath, fileData)(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: UPLOAD_FILES_START });
        });

        it('should dispatch UPLOAD_FILES_SUCCESS on success', () => {
            return uploadFile(
                projectId,
                filePath,
                fileData
            )(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: UPLOAD_FILES_START }],
                    [{ type: UPLOAD_FILES_SUCCESS }]
                ]);
            });
        });

        it('should dispatch UPLOAD_FILES_FAIL on failure', async () => {
            const error = {};
            jest.spyOn(api, 'uploadFile').mockRejectedValue(error);

            await expect(
                uploadFile(projectId, filePath, fileData)(dispatch)
            ).rejects.toEqual(error);

            expect(dispatch.mock.calls).toEqual([
                [{ type: UPLOAD_FILES_START }],
                [{ type: UPLOAD_FILES_FAIL, payload: { error: error } }]
            ]);
        });
    });

    describe('downloadFile', () => {
        let data;
        beforeEach(() => {
            data = {};
            dispatch = jest.fn();
            jest.spyOn(api, 'downloadFile').mockResolvedValue({ data });
        });

        it('should dispatch DOWNLOAD_FILES_START', () => {
            downloadFile()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({ type: DOWNLOAD_FILES_START });
        });

        it('should dispatch DOWNLOAD_FILES_SUCCESS on success', () => {
            return downloadFile()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: DOWNLOAD_FILES_START }],
                    [{ type: DOWNLOAD_FILES_SUCCESS, payload: data }]
                ]);
            });
        });

        it('should dispatch DOWNLOAD_FILES_FAIL on failure', () => {
            jest.spyOn(api, 'downloadFile').mockRejectedValue({});
            return downloadFile()(dispatch).then(() => {
                expect(dispatch.mock.calls).toEqual([
                    [{ type: DOWNLOAD_FILES_START }],
                    [{ type: DOWNLOAD_FILES_FAIL, payload: { error: {} } }]
                ]);
            });
        });

        it('should dispatch CLEAR_FILES_STATE', () => {
            clearFilesState()(dispatch);
            expect(dispatch).toHaveBeenCalledWith({
                type: CLEAR_FILES_STATE
            });
        });
    });
});

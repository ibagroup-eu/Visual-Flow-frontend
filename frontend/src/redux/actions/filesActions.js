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
    UPLOAD_FILES_START,
    UPLOAD_FILES_SUCCESS,
    UPLOAD_FILES_FAIL,
    DOWNLOAD_FILES_START,
    DOWNLOAD_FILES_SUCCESS,
    DOWNLOAD_FILES_FAIL,
    CLEAR_FILES_STATE
} from './types';
import api from '../../api/files';

export const uploadFile = (projectId, filePath, file) => dispatch => {
    dispatch({ type: UPLOAD_FILES_START });

    return api.uploadFile(projectId, filePath, file).then(
        () => {
            dispatch({
                type: UPLOAD_FILES_SUCCESS
            });
        },
        error => {
            dispatch({
                type: UPLOAD_FILES_FAIL,
                payload: { error }
            });
            throw error;
        }
    );
};

export const downloadFile = (projectId, filePath, fileName) => dispatch => {
    dispatch({ type: DOWNLOAD_FILES_START });

    return api.downloadFile(projectId, filePath, fileName).then(
        response => {
            dispatch({
                type: DOWNLOAD_FILES_SUCCESS,
                payload: response.data
            });
        },
        error => {
            dispatch({
                type: DOWNLOAD_FILES_FAIL,
                payload: { error }
            });
        }
    );
};

export const clearFilesState = () => dispatch => {
    dispatch({
        type: CLEAR_FILES_STATE
    });
};

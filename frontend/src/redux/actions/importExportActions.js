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
import api from '../../api/importExport';

export const checkAccessToImport = projectId => dispatch => {
    dispatch({
        type: CHECK_START
    });

    return api.checkAccessToImport(projectId).then(
        response => {
            dispatch({
                type: CHECK_SUCCESS,
                payload: response.data
            });
        },
        error => {
            dispatch({
                type: CHECK_FAIL,
                payload: { error }
            });
        }
    );
};

export const importResources = (projectId, data) => dispatch => {
    dispatch({
        type: IMPORT_START
    });

    return api.importResources(projectId, data).then(
        response => {
            dispatch({
                type: IMPORT_SUCCESS,
                payload: response.data
            });
        },
        error => {
            dispatch({
                type: IMPORT_FAIL,
                payload: { error }
            });
        }
    );
};

export const exportResources = (projectId, data) => dispatch => {
    dispatch({
        type: EXPORT_START
    });

    return api.exportResources(projectId, data).then(
        response => {
            dispatch({
                type: EXPORT_SUCCESS,
                payload: response.data
            });
        },
        error => {
            dispatch({
                type: EXPORT_FAIL,
                payload: { error }
            });
        }
    );
};

export const setExportFileName = name => ({
    type: SET_EXPORT_FILENAME,
    payload: name
});

export const setDefaultExport = () => ({
    type: SET_DEFAULT
});

export default importResources;

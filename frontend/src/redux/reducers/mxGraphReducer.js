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
    SET_CURRENT_CELL,
    SET_SIDE_PANEL,
    SET_GRAPH_PARAMS,
    SET_GRAPH_FIELDS,
    FETCH_JOB_START,
    FETCH_JOB_SUCCESS,
    FETCH_JOB_FAIL,
    FETCH_PIPELINE_START,
    FETCH_PIPELINE_FAIL,
    FETCH_PIPELINE_SUCCESS,
    SET_GRAPH_DIRTY,
    SET_SIDE_PANEL_DIRTY,
    SET_PARAMS_DIRTY,
    SET_ZOOM_VALUE,
    SET_PANNING,
    SET_LOGS_MODAL,
    SET_STAGE_COPY,
    SET_INTERACTIVE_MODE,
    FETCH_JOB_METADATA_START,
    FETCH_JOB_METADATA_SUCCESS,
    FETCH_JOB_METADATA_FAIL,
    UPDATE_JOB_DEFINITION,
    DELETE_INTERACTIVE_JOB_SESSION_SUCCESS,
    DELETE_INTERACTIVE_JOB_SESSION_FAIL,
    INTERACTIVE_SESSION_EVENT_START,
    INTERACTIVE_SESSION_EVENT_SUCCESS,
    INTERACTIVE_SESSION_EVENT_FAIL,
    UPDATE_INTERACTIVE_JOB_SESSION_SUCCESS,
    UPDATE_INTERACTIVE_JOB_SESSION_FAIL,
    SET_INTERACTIVE_DATA,
    CLEAR_INTERACTIVE_DATA
} from '../actions/types';
import { mergeLatestData } from '../../utils/mergeLatestData';

const initialState = {
    stageCopy: {},
    currentCell: '',
    sidePanelIsOpen: false,
    data: {},
    jobMetadata: null,
    loading: false,
    fields: null,
    dirty: false,
    sidePanelIsDirty: false,
    paramsIsDirty: false,
    graphWithParamsIsDirty: false,
    zoomValue: 1,
    panning: false,
    showLogsModal: false,
    interactive: {
        interactiveMode: false,
        offset: 0,
        data: []
    }
};

// eslint-disable-next-line complexity
const mxGraphReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case SET_SIDE_PANEL:
            return {
                ...state,
                sidePanelIsOpen: action.payload
            };
        case SET_CURRENT_CELL:
            return {
                ...state,
                currentCell: action.payload
            };
        case SET_GRAPH_FIELDS:
            return {
                ...state,
                fields: action.payload
            };
        case SET_GRAPH_DIRTY:
            return {
                ...state,
                dirty: action.payload
            };
        case SET_SIDE_PANEL_DIRTY:
            return {
                ...state,
                sidePanelIsDirty: action.payload
            };
        case SET_PARAMS_DIRTY:
            return {
                ...state,
                paramsIsDirty: action.payload
            };
        case SET_GRAPH_PARAMS: {
            const { NAME, ...params } = action.payload;
            return {
                ...state,
                paramsIsDirty: false,
                graphWithParamsIsDirty: true,
                data: {
                    ...state.data,
                    name: NAME,
                    params
                }
            };
        }
        case FETCH_JOB_START:
        case FETCH_PIPELINE_START:
            return {
                ...state,
                loading: true
            };
        case FETCH_JOB_SUCCESS:
        case FETCH_PIPELINE_SUCCESS:
            return {
                ...state,
                dirty: false,
                graphWithParamsIsDirty: false,
                loading: false,
                data: action.payload
            };
        case FETCH_JOB_FAIL:
        case FETCH_PIPELINE_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.error
            };
        case SET_ZOOM_VALUE:
            return {
                ...state,
                zoomValue: action.payload
            };
        case SET_PANNING:
            return {
                ...state,
                panning: action.payload
            };
        case SET_LOGS_MODAL:
            return {
                ...state,
                showLogsModal: action.payload
            };
        case SET_STAGE_COPY:
            return {
                ...state,
                stageCopy: action.payload
            };
        case SET_INTERACTIVE_MODE:
            return {
                ...state,
                interactive: {
                    ...initialState.interactive,
                    interactiveMode: action.payload
                }
            };
        case FETCH_JOB_METADATA_START:
            return {
                ...state
            };
        case FETCH_JOB_METADATA_SUCCESS:
            return {
                ...state,
                interactive: {
                    ...state.interactive,
                    session: action.payload.session,
                    offset: action.payload.offset,
                    data: mergeLatestData(
                        state.interactive.data,
                        action.payload.data
                    )
                }
            };
        case UPDATE_JOB_DEFINITION:
            return {
                ...state,
                data: {
                    ...state.data,
                    definition: action.payload.definition
                }
            };
        case SET_INTERACTIVE_DATA: {
            return {
                ...state,
                interactive: {
                    ...state.interactive,
                    data: action.payload
                }
            };
        }
        case CLEAR_INTERACTIVE_DATA:
            return {
                ...state,
                interactive: {
                    ...state.interactive,
                    data: [],
                    offset: 0
                }
            };
        case INTERACTIVE_SESSION_EVENT_START:
        case INTERACTIVE_SESSION_EVENT_SUCCESS:
        case FETCH_JOB_METADATA_FAIL:
        case DELETE_INTERACTIVE_JOB_SESSION_FAIL:
        case UPDATE_INTERACTIVE_JOB_SESSION_SUCCESS:
        case DELETE_INTERACTIVE_JOB_SESSION_SUCCESS:
            return {
                ...state
            };
        case INTERACTIVE_SESSION_EVENT_FAIL:
        case UPDATE_INTERACTIVE_JOB_SESSION_FAIL:
            return {
                ...state,
                error: action.payload.error
            };
        default:
            return state;
    }
};

export default mxGraphReducer;

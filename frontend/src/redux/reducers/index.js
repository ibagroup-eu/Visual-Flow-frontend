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

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import { CLEAR_CURRENT_USER } from '../actions/types';

import projectsReducer from './projectsReducer';
import notificationsReducer from './notificationsReducer';
import overviewReducer from './overviewReducer';
import settingsBasicReducer from './settingsBasicReducer';
import settingsParametersReducer from './settingsParametersReducer';
import jobsReducer from './jobsReducer';
import logsReducer from './logsReducer';
import modalsReducer from './modalsReducer';
import mxGraphReducer from './mxGraphReducer';
import settingsUsersRolesReducer from './settingsUsersRolesReducer';
import currentUserReducer from './currentUserReducer';
import usersReducer from './usersReducer';
import rolesReducer from './rolesReducer';
import oneJobStatusReducer from './oneJobStatusReducer';
import pipelinesReducer from './pipelinesReducer';
import onePipelineStatusReducer from './onePipelineStatusReducer';
import importExportReducer from './importExportReducer';
import enhancedTableReducer from './enhancedTableReducer';
import cronReducer from './cronReducer';
import settingsConnectionsReducer from './settingsConnectionsReducer';
import urlSearchReducer from './urlSearchReducer';
import profileReducer from './profileReducer';
import historyReducer from './historyReducer';
import filesReducer from './filesReducer';
import appSettingsReducer from './appSettingsReducer';
import clusterUtilsReducer from './clusterUtilsReducer';

const combine = combineReducers({
    routing: routerReducer,
    projects: projectsReducer,
    notifications: notificationsReducer,
    mxGraph: mxGraphReducer,
    jobStatus: oneJobStatusReducer,
    pipelineStatus: onePipelineStatusReducer,
    modals: modalsReducer,
    pages: combineReducers({
        overview: overviewReducer,
        jobs: jobsReducer,
        logs: logsReducer,
        pipelines: pipelinesReducer,
        settingsBasic: settingsBasicReducer,
        settingsParameters: settingsParametersReducer,
        settingsConnections: settingsConnectionsReducer,
        settingsUsersRoles: settingsUsersRolesReducer,
        cron: cronReducer,
        urlSearch: urlSearchReducer,
        history: historyReducer
    }),
    user: combineReducers({
        currentUser: currentUserReducer,
        users: usersReducer,
        roles: rolesReducer,
        profile: profileReducer
    }),
    importExport: importExportReducer,
    enhancedTable: enhancedTableReducer,
    files: filesReducer,
    appSettings: appSettingsReducer,
    clusterUtils: clusterUtilsReducer
});

const reducers = (state, action) =>
    combine(action.type === CLEAR_CURRENT_USER ? undefined : state, action);

export default reducers;

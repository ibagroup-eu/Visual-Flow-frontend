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

import React, { useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import NotFound from '../pages/not-found';
import Overview from '../pages/overview';
import Pipelines from '../pages/pipelines';
import Jobs from '../pages/jobs';
import { Basic, Parameters, Users, Connections } from '../pages/settings';
import AddProject from '../pages/add-project';
import Main from '../pages/main';
import Logs from '../pages/logs-modal/logs';
import withParams from './withParams';
import PrivateRoute from '../components/routes/private';
import JobDesigner from '../pages/job-designer';
import PipelineDesigner from '../pages/pipeline-designer';
import Import from '../pages/import';
import history from '../utils/history';
import { getProject } from '../redux/actions/settingsActions';

const isFirst = currentPath =>
    currentPath.length === 3 &&
    ['overview', 'pipelines', 'jobs', 'import'].includes(currentPath[2]);

const isFirstOther = currentPath =>
    currentPath[2] === 'settings' &&
    ['basic', 'parameters', 'users', 'connections'].includes(currentPath[3]);

const isSecond = currentPath =>
    currentPath.length === 4 &&
    (currentPath[1] === 'jobs' || currentPath[1] === 'pipelines');

const isSecondOther = currentPath =>
    currentPath.length === 3 && currentPath[1] === 'jobs';

const isFourth = currentPath =>
    currentPath.length === 6 && currentPath[1] === 'jobs';

const Routes = () => {
    const dispatch = useDispatch();

    const currentPath = history?.location?.pathname?.split('/');
    // must be revised to get the path variable
    let projectId = null;
    if (isFirst(currentPath) || isFirstOther(currentPath)) {
        [, projectId] = currentPath;
    } else if (isSecond(currentPath) || isSecondOther(currentPath)) {
        [, , projectId] = currentPath;
    } else if (isFourth(currentPath)) {
        [, , , , projectId] = currentPath;
    }

    useEffect(() => {
        if (projectId) {
            dispatch(getProject(projectId));
        }
    }, [projectId, dispatch]);

    return (
        <Switch>
            <PrivateRoute exact path="/" component={withParams(Main)} />
            <PrivateRoute
                exact
                path="/:projectId/overview"
                component={withParams(Overview)}
            />
            <PrivateRoute
                exact
                path="/:projectId/pipelines"
                component={withParams(Pipelines)}
            />
            <PrivateRoute
                exact
                path="/:projectId/jobs"
                component={withParams(Jobs)}
            />
            <PrivateRoute
                exact
                path="/jobs/:jobId/logs/:projId"
                component={withParams(Logs)}
            />
            <PrivateRoute
                exact
                path="/:projectId/settings/basic"
                component={withParams(Basic)}
            />
            <PrivateRoute
                exact
                path="/:projectId/settings/parameters"
                component={withParams(Parameters)}
            />
            <PrivateRoute
                exact
                path="/:projectId/settings/users"
                component={withParams(Users)}
            />
            <PrivateRoute
                exact
                path="/:projectId/settings/connections"
                component={withParams(Connections)}
            />
            <PrivateRoute
                exact
                path="/addProject"
                component={withParams(AddProject)}
            />
            <PrivateRoute
                exact
                path="/jobs/:project/:jobId?"
                component={withParams(JobDesigner)}
            />
            <PrivateRoute
                exact
                path="/pipelines/:projectId/:pipelineId?"
                component={withParams(PipelineDesigner)}
            />
            <PrivateRoute
                exact
                path="/:projectId/import"
                component={withParams(Import)}
            />
            <Route component={NotFound} />
        </Switch>
    );
};

export default Routes;

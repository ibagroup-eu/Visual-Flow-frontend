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
import { Route, Switch } from 'react-router-dom';
import NotFound from '../pages/not-found';
import Overview from '../pages/overview';
import Pipelines from '../pages/pipelines';
import Jobs from '../pages/jobs';
import Basic from '../pages/settings/basic';
import Parameters from '../pages/settings/parameters';
import Users from '../pages/settings/users';
import AddProject from '../pages/add-project';
import Main from '../pages/main';
import Logs from '../pages/logs-modal/logs';
import withParams from './withParams';
import PrivateRoute from '../components/routes/private';
import JobDesigner from '../pages/job-designer';
import PipelineDesigner from '../pages/pipeline-designer';
import Import from '../pages/import';

const Routes = () => (
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
        <PrivateRoute exact path="/:projectId/jobs" component={withParams(Jobs)} />
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
        <PrivateRoute exact path="/addProject" component={withParams(AddProject)} />
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

export default Routes;

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
import PropTypes from 'prop-types';
import { PageSkeleton } from '../../skeleton';

class AuthRenderer extends React.Component {
    shouldComponentUpdate(nextProps) {
        const { authenticated } = this.props;
        return authenticated !== nextProps.authenticated;
    }

    render() {
        const { authenticated, children } = this.props;
        return authenticated ? children : <PageSkeleton />;
    }
}

AuthRenderer.propTypes = {
    authenticated: PropTypes.bool,
    children: PropTypes.node.isRequired
};

export default AuthRenderer;

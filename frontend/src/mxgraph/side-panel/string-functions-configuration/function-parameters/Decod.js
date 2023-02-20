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
import SelectField from '../../../../components/select-field';
import { CHARSET_VALUES } from '../constants';
import { OTHER } from '../../../constants';

const DecodParameter = ({ state, ableToEdit, onChange }) => {
    return (
        <SelectField
            ableToEdit={ableToEdit}
            label="jobDesigner:stringFunctionsConfiguration.Charset"
            name="option.charset"
            value={state['option.charset']}
            menuItems={CHARSET_VALUES}
            handleInputChange={onChange}
            type={OTHER}
            required
        />
    );
};

DecodParameter.propTypes = {
    state: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func
};

export default DecodParameter;

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

import { entries, get } from 'lodash';
import React, { memo } from 'react';
import PropTypes from 'prop-types';
import {
    ParamsChipsField,
    ParamsEmailsField,
    ParamsSwitchField,
    ParamsTextField
} from './fields';
import TabsSection from './TabsSection';
import Section from './Section';

const FIELD_COMPONENTS = {
    text: ParamsTextField,
    switch: ParamsSwitchField,
    email: ParamsEmailsField,
    chips: ParamsChipsField
};

const FieldFactory = ({
    fields,
    ableToEdit,
    state,
    onChange,
    parentRef,
    errors,
    onError
}) => {
    const isVisible = field => !field.needs || field.needs.some(x => get(state, x));

    const render = items => {
        return (
            entries(items)
                .filter(([, field]) => isVisible(field))
                // eslint-disable-next-line no-use-before-define
                .map(resolveField)
        );
    };

    const getField = (key, field) => {
        const FieldComponent = get(FIELD_COMPONENTS, field.type, ParamsTextField);
        // console.log(key, field);
        return (
            <FieldComponent
                ableToEdit={ableToEdit}
                parentRef={parentRef}
                key={key}
                name={key}
                {...field}
                value={get(state, key)}
                error={get(errors, key)}
                onError={onError}
                onChange={onChange}
            />
        );
    };

    const getSection = (key, field) => (
        <Section key={key} label={field.label}>
            {render(field.fields)}
        </Section>
    );

    const getTabs = (key, field) => (
        <TabsSection
            key={key}
            fields={field.fields}
            label={field.label}
            render={render}
            ableToEdit={ableToEdit}
        />
    );

    const resolveField = ([key, field]) => {
        // console.log(key, field);
        if (field.type === 'section') {
            return getSection(key, field);
        }
        if (field.type === 'tabs') {
            return getTabs(key, field);
        }

        return getField(key, field);
    };

    return <>{render(fields)}</>;
};

FieldFactory.propTypes = {
    fields: PropTypes.object,
    ableToEdit: PropTypes.bool,
    onChange: PropTypes.func,
    state: PropTypes.object,
    errors: PropTypes.object,
    onError: PropTypes.func,
    parentRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ])
};

export default memo(FieldFactory);

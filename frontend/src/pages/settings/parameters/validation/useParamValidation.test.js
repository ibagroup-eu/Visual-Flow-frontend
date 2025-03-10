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
import { shallow } from 'enzyme';

import useParamValidation, {
    KEY_VALIDATIONS,
    MESSAGES,
    validate,
    VALUE_VALIDATIONS
} from './useParamValidation';

const Fake = ({ param }) => {
    const [error, _] = useParamValidation(param);
    return <fake error={error} />;
};

describe('useParamValidation', () => {
    describe('validate', () => {
        const tests = [
            { value: '', schema: {}, exp: null },
            {
                value: '',
                schema: KEY_VALIDATIONS,
                exp: MESSAGES.VALUE_EMPTY
            },
            {
                value: '',
                schema: VALUE_VALIDATIONS,
                exp: MESSAGES.VALUE_EMPTY
            },
            {
                value: 'A'.repeat(51),
                schema: KEY_VALIDATIONS,
                exp: MESSAGES.KEY_LENGTH
            },
            {
                value: ' A ',
                schema: KEY_VALIDATIONS,
                exp: MESSAGES.KEY_SYMBOLS
            },
            {
                value: '-A-',
                schema: KEY_VALIDATIONS,
                exp: MESSAGES.KEY_START_END
            },
            {
                value: 'Hey5 ',
                schema: {
                    SPACES: x => x.includes(' '),
                    DIGITS: x => x.includes('5')
                },
                exp: 'SPACES'
            },
            {
                value: 'Hey5 ',
                schema: {
                    DIGITS: x => x.includes('5'),
                    SPACES: x => x.includes(' ')
                },
                exp: 'DIGITS'
            },
            {
                value: 'Hey',
                schema: {
                    DIGITS: x => x.includes('5'),
                    SPACES: x => x.includes(' ')
                },
                exp: null
            },
            {
                value: null,
                schema: {
                    DIGITS: x => x?.includes('5'),
                    SPACES: x => x?.includes(' ')
                },
                exp: null
            }
        ];

        it.each(tests)('should return $exp for $value', ({ value, schema, exp }) => {
            expect(validate(value, schema)).toEqual(exp);
        });
    });

    describe('useParamValidation', () => {
        it('should validate fields', () => {
            const param = { key: '', value: '' };

            const wrapper = shallow(<Fake param={param} />);

            expect(wrapper.find('fake').prop('error')).toEqual({
                key: MESSAGES.VALUE_EMPTY,
                value: MESSAGES.VALUE_EMPTY
            });
        });

        it('should validate fields', () => {
            const param = { key: '-A-', value: '' };

            const wrapper = shallow(<Fake param={param} />);

            expect(wrapper.find('fake').prop('error')).toEqual({
                key: MESSAGES.KEY_START_END,
                value: MESSAGES.VALUE_EMPTY
            });
        });

        it('should validate fields', () => {
            const param = { key: 'Hi', value: 'Hi' };

            const wrapper = shallow(<Fake param={param} />);

            expect(wrapper.find('fake').prop('error')).toEqual({});
        });

        it('should validate fields', () => {
            const param = { key: 'Hi-', value: 'Hi' };

            const wrapper = shallow(<Fake param={param} />);

            expect(wrapper.find('fake').prop('error')).toEqual({
                key: MESSAGES.KEY_START_END
            });
        });

        it('should validate fields', () => {
            const param = { key: 'Hi', value: '' };

            const wrapper = shallow(<Fake param={param} />);

            expect(wrapper.find('fake').prop('error')).toEqual({
                value: MESSAGES.VALUE_EMPTY
            });
        });
    });
});

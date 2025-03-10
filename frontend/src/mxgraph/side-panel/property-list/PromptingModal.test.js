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

import { shallow } from 'enzyme';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Table, TextField } from '@material-ui/core';

import { ParamsSwitchField } from '../../sidebar/params/fields';
import PromptingAttributesRow from './PromptingAttributesRow';
import PromptingDataAttributesRow from './PromptingDataAttributesRow';
import PromptingExamplesRow from './PromptingExamplesRow';
import { PromptingModal } from './PromptingModal';

jest.mock('react-i18next', () => ({
    ...jest.requireActual('react-i18next'),
    useTranslation: jest.fn()
}));

describe('PromptingModal', () => {
    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            open: true,
            classes: {},
            onClose: jest.fn(),
            onSave: jest.fn(),
            items: [
                ['a', '5'],
                ['b', '4']
            ],
            state: {
                systemMessage: 'some message',
                task: 'parseText'
            },
            buttonTitle: {
                addAttributeButton: 'add'
            }
        };

        useTranslation.mockImplementation(() => ({ t: x => x }));

        const wrapper = func(<PromptingModal {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init({}, true);

        expect(wrapper.find(TextField)).toHaveLength(1);
        expect(wrapper.find(ParamsSwitchField)).toHaveLength(1);
        expect(wrapper.find(Button)).toHaveLength(4);
        expect(
            wrapper
                .find(Button)
                .at(0)
                .text()
        ).toEqual('add');
    });

    it('should render components when task = parseText', () => {
        const [wrapper] = init(
            {
                state: {
                    keepExtraAttributes: 'true',
                    task: 'parseText'
                },
                examples: [
                    {
                        user: 'user',
                        assistant: ''
                    }
                ],
                attributes: [{ name: '', definition: '' }]
            },
            true
        );
        expect(wrapper.find(ParamsSwitchField)).toHaveLength(1);
        expect(
            wrapper
                .find(ParamsSwitchField)
                .at(0)
                .prop('value')
        ).toBeTruthy();

        const tables = wrapper.find(Table);
        const button = wrapper.find(Button).at(0);
        expect(button.text()).toEqual('add');

        button.prop('onClick')();

        const attrRow = wrapper.find(PromptingAttributesRow);
        expect(attrRow.length).toEqual(2);

        expect(tables.length).toEqual(2);
    });

    it('should remove attribute (parseText)', () => {
        const [wrapper] = init(
            {
                state: {
                    keepExtraAttributes: 'true',
                    task: 'parseText'
                },
                attributes: [
                    { name: 'name1', definition: 'definition1' },
                    { name: 'name2', definition: 'definition2' }
                ]
            },
            true
        );

        const attrRow = wrapper.find(PromptingAttributesRow);
        expect(attrRow.length).toEqual(2);

        attrRow.at(0).prop('onRemove')(0)();

        const attrRowAfterDeleting = wrapper.find(PromptingAttributesRow);
        expect(attrRowAfterDeleting.length).toEqual(1);
    });

    it('should change attribute (parseText)', () => {
        const [wrapper] = init(
            {
                state: {
                    keepExtraAttributes: 'true',
                    task: 'parseText'
                },
                attributes: [{ name: '', definition: '' }]
            },
            true
        );

        const attrRow = wrapper.find(PromptingAttributesRow);
        expect(attrRow.length).toEqual(1);

        const changedName = 'changed name';
        attrRow.at(0).prop('onChange')(0, { name: changedName, definition: '' });

        const attrRowAfterChanging = wrapper.find(PromptingAttributesRow);
        expect(attrRowAfterChanging.at(0).prop('name')).toEqual(changedName);
    });

    it('should render TextField (genericTask)', () => {
        const [wrapper] = init(
            {
                state: {
                    userMessage: 'message',
                    task: 'genericTask'
                }
            },
            true
        );
        expect(wrapper.find(TextField)).toHaveLength(2);
        expect(
            wrapper
                .find(TextField)
                .at(1)
                .prop('value')
        ).toBe('message');
    });

    it('should render TextField (genericTask) userMessage is undefined', () => {
        const [wrapper] = init(
            {
                state: {
                    task: 'genericTask'
                }
            },
            true
        );
        expect(wrapper.find(TextField)).toHaveLength(2);
        expect(
            wrapper
                .find(TextField)
                .at(1)
                .prop('value')
        ).toBe('');
    });

    it('should render components for task = generateData', () => {
        const [wrapper] = init(
            {
                state: {
                    task: 'generateData'
                }
            },
            true
        );

        const tables = wrapper.find(Table);
        const button = wrapper.find(Button).at(0);
        expect(button.text()).toEqual('add');

        button.prop('onClick')();

        const attrRow = wrapper.find(PromptingDataAttributesRow);
        expect(attrRow.length).toEqual(1);

        expect(tables.length).toEqual(2);
    });

    it('should remove attribute (generateData)', () => {
        const [wrapper] = init(
            {
                state: {
                    task: 'generateData'
                },
                attributes: [
                    { name: 'name1', definition: 'definition1' },
                    { name: 'name2', definition: 'definition2' }
                ]
            },
            true
        );

        const attrRow = wrapper.find(PromptingDataAttributesRow);
        expect(attrRow.length).toEqual(2);

        attrRow.at(0).prop('onRemove')(0)();

        const attrRowAfterDeleting = wrapper.find(PromptingDataAttributesRow);
        expect(attrRowAfterDeleting.length).toEqual(1);
    });

    it('should change attribute (generateData)', () => {
        const [wrapper] = init(
            {
                state: {
                    task: 'generateData'
                },
                attributes: [{ name: '', definition: '' }]
            },
            true
        );

        const attrRow = wrapper.find(PromptingDataAttributesRow);
        expect(attrRow.length).toEqual(1);

        const changedName = 'changed name';
        attrRow.at(0).prop('onChange')(0, { name: changedName, definition: '' });

        const attrRowAfterChanging = wrapper.find(PromptingDataAttributesRow);
        expect(attrRowAfterChanging.at(0).prop('name')).toEqual(changedName);
    });

    it('should calls onClick prop for save button', () => {
        const [wrapper, props] = init(
            {
                editable: true
            },
            true
        );
        const button = wrapper.find(Button).at(2);
        button.prop('onClick')();
        expect(props.onSave).toHaveBeenCalled();

        expect(button.text()).toEqual('main:button.Save');
        expect(button.prop('disabled')).toEqual(true);
    });

    it('should test disables attr for Save button (generateData)', () => {
        const [wrapper] = init(
            {
                editable: true,
                state: {
                    task: 'generateData'
                }
            },
            true
        );
        const button = wrapper.find(Button).at(2);

        expect(button.prop('disabled')).toEqual(true);
    });

    it('should test disables attr for Save button (genericTask) 1', () => {
        const [wrapper] = init(
            {
                editable: true,
                state: {
                    task: 'genericTask',
                    systemMessage: 'systemMessage',
                    userMessage: 'userMessage'
                },
                examples: [
                    {
                        user: 'user',
                        assistant: ''
                    }
                ],
                initialExamples: [
                    {
                        user: 'user',
                        assistant: ''
                    }
                ]
            },
            true
        );
        const button = wrapper.find(Button).at(1);
        expect(button.text()).toEqual('main:button.Save');

        expect(button.prop('disabled')).toEqual(true);
    });

    it('should test disables attr for Save button (wrong task)', () => {
        const [wrapper] = init(
            {
                editable: true,
                state: {
                    task: 'some task'
                },
                userMessage: 'message'
            },
            true
        );
        expect(wrapper.find(Button).length).toBe(3);
        const button = wrapper.find(Button).at(1);

        expect(button.text()).toEqual('main:button.Save');
        expect(button.prop('disabled')).toEqual(true);
    });

    it('should remove example', () => {
        const [wrapper] = init(
            {
                examples: [
                    {
                        user: 'user1',
                        assistant: 'assistant1'
                    },
                    {
                        user: 'user2',
                        assistant: 'assistant2'
                    }
                ]
            },
            true
        );

        const examples = wrapper.find(PromptingExamplesRow);
        expect(examples.length).toEqual(2);

        examples.at(0).prop('onRemove')(0)();

        const examplesAfterDeleting = wrapper.find(PromptingExamplesRow);
        expect(examplesAfterDeleting.length).toEqual(1);
    });

    it('should change example', () => {
        const [wrapper] = init(
            {
                examples: [
                    {
                        user: 'user1',
                        assistant: 'assistant1'
                    }
                ]
            },
            true
        );

        const examples = wrapper.find(PromptingExamplesRow);
        expect(examples.length).toEqual(1);

        const changedUser = 'changed name';
        examples.at(0).prop('onChange')(0, {
            user: changedUser,
            assistant: 'assistant1'
        });

        const examplesAfterChanging = wrapper.find(PromptingExamplesRow);
        expect(examplesAfterChanging.at(0).prop('user')).toEqual(changedUser);
    });

    it('should add example', () => {
        const [wrapper] = init(
            {
                examples: [
                    {
                        user: 'user1',
                        assistant: 'assistant1'
                    }
                ],
                buttonTitle: {
                    addAttributeButton: 'add'
                }
            },
            true
        );
        const button = wrapper.find(Button).at(1);

        button.prop('onClick')();

        expect(wrapper.find(PromptingExamplesRow).length).toEqual(2);
    });
});

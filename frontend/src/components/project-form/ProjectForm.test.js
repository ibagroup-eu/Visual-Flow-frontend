/*
 *  Copyright (c) 2021 IBA Group, a.s. All rights reserved.
 *
 *  Licensed to the Apache Software Foundation (ASF) under one or more
 *  contributor license agreements.  See the NOTICE file distributed with
 *  this work for additional information regarding copyright ownership.
 *  The ASF licenses this file to You under the Apache License, Version 2.0
 *  (the "License"); you may not use this file except in compliance with
 *  the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import React from 'react';
import { shallow } from 'enzyme';
import { Avatar, CardHeader, TextField } from '@material-ui/core';
import { ProjectForm } from './ProjectForm';
import FormWrapper from '../form-wrapper';
import history from '../../utils/history';
import LimitsField from './limits';
import { DATABRICKS } from '../../mxgraph/constants';

jest.mock('../../utils/history', () => ({
    push: jest.fn(),
    listen: jest.fn()
}));

describe('ProjectForm', () => {
    beforeEach(() => {
        history.push.mockClear();
        history.listen.mockClear();
    });

    const init = (props = {}, returnProps = false, func = shallow) => {
        const defaultProps = {
            update: jest.fn(),
            create: jest.fn(),
            confirmationWindow: jest.fn(),
            getCurrentUser: jest.fn(),
            currentUser: {
                data: { superuser: true }
            }
        };

        const wrapper = func(<ProjectForm {...defaultProps} {...props} />);

        return returnProps ? [wrapper, { ...defaultProps, ...props }] : [wrapper];
    };

    it('should render without crashes', () => {
        const [wrapper] = init();

        expect(wrapper.find(FormWrapper).exists()).toBeTruthy();
    });

    it('should handle "onSubmit" when a project exists', () => {
        const [wrapper, props] = init({ project: {} }, true);

        wrapper.find(FormWrapper).simulate('submit');

        expect(props.update).toHaveBeenCalled();
    });

    it('should handle "onSubmit" when a project exists with demo limits', () => {
        const [wrapper, props] = init({ project: { demo: true } }, true);

        wrapper.find(FormWrapper).simulate('submit');

        expect(props.update).toHaveBeenCalled();
    });

    it('should handle "onSubmit" when a project exists with demo limits and full data', () => {
        const [wrapper, props] = init(
            {
                project: {
                    demo: true,
                    demoLimits: {
                        sourcesToShow: {
                            READ: [{}],
                            WRITE: [{}]
                        }
                    }
                }
            },
            true
        );

        wrapper.find(FormWrapper).simulate('submit');

        expect(props.update).toHaveBeenCalled();
    });

    it('should handle "onSubmit" when a project does not exists', () => {
        const [wrapper, props] = init({}, true);

        wrapper.find(FormWrapper).simulate('submit');

        expect(props.create).toHaveBeenCalled();
    });

    it('should handle "onCancel" when a project does not exist', () => {
        const [wrapper, _] = init({}, true);

        wrapper.find(FormWrapper).simulate('cancel');

        expect(history.push).toHaveBeenCalled();
    });

    it('should handle "onCancel" when a project does exist', () => {
        const [wrapper, props] = init({ project: {} }, true);

        wrapper.find(FormWrapper).simulate('cancel');
        expect(props.confirmationWindow).not.toHaveBeenCalled();
        expect(history.push).not.toHaveBeenCalled();
    });

    it('should show confirmation window when cancel changes', () => {
        const [wrapper, props] = init({ project: {} }, true);
        const textField = wrapper.find(TextField);
        textField.at(0).simulate('change', {
            target: { name: 'name', value: 'test' },
            persist: jest.fn()
        });
        wrapper.find(FormWrapper).simulate('cancel');
        expect(props.confirmationWindow).toBeCalled();
        expect(history.push).not.toHaveBeenCalled();
    });

    it('should calls handleChangeLimits function', () => {
        const [wrapper, _] = init({ project: { editable: true } }, true);
        wrapper
            .find(LimitsField)
            .at(0)
            .prop('handleChangeLimits')({
            target: { id: 'requestsCpu', value: '1' },
            persist: jest.fn()
        });
        expect(
            wrapper
                .find(LimitsField)
                .at(0)
                .prop('card').requestsCpu
        ).toEqual('1');
    });

    it('should render DATABRICKS content', () => {
        Object.defineProperty(window, 'PLATFORM', {
            value: DATABRICKS
        });
        const [wrapper] = init();

        expect(wrapper.find(FormWrapper).exists()).toBeTruthy();
    });

    it('should handle "onSubmit" with DATABRICKS fields', () => {
        Object.defineProperty(window, 'PLATFORM', {
            value: DATABRICKS
        });
        const [wrapper, props] = init({ project: {} }, true);

        wrapper.find(FormWrapper).simulate('submit');

        expect(props.update).toHaveBeenCalled();
    });

    it('should show errors for DATABRICKS fields', () => {
        Object.defineProperty(window, 'PLATFORM', {
            value: DATABRICKS
        });

        const [wrapper, props] = init(
            {
                project: {
                    name: 'na',
                    description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. 
                Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes,
                nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem.
                Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu.
                In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.
                Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet.
                Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.
                Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.
                Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante tincidunt tempus.
                Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt.
                Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.
                Sed consequat, leo eget bibendum sodales, augue velit cursus nunc, quis gravida magna mi a libero. Fusce vulputate eleifend sapien.
                Vestibulum purus quam, scelerisque ut, mollis sed, nonummy id, metus. Nullam accumsan lorem in dui.
                Cras ultricies mi eu turpis hendrerit fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
                In ac dui quis mi consectetuer lacinia. Nam pretium turpis et arcu.
                Duis arcu tortor, suscipit eget, imperdiet nec, imperdiet iaculis, ipsum. Sed aliquam ultrices mauris.
                Integer ante arcu, accumsan a, consectetuer eget, posuere ut, mauris. Praesent adipiscing. Phasellus ullamcorper ipsum rutrum nunc.
                Nunc nonummy metus. Vestibulum volutpat pretium libero. Cras id dui. Aenean ut eros et nisl sagittis vestibulum.
                Nullam nulla eros, ultricies sit amet, nonummy id, imperdiet feugiat, pede. Sed lectus. Donec mollis hendrerit risus.
                Phasellus nec sem in justo pellentesque facilisis. Etiam imperdiet imperdiet orci. Nunc nec neque.
                Phasellus leo dolor, tempus non, auctor et, hendrerit quis, nisi. Curabitur ligula sapien, tincidunt non, euismod vitae, posuere imperdiet, leo.
                Maecenas malesuada. Praesent congue erat at massa. Sed cursus turpis vitae tortor. Donec posuere vulputate arcu.
                Phasellus accumsan cursus velit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
                Sed aliquam, nisi quis porttitor congue, elit erat euismod orci, ac placerat dolor lectus quis orci. Phasellus consectetuer vestibulum elit.
                Aenean tellus metus, bibendum sed, posuere ac, mattis non, nunc. Vestibulum fringilla pede sit amet augue. In turpis. Pellentesque posuere.
                Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus.
                Donec elit libero, sodales nec, volutpat a, suscipit non, turpis. Nullam sagittis.
                Suspendisse pulvinar, augue ac venenatis condimentum, sem libero volutpat nibh, nec pellentesque velit pede quis nunc.
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Ut varius tincidunt libero.
                Phasellus dolor. Maecenas vestibulum mollis diam. Pellentesque ut neque.
                Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. In dui magna.
                Praesent turpis. Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna dolor sagittis lacus.`,
                    host: 'https',
                    personalAccessToken: 1,
                    pathToFile: 'dbfs'
                }
            },
            true
        );
        expect(wrapper.find(FormWrapper).exists()).toBeTruthy();
    });

    it('should activate editMode', () => {
        Object.defineProperty(window, 'PLATFORM', {
            value: DATABRICKS
        });

        const [wrapper, props] = init(
            {
                project: {
                    name: 'name',
                    description: '',
                    host: 'https://ololo.com:8080',
                    personalAccessToken: 'safkahfsdfkhsvjhgckjvsdlkfekju',
                    pathToFile: 'dbfs:/ololo',
                    editable: true
                }
            },
            true
        );
        wrapper
            .find(FormWrapper)
            .dive()
            .find(CardHeader)
            .dive()
            .dive()
            .find(Avatar)
            .simulate('click');
        expect(wrapper.find(FormWrapper).exists()).toBeTruthy();
    });
});

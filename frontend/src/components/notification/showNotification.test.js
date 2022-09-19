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

import showNotification from './showNotification';
import {
    enqueueSnackbar,
    closeSnackbar
} from '../../redux/actions/notificationsActions';
import { store } from '../../redux';
import { shallow } from 'enzyme';
import CloseIcon from '@material-ui/icons/Close';

jest.mock('../../redux/actions/notificationsActions', () => ({
    enqueueSnackbar: jest.fn(),
    closeSnackbar: jest.fn()
}));

jest.mock('../../redux', () => ({
    store: {
        dispatch: jest.fn()
    }
}));

describe('showNotification', () => {
    it('should call store dispatch', () => {
        enqueueSnackbar.mockImplementation(x => x);
        closeSnackbar.mockImplementation(x => x);

        showNotification('message', 'variant', true);

        const args = store.dispatch.mock.calls[0][0];

        expect(store.dispatch).toHaveBeenCalled();
        expect(args.message).toBe('message');
        expect(args.options.variant).toBe('variant');
        expect(args.options.persist).toBe(true);

        const btn = shallow(args.options.action('key'));

        expect(btn.find(CloseIcon).exists()).toBeTruthy();

        btn.simulate('click');

        expect(store.dispatch.mock.calls[1][0]).toBe('key');
    });
});

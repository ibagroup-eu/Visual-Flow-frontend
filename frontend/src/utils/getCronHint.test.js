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

import getCronHint from './getCronHint';

describe('getCronHint', () => {
    it('should work with star signs', () => {
        expect(getCronHint('1 * * * *')).toEqual('"At minute 1 by UTC time"');
        expect(getCronHint('* 1 * * *')).toEqual(
            '"At every minute past hour 1 by UTC time"'
        );
        expect(getCronHint('* * 1 * *')).toEqual(
            '"At every minute on day-of-month 1 by UTC time"'
        );
        expect(getCronHint('* * * 1 *')).toEqual(
            '"At every minute   in January by UTC time"'
        );
        expect(getCronHint('* * * * 1')).toEqual(
            '"At every minute  on Monday by UTC time"'
        );
    });

    it('should work with number values', () => {
        expect(getCronHint('1 1 1 1 1')).toEqual(
            '"At 01:01 on day-of-month 1 on Monday in January by UTC time"'
        );
    });

    it('should work with extra spaces', () => {
        expect(getCronHint(' 1 1 1  1    1 ')).toEqual(
            '"At 01:01 on day-of-month 1 on Monday in January by UTC time"'
        );
    });

    it('should work with value lists', () => {
        expect(getCronHint('1,2 3,4 5,6 7,8,9 0,1')).toEqual(
            '"At minute 1 and 2 past hour 3 and 4 on day-of-month 5 and 6 on Sunday and Monday in July, August and September by UTC time"'
        );
    });

    it('should work with ranges of values', () => {
        expect(getCronHint('0-59 2-5 5-5 * *')).toEqual(
            '"At every minute from 0 through 59 past every hour from 2 through 5 on every day-of-month from 5 through 5 by UTC time"'
        );
        expect(getCronHint('* * * 2-5 2-5')).toEqual(
            '"At every minute  on every day-of-week from Tuesday through Friday in every month from February through May by UTC time"'
        );
    });

    it('should work with all types of step values', () => {
        expect(getCronHint('2/5 2/5 2/5 * *')).toEqual(
            '"At every 5th minute from 2 through 59 past every 5th hour from 2 through 23 on every 5th day-of-month from 2 through 31 by UTC time"'
        );
        expect(getCronHint('* * * 2/5 2/5')).toEqual(
            '"At every minute  on every 5th day-of-week from Tuesday through Saturday in every 5th month from February through December by UTC time"'
        );
        expect(getCronHint('*/3,5/2 * * * *')).toEqual(
            '"At every 3rd minute and every 2nd minute from 5 through 59 by UTC time"'
        );
        expect(getCronHint('* 2-5/5 * * *')).toEqual(
            '"At every minute past every 5th hour from 2 through 5 by UTC time"'
        );
    });

    it('should work with star sign in complex values', () => {
        expect(getCronHint('* * 3,*,6-8 * *')).toEqual(
            '"At every minute on day-of-month 3, every day-of-month and every day-of-month from 6 through 8 by UTC time"'
        );
    });

    it('should work correctly with 1 in step values', () => {
        expect(getCronHint('* * 3/1 * *')).toEqual(
            '"At every minute on every day-of-month from 3 through 31 by UTC time"'
        );
    });
});

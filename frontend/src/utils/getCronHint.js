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

const STAR_SIGN = '*';
const ZERO = '0';

const TYPES = {
    MINUTE: 'minute',
    HOUR: 'hour',
    DAY_OF_MONTH: 'day-of-month',
    MONTH: 'month',
    DAY_OF_WEEK: 'day-of-week'
};

export const dayOfWeekData = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];
const monthData = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];
const numbersData = Array.from(Array(60).keys()).map(num => num.toString());

const computeStepStart = (start, valueNames, valueType) => {
    let startHint = '';

    const getValueOrNumber = initial => {
        if (valueType === TYPES.MONTH || valueType === TYPES.DAY_OF_WEEK) {
            return valueNames[initial];
        }
        return initial;
    };

    if (+start) {
        let end = valueNames[valueNames.length - 1];
        if (valueType === TYPES.DAY_OF_MONTH) {
            end = '31';
        } else if (valueType === TYPES.HOUR) {
            end = '23';
        }
        startHint = `from ${getValueOrNumber(start)} through ${end}`;
    } else if (start.includes('-')) {
        const parsedGap = start.split('-');
        startHint = `from ${getValueOrNumber(
            parsedGap[0]
        )} through ${getValueOrNumber(parsedGap[1])}`;
    }

    return startHint;
};

const computeNumberEnding = rotation => {
    if (+rotation === 2) {
        return 'nd';
    }
    if (+rotation === 3) {
        return 'rd';
    }
    return 'th';
};

const computeStepValues = (valueWithStep, valueNames, valueType) => {
    const [start, rotation] = valueWithStep.split('/');
    const startHint = computeStepStart(start, valueNames, valueType);
    const ending = computeNumberEnding(rotation);
    return `every ${
        +rotation === 1 ? '' : `${rotation}${ending} `
    }${valueType} ${startHint}`.trim();
};

const addItemsSeparators = (itemIndex, itemsCount) => {
    if (itemIndex === itemsCount - 2) {
        return ' and ';
    }
    if (itemIndex !== itemsCount - 1) {
        return ', ';
    }
    return '';
};

const addValueTypeConditionally = (valueIndex, valueType, addExtraType) => {
    if (valueIndex === 0 && addExtraType) {
        return `${valueType} `;
    }
    return '';
};

const computeValueInfo = (
    value,
    valueType,
    valueNames,
    preposition,
    addExtraType
) => {
    let res = '';

    if (+value) {
        res = `${preposition} ${
            addExtraType ? `${valueType} ` : ''
        }${valueNames.find((_, i) => i === +value)}`;
    } else if (value !== STAR_SIGN) {
        const parsedValue = value.split(',');
        const len = parsedValue.length;

        parsedValue.forEach((curValue, index) => {
            index === 0 && (res += `${preposition} `);

            if (curValue === STAR_SIGN) {
                res += `every ${valueType}`;
            } else if (curValue.includes('/')) {
                res += computeStepValues(curValue, valueNames, valueType);
            } else if (curValue.includes('-')) {
                const interval = curValue.split('-');
                res += `every ${valueType} from ${valueNames[interval[0]]} through ${
                    valueNames[interval[1]]
                }`;
            } else {
                res += addValueTypeConditionally(index, valueType, addExtraType);
                res += valueNames[+curValue];
            }

            res += addItemsSeparators(index, len);
        });
    }

    return res;
};

const getCronHint = cronInput => {
    const cron = cronInput.split(' ').filter(el => el.length);

    const dayOfWeek = computeValueInfo(
        cron[4],
        TYPES.DAY_OF_WEEK,
        dayOfWeekData,
        'on',
        false
    );

    const month = computeValueInfo(cron[3], TYPES.MONTH, monthData, 'in', false);

    const dayOfMonth = computeValueInfo(
        cron[2],
        TYPES.DAY_OF_MONTH,
        numbersData,
        'on',
        true
    );

    const isSimpleValue = cronItem => !/\D/.test(cronItem);

    let minuteHour = '';
    if (isSimpleValue(cron[0]) && isSimpleValue(cron[1])) {
        minuteHour = `At ${cron[1].padStart(2, ZERO)}:${cron[0].padStart(2, ZERO)}`;
    } else {
        let minute = '';
        let hour = '';

        if (cron[0] === STAR_SIGN) {
            minute = 'At every minute';
        } else if (isSimpleValue(cron[0])) {
            minute = `At minute ${cron[0]}`;
        } else {
            minute = computeValueInfo(
                cron[0],
                TYPES.MINUTE,
                numbersData,
                'At',
                true
            );
        }

        if (isSimpleValue(cron[1])) {
            hour = `past hour ${cron[1]}`;
        } else if (cron[1] !== STAR_SIGN) {
            hour = computeValueInfo(cron[1], TYPES.HOUR, numbersData, 'past', true);
        }

        minuteHour = `${minute} ${hour}`.trim();
    }

    const date = `${minuteHour} ${dayOfMonth} ${dayOfWeek} ${month} `;
    return `"${date.trim()} by UTC time"`;
};

export default getCronHint;

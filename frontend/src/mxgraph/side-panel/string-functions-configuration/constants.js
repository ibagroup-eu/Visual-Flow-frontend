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

export const STR_FUNCTION_TYPES = [
    { value: 'ascii', label: 'ascii' },
    { value: 'base64', label: 'base64' },
    { value: 'concat_ws', label: 'concat_ws' },
    { value: 'decode', label: 'decode' },
    { value: 'encode', label: 'encode' },
    { value: 'format_number', label: 'format_number' },
    { value: 'format_string', label: 'format_string' },
    { value: 'title_case', label: 'title_case' },
    { value: 'instr', label: 'instr' },
    { value: 'length', label: 'length' },
    { value: 'lower', label: 'lower' },
    { value: 'locate', label: 'locate' },
    { value: 'lpad', label: 'lpad' },
    { value: 'ltrim', label: 'ltrim' },
    { value: 'regexp_extract', label: 'regexp_extract' },
    { value: 'unbase64', label: 'unbase64' },
    { value: 'rpad', label: 'rpad' },
    { value: 'repeat', label: 'repeat' },
    { value: 'rtrim', label: 'rtrim' },
    { value: 'split', label: 'split' },
    { value: 'substring', label: 'substring' },
    { value: 'substring_index', label: 'substring_index' },
    { value: 'trim', label: 'trim' },
    { value: 'upper', label: 'upper' }
];

export const ASCII = 'ascii';
export const BASE64 = 'base64';
export const TITLE_CASE = 'title_case';
export const LENGTH = 'length';
export const LOWER = 'lower';
export const UNBASE64 = 'unbase64';
export const UPPER = 'upper';
export const CONCAT_WS = 'concat_ws';
export const DECODE = 'decode';
export const ENCODE = 'encode';
export const FORMAT_NUMBER = 'format_number';
export const FORMAT_STRING = 'format_string';
export const INSTR = 'instr';
export const LOCATE = 'locate';
export const LPAD = 'lpad';
export const RPAD = 'rpad';
export const REGEXP_EXTRACT = 'regexp_extract';
export const SUBSTRING = 'substring';
export const SUBSTRING_INDEX = 'substring_index';
export const LTRIM = 'ltrim';
export const REPEAT = 'repeat';
export const SPLIT = 'split';
export const TRIM = 'trim';
export const RTRIM = 'rtrim';

export const CHARSET_VALUES = [
    {
        value: 'US-ASCII',
        label: 'US-ASCII'
    },
    {
        value: 'ISO-8859-1',
        label: 'ISO-8859-1'
    },
    {
        value: 'UTF-8',
        label: 'UTF-8'
    },
    {
        value: 'UTF-16BE',
        label: 'UTF-16BE'
    },
    {
        value: 'UTF-16LE',
        label: 'UTF-16LE'
    },
    {
        value: 'UTF-16',
        label: 'UTF-16'
    }
];

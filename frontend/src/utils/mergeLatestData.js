import { keyBy, merge, uniqBy } from 'lodash';

export const mergeLatestData = (existingData, newData) => {
    const existingDataMap = keyBy(existingData, 'id');
    const newDataMap = keyBy(newData, 'id');

    const mergedDataMap = merge({}, existingDataMap, newDataMap);

    return uniqBy(Object.values(mergedDataMap), 'id');
};

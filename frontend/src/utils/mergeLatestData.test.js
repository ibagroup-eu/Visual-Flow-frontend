import { mergeLatestData } from './mergeLatestData';

describe('mergeLatestData', () => {
    it('should merge and deduplicate data by id', () => {
        const existingData = [
            { id: '1', value: 'oldValue1' },
            { id: '2', value: 'oldValue2' }
        ];
        const newData = [
            { id: '2', value: 'newValue2' },
            { id: '3', value: 'newValue3' }
        ];

        const result = mergeLatestData(existingData, newData);

        expect(result).toEqual([
            { id: '1', value: 'oldValue1' },
            { id: '2', value: 'newValue2' },
            { id: '3', value: 'newValue3' }
        ]);
    });

    it('should return only existing data if newData is empty', () => {
        const existingData = [
            { id: '1', value: 'oldValue1' },
            { id: '2', value: 'oldValue2' }
        ];
        const newData = [];

        const result = mergeLatestData(existingData, newData);

        expect(result).toEqual(existingData);
    });

    it('should return only new data if existingData is empty', () => {
        const existingData = [];
        const newData = [
            { id: '1', value: 'newValue1' },
            { id: '2', value: 'newValue2' }
        ];

        const result = mergeLatestData(existingData, newData);

        expect(result).toEqual(newData);
    });

    it('should handle completely unique data', () => {
        const existingData = [
            { id: '1', value: 'oldValue1' },
            { id: '2', value: 'oldValue2' }
        ];
        const newData = [
            { id: '3', value: 'newValue3' },
            { id: '4', value: 'newValue4' }
        ];

        const result = mergeLatestData(existingData, newData);

        expect(result).toEqual([
            { id: '1', value: 'oldValue1' },
            { id: '2', value: 'oldValue2' },
            { id: '3', value: 'newValue3' },
            { id: '4', value: 'newValue4' }
        ]);
    });

    it('should prioritize newData values when ids conflict', () => {
        const existingData = [{ id: '1', value: 'oldValue1' }];
        const newData = [{ id: '1', value: 'newValue1' }];

        const result = mergeLatestData(existingData, newData);

        expect(result).toEqual([{ id: '1', value: 'newValue1' }]);
    });
});

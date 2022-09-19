import { render } from 'enzyme';
import getMenuItems from './getMenuItems';

describe('getMenuItems', () => {
    const values = [
        {
            value: 'one'
        },
        {
            value: 'two'
        }
    ];

    it('should render without crashes', () => {
        render(getMenuItems(values));
    });
});

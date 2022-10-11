module.exports = {
    createClient: jest.fn().mockImplementation(() => ({
        on: jest.fn()
    }))
};

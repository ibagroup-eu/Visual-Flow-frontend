// const getHeaderToUpper = data =>
//     Object.keys(data[0]).map(el => [el[0].toUpperCase(), ...el.slice(1)]);

const getHeader = data => Object.keys(data[0]).map(el => el);

// eslint-disable-next-line import/prefer-default-export
export { getHeader };

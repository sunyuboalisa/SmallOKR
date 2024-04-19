const colors = [
  '#fcf1f0',
  '#fccccb',
  '#bdb5e1',
  '#b0d992',
  '#f9d580',
  '#99b0e9',
];
export const getColor = (index: number) => {
  const len = colors.length;
  if (len !== 0) {
    let inde = index % len;
    return colors[inde];
  }
  return 'white';
};

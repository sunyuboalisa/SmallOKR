const colors = [
  '#ffffd2',
  '#fcbad3',
  '#aa96da',
  '#a8d8ea',
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

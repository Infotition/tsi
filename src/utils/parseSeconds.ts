/**
 * It takes an array of two numbers, the first being the number of seconds and the second being the
 * number of nanoseconds, and returns a string of the total number of seconds with two decimal places.
 */
export const parseSeconds = (hrtime: [number, number]) => {
  return (hrtime[0] + hrtime[1] / 1e9).toFixed(2);
};

export const startInterval = (callback, time) => {
  callback();
  return setInterval(callback, time);
};

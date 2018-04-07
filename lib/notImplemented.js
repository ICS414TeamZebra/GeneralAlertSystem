module.exports = (name => (
  (fn) => {
    console.log(`${name}.${fn}: not implemented`);
  }
));

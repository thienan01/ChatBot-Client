function uniqueID() {
  return Math.floor(Math.random() * Date.now()).toString();
}
export default uniqueID;

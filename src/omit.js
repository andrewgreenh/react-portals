export default function omit(object, key) {
  const copied = Object.assign({}, object);
  delete copied[key];
  return copied;
}

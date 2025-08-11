export default function merge(a, b) {
  if (b) {
    for (const k in b) {
      a[k] = b[k];
    }
  }
  return a;
}

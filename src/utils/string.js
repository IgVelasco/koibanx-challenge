exports.containsOnlyNumbers = str => {
  return /^(\d+.)*(\d+)$/.test(str)
}

function json2array(json: any):Array<string> {
  var result: Array<string> = []
  var keys = Object.keys(json)
  keys.forEach((key) => {
    result.push(json[key])
  })
  return result
}


export { json2array}

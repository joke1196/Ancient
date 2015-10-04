function getFile(level) {
  var client = new XMLHttpRequest();
  client.open('GET', 'assets/map/' + level, false);
  client.onreadystatechange = function() {
    return client.responseText;
  }
  client.send();
  return parserMap(client.onreadystatechange());
}

function parserMap(txtData) {
  var jsonData = JSON.parse(txtData);
  console.log(jsonData);
  return jsonData.map;
}

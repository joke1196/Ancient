function getFile(level) {
  var client = new XMLHttpRequest();
  client.open('GET', 'map/' + level, false);
  client.onreadystatechange = function() {
    return client.responseText;
  }
  client.send();
  return parserMap(client.onreadystatechange());
}

function parserMap(txtData) {
  var map = txtData.split(/\r?\n/);
  var mapArray = [];
  for (var index in map) {
    mapArray.push(map[index].split(","));
  }
  return mapArray;
}

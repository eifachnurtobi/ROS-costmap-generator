var scaleVal = 1000000

var triangleArray = new Array;
var markerArray = new Array;
var markerEnum = 0

function initMap() {

  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 19,
    center: {lat: 47.5291569, lng: 8.5840063},
    mapTypeId: 'satellite',
    streetViewControl: false
  });
  map.setTilt(0);
}

function getPolygonCoords(TriNum) {
var latLngArr = new Array
for(i= 0;triangleArray[TriNum].getPath().getAt(i);i++){
      NodeLatitude = triangleArray[TriNum].getPath().getAt(i).lat()
      NodeLongtitude = triangleArray[TriNum].getPath().getAt(i).lng()
      latLngArr.push(NodeLatitude)
      latLngArr.push(NodeLongtitude)
}
return latLngArr;
}

function getMaxMin(){
  AllArr = new Array
  LatArr = new Array
  LngArr = new Array

  for(var i = 0;triangleArray[i]; i++){
    AllArr = AllArr.concat(getPolygonCoords(i))
}

for(var x = 0; x < AllArr.length-1; x+=2){
  LatArr.push(AllArr[x])
  LngArr.push(AllArr[x+1])
}

var min = new google.maps.LatLng(Math.min.apply(Math, LatArr), Math.min.apply(Math, LngArr));
var latMax = new google.maps.LatLng(Math.max.apply(Math, LatArr), Math.min.apply(Math, LngArr));
var lngMax = new google.maps.LatLng(Math.min.apply(Math, LatArr), Math.max.apply(Math, LngArr));

var latDist = google.maps.geometry.spherical.computeDistanceBetween(min, latMax)*10
var lngDist = google.maps.geometry.spherical.computeDistanceBetween(min, lngMax)*10
return [latDist, lngDist, Math.min.apply(Math, LatArr), Math.min.apply(Math, LngArr), google.maps.geometry.spherical.computeDistanceBetween(min, new google.maps.LatLng((Math.min.apply(Math, LatArr)+0.00001),  Math.min.apply(Math, LngArr)))*100, google.maps.geometry.spherical.computeDistanceBetween(min, new google.maps.LatLng(Math.min.apply(Math, LatArr),  (Math.min.apply(Math, LngArr)+0.00001)))*100, Math.max.apply(Math, LatArr), Math.max.apply(Math, LngArr)]
}

function SetCenter(){
  var coords = prompt("Please input coordinates:", "");
  coords = coords.split(/[\s,]+/)
  NewCenter = new google.maps.LatLng(coords[0], coords[1]);
  if(isNaN(NewCenter.lat()+NewCenter.lng())){
    alert("Please enter valid coordinates.")
    return;
  }
  map.setCenter(NewCenter)
}

function draw(){

MaxMinArr = getMaxMin(); // [2]is minimum latitude [3]is minimum longtitude [4] is Latitude recalculation [5] is longtitude recalculation
var cnvs = document.getElementById('cnvs').getContext('2d')
cnvs.canvas.height= MaxMinArr[0]
cnvs.canvas.width= MaxMinArr[1]
//make BG black
cnvs.fillStyle="#000"
cnvs.rect(0, 0, cnvs.canvas.width, cnvs.canvas.height)
cnvs.fill()
//set color to white
cnvs.fillStyle = "#fff"
for(var i = 0;triangleArray[i];i++){
var LatLngArr = getPolygonCoords(i)
//Set stuff, New line and starting point, blah blah
cnvs.beginPath();
cnvs.moveTo(((LatLngArr[LatLngArr.length-1]-MaxMinArr[3])/100)*MaxMinArr[5]*scaleVal, cnvs.canvas.height-((LatLngArr[LatLngArr.length-2]-MaxMinArr[2])/100)*MaxMinArr[4]*scaleVal)

for(var b = 0; LatLngArr[b]; b+= 2){
//Recalculate lat and long
var ReLng = (((LatLngArr[b+1]-MaxMinArr[3])/100)*MaxMinArr[5])*scaleVal //Recalculated Longtitude, 1 = 10cm
var ReLat = cnvs.canvas.height-(((LatLngArr[b]-MaxMinArr[2])/100)*MaxMinArr[4])*scaleVal //Recalculated Latitude, 1 = 10cm
cnvs.lineTo(ReLng, ReLat)
}
cnvs.fill()
}

//Download image and waypoints.yaml
Download()

cnvs.canvas.height=0
cnvs.canvas.width=0
}

function Download(){

maxMin=getMaxMin()

for(var i = 0; markerArray[i]; i++){
  var markLat =markerArray[i].getPosition().lat()-maxMin[2]
  var markLng = markerArray[i].getPosition().lng()-maxMin[3]
if(markLat<maxMin[6]-maxMin[2] && markLat > 0 && markLng < maxMin[7]-maxMin[3] && markLng > 0){
}else{
  document.getElementById('cnvs').getContext('2d').canvas.height=0
  document.getElementById('cnvs').getContext('2d').canvas.width=0
  alert('Please place all of the markers in the robot\'s boundaries.')
  return;
}
}
//Get the first waypoints coordinates in pixels
if(markerArray[0] != undefined){
  var WayLatRec = ((((markerArray[0].getPosition().lat()-maxMin[2])/100)*maxMin[4])*scaleVal)
  var WayLngRec = ((((markerArray[0].getPosition().lng()-maxMin[3])/100)*maxMin[5])*scaleVal)
  // console.log(WayLatRec, WayLngRec)
  var stringly = ""
    for(var i = 1; i < markerArray.length; i++){
      if(markerArray[i] != undefined){
        stringly += markerArray[i].getPosition().lat() + "," + markerArray[i].getPosition().lng() + "\r\n";
      }
    };


    var WaypointName = FileAlert('Please enter a name for your waypoint file:', 'Waypoints')
    var waypoint = document.createElement('a');
    waypoint.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(stringly));
    waypoint.setAttribute('download', WaypointName+'.csv');
    waypoint.style.display = 'none';
    document.body.appendChild(waypoint);
    waypoint.click();
    document.body.removeChild(waypoint);

    var CostmapName = FileAlert('Please enter a name for your costmap:', 'Costmap')
    var download = document.createElement('a');
    download.setAttribute('href', document.getElementById('cnvs').toDataURL("image/png").replace("image/png", "image/octet-stream"));
    download.setAttribute('download', CostmapName+'.png');
    download.style.display = 'none';
    document.body.appendChild(download);
    download.click();
    document.body.removeChild(download);

    var setupYAML = 'image: '+CostmapName+'.png\r\nresolution: 0.1\r\norigin: [-'+WayLngRec/10+', -'+WayLatRec/10+', 0.0]\r\noccupied_thresh: 0.05\r\nfree_thresh: 0.95\r\nnegate: 0'

    var YamlName = FileAlert('Please enter a name for your settings file:', 'Settings')
    var Yaml = document.createElement('a');
    Yaml.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(setupYAML));
    Yaml.setAttribute('download', YamlName+'.yaml');
    Yaml.style.display = 'none';
    document.body.appendChild(Yaml);
    Yaml.click();
    document.body.removeChild(Yaml);
  }else{
    document.getElementById('cnvs').getContext('2d').canvas.height=0
    document.getElementById('cnvs').getContext('2d').canvas.width=0
    alert('Please specify at least one waypoint.\n(The first waypoint will be the starting position of the robot)')
  }
}

function NewPoly(){

  var c = map.getCenter();
  var newCoords = [
    {lat: c.lat(), lng: c.lng()},
    {lat: c.lat()+0.0004, lng: c.lng()},
    {lat: c.lat(), lng: c.lng()+0.0004},
  ];

   triangle = new google.maps.Polygon({
   paths: newCoords,
   editable: true,
   strokeColor: '#d10000',
   strokeOpacity: 0.8,
   strokeWeight: 2,
   fillColor: '#d10000',
   fillOpacity: 0.3
 });
    triangleArray.push(triangle)
   triangle.setMap(map);

  google.maps.event.addListener(triangle, 'rightclick', function(point) {
    tri = triangleArray.indexOf(this);
    triangleArray[tri].getPath().removeAt(point.vertex)
    if(triangleArray[tri].getPath().b.length == 1){
      triangleArray[tri].setPath([])
    }
});
}

function AddMarker(){

var marker = new google.maps.Marker({
      position: map.getCenter(),
      label: markerEnum.toString(),
      draggable: true,
      title:"Waypoint Nr." + markerEnum,
      zIndex: markerEnum
});

if(markerEnum == 0){
  var Image = {
    url: 'robotIco.png',
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(14, 43),
    scaledSize: new google.maps.Size(27, 43) 
  }
marker.setIcon(Image)
marker.setLabel('')
marker.setTitle('The robot')
}

markerArray.push(marker);
marker.setMap(map);



google.maps.event.addListener(marker, 'rightclick', function (point) {num = this.zIndex; delMarker(num)});
markerEnum++;
}

var delMarker = function (num){
  if(num == 0){
    alert("You cannot delete the Robot.")
    return;
  }
    marker = markerArray[num]; 
    delete markerArray[num]
    marker.setMap(null);
}

function FileAlert(Question, Default) {
    var Filename = prompt(Question, Default);
    if (Filename == null || Filename == "") {
        return Default;
    } else {
        return Filename;
    }
}
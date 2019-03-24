# What is this?
This is a utility, to create [costmaps](http://wiki.ros.org/costmap_2d) for ROS (Robot operating system) with google maps.

Costmaps provide a way of defining where the robot should navigate in the form of an occupancy grid. The costmap uses sensor data and information from the static map, this tool is designed to create, to store and update information about obstacles in the world.

[Live version](tobiis.online/Projects/RosMaps/)

## How to map
1. To create a new waypoint, click onto the ```New Waypoint``` button.

2. To create an allowed area for the robot, click on to the ```New Territory``` button.

3. You always need to have at least one waypoint on the map. (as you will notice by it's appearance, it is the starting position of the robot)

4. To remove a vertex or a waypoint, right click onto it.

5. To center the map to your location, click the ```Set Center``` button and enter your coordinates. Please format it 
 > latitude,longitude
 
 or
 > latitude longitude.

## Saving
1. Click onto the ```Save``` button.

2. You will be prompted 3 times, and asked for your preferred filenames:

  2:1. If you want to keep the default filenames, just click next.

  2:2. Please note, though, that if you already have the files in your download directory, the files will be saved under different names.

3. Your files should be ready to go!


## Specs & Customization
1. The default resolution is 1px = 10 centimeters. To change, go into the script.js file and replace the 'scaleVal' variable with a value of your choice.

  1:1. To lower the resolution, make the 'scaleVal' variable bigger. You can view the code for the resolution calculation on lines 75, 79 and 80.
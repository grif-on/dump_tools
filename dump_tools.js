/// <reference types="@mapeditor/tiled-api" />
/*
MIT License

Copyright (c) 2023 Grif_on

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

//Intended for use in Tiled 1.8.6

const remove_defaults_from_objects = tiled.registerAction("Remove properties with default values (objects)", function () {
    let map = tiled.activeAsset;
    map.macro("Remove properties with default values (objects)", function () {
        for (let i = 0; i < map.layerCount; i++) {
            current_layer = map.layerAt(i);
            if (current_layer.isObjectLayer) {                          //игнорировать необъектные слои
                if (current_layer.objects != null) {                    //на случай , если слой не будет иметь объектов вообще
                    current_layer.objects.forEach(function (processedObject) {
                        let originalProperties = processedObject.properties();
                        for (const [key, value] of Object.entries(originalProperties)) {
                            if (typeof (value) === "object" && value.toString().charAt(0) == "#" && value.toString().length == 7) continue //skip colors objects
                            processedObject.removeProperty(key); // remove property
                            let defaultProperty = processedObject.resolvedProperty(key)
                            if (defaultProperty !== value) {
                                processedObject.setProperty(key, value); //return property back only if it has non-default value
                            }
                        }
                    });
                }
            }
        }
    });
})

remove_defaults_from_objects.text = "Remove properties with default values (objects)";
// remove_defaults_from_objects.icon = "ext:icon.png";

tiled.extendMenu("Map", [
    { separator: true },
    { action: "Remove properties with default values (objects)", before: "Close" }
]);



const remove_builtins_from_objects = tiled.registerAction("Remove engine built-in properties (objects)", function () {
    let map = tiled.activeAsset;
    map.macro("Remove engine built-in properties (objects)", function () {
        let remove_speed_and_direction = tiled.confirm("Remove speed and direction properties too ? Direction is used as is by some objects (e.g. player and monsters will look only on right without it) !","Full clear ?")
        for (let i = 0; i < map.layerCount; i++) {
            current_layer = map.layerAt(i);
            if (current_layer.isObjectLayer) {                          //игнорировать необъектные слои
                if (current_layer.objects != null) {                    //на случай , если слой не будет иметь объектов вообще
                    current_layer.objects.forEach(function (processedObject) {
                        let properties = processedObject.properties();
                        for (const [key, value] of Object.entries(properties)) {
                            switch (key) {
                                case "xprevious":
                                case "yprevious":
                                case "xstart":
                                case "ystart":
                                case "alarm":
                                case "depth":
                                case "sprite_index":
                                case "image_alpha":
                                case "image_angle":
                                case "image_blend":
                                case "image_index":
                                case "image_speed":
                                case "mask_index":
                                case "sprite_width":
                                case "sprite_height":
                                case "sprite_xoffset":
                                case "sprite_yoffset":
                                case "image_number":
                                case "bbox_bottom":
                                case "bbox_left":
                                case "bbox_right":
                                case "bbox_top":
                                    processedObject.removeProperty(key);
                                    break;
                                case "direction":
                                case "speed":
                                    if (remove_speed_and_direction) processedObject.removeProperty(key);
                                    break;                          
                                default:
                                    break;
                            }
                        }
                    });
                }
            }
        }
    });
})

remove_builtins_from_objects.text = "Remove engine built-in properties (objects)";
// remove_builtins_from_objects.icon = "ext:icon.png";

tiled.extendMenu("Map", [
    { separator: true },
    { action: "Remove engine built-in properties (objects)", before: "Close" }
]);



const remove_non_json_values_from_objects_and_global = tiled.registerAction("Remove !!!non_json!!! properties (objects and global)", function () {
    let map = tiled.activeAsset;
    map.macro("Remove !!!non_json!!! properties (objects and global)", function () {
        for (let i = 0; i < map.layerCount; i++) {
            current_layer = map.layerAt(i);
            if (current_layer.isObjectLayer) {                          //игнорировать необъектные слои
                if (current_layer.objects != null) {                    //на случай , если слой не будет иметь объектов вообще
                    current_layer.objects.forEach(function (processedObject) {
                        let properties = processedObject.properties();
                        for (const [key, value] of Object.entries(properties)) {
                            if (key.endsWith("!!!ARRAY!!!")) processedObject.removeProperty(key);
                            if (key.endsWith("!!!UNDEFINED!!!")) processedObject.removeProperty(key);
                            if (key.endsWith("!!!INFINITY!!!")) processedObject.removeProperty(key);
                            if (key.endsWith("!!!NAN!!!")) processedObject.removeProperty(key);
                            if (key.endsWith("!!!STRUCT!!!")) processedObject.removeProperty(key);
                            if (key.endsWith("!!!METHOD!!!")) processedObject.removeProperty(key);
                            if (key.endsWith("!!!UNKNOWN!!!")) processedObject.removeProperty(key);
                        }
                    });
                }
            }
        }
        let properties = map.properties();
        for (const [key, value] of Object.entries(properties)) {
            if (key.endsWith("!!!ARRAY!!!")) map.removeProperty(key);
            if (key.endsWith("!!!UNDEFINED!!!")) map.removeProperty(key);
            if (key.endsWith("!!!INFINITY!!!")) map.removeProperty(key);
            if (key.endsWith("!!!NAN!!!")) map.removeProperty(key);
            if (key.endsWith("!!!STRUCT!!!")) map.removeProperty(key);
            if (key.endsWith("!!!METHOD!!!")) map.removeProperty(key);
            if (key.endsWith("!!!UNKNOWN!!!")) map.removeProperty(key);
        }
    });
})

remove_non_json_values_from_objects_and_global.text = "Remove !!!non_json!!! properties (objects and global)";
// remove_non_json_values_from_objects_and_global.icon = "ext:icon.png";

tiled.extendMenu("Map", [
    { separator: true },
    { action: "Remove !!!non_json!!! properties (objects and global)", before: "Close" }
]);



const about_dump_tools = tiled.registerAction("About dump tools", function () {
    let message = "\t     \"Dump tools\" by Grif_on .\n\
    Main purpose of thous tools is to automatize work with D'LIRIUM dubug/dump files .\n\
    But even if you made your map from scratch , you may found them useful .\n\
    \n\
    =====Remove properties with default values (objects)=====\n\
    This tool will itterate over all your objects and delete every property with same values as in object types .\n\
    Simply say - it will turn all dark properties in to grey if such property have default value .\n\
    Note , colors and enum properties are not affected .\n\
    \n\
    =====Remove engine built-in properties (objects)=====\n\
    This tool will itterate over all your objects and delete this list of properties [xprevious, yprevious, xstart, ystart, alarm, depth, sprite_index, image_alpha, image_angle, image_blend, image_index, image_speed, mask_index, sprite_width, sprite_height, sprite_xoffset, sprite_yoffset, image_number, bbox_bottom, bbox_left, bbox_right, bbox_top ] .\n\
    In most cases you don't need them , their role is to be just an helpfull information in the game full dump . But you can use this tool to remove direction property from all objects .\n\
    \n\
    =====Remove !!!non_json!!! properties (objects and global)=====\n\
    This tool will itterate over all your objects and delete any property wich ends with one of following [!!!ARRAY!!!, !!!UNDEFINED!!!, !!!INFINITY!!!, !!!NAN!!!, !!!STRUCT!!!, !!!METHOD!!!, !!!UNKNOWN!!!] .\n\
    Your map will never (and should not) have this properties , they appear only in full dump that created when game crashed . They have string type and altered names because tiled map format didn't support any of them .\n\
    \n\
    Github page of this script - https://github.com/grif-on/dump_tools .\n\n\
    This message also printed in to tiled console log .";
    tiled.log("=".repeat(123) + "\n" + message + "\n" + "=".repeat(123));
    tiled.alert(message, "About dump tools");
})

about_dump_tools.text = "About dump tools";
// about_dump_tools.icon = "ext:icon.png";

tiled.extendMenu("Map", [
    { separator: true },
    { action: "About dump tools", before: "Close" }
]);
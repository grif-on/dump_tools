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
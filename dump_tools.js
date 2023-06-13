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

const strip_off_all_default_values = tiled.registerAction("Strip off all default values", function () {
    let map = tiled.activeAsset;
    for (let i = 0; i < map.layerCount; i++) {
        current_layer = map.layerAt(i);
        if (current_layer.isObjectLayer) {                          //игнорировать необъектные слои
            if (current_layer.objects != null) {                    //на случай , если слой не будет иметь объектов вообще
                current_layer.objects.forEach(function (processedObject) {
                    let originalProperties = processedObject.properties();
                    for (const [key, value] of Object.entries(originalProperties)) {
                         tiled.log(typeof (value))
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
})

strip_off_all_default_values.text = "Strip off all default values";
// strip_off_all_default_values.icon = "ext:icon.png";

tiled.extendMenu("Map", [
    { separator: true },
    { action: "Strip off all default values", before: "Close" }
]);
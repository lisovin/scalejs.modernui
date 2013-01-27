/*global require*/
require({
    "paths":  {
        "jQuery":  "empty:",
        "knockout":  "empty:",
        "knockout-classBindingProvider":  "empty:",
        "knockout.mapping":  "empty:",
        "scalejs":  "Scripts/scalejs-0.1.13",
        "scalejs.mvvm":  "empty:",
        "text":  "Scripts/text"
    },
    "scalejs":  {
        "extensions":  [
            "scalejs.mvvm"
        ]
    }
}, ['scalejs.modernui']);

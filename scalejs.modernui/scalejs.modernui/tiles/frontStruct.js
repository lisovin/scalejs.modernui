/*global console,define,setTimeout*/
define(['scalejs!core'
], function (
    core
) {
    var has = core.object.has;

    function frontStruct() {
        var arr = [];

        //greater than comparison
        function isGreaterThan(point, otherPoint) {
            if (point.y > otherPoint.y) {
                return true;
            } else if (point.y === otherPoint.y && point.x > otherPoint.x) {
                return true;
            } else
                return false;
        }

        //less then comparison
        function isLessThan(point, otherPoint) {
            if (point.y < otherPoint.y)
                return true;
            if (point.y === otherPoint.y && point.x < otherPoint.x)
                return true;
            else
                return false;
        }

        //a binary search
        function binary(o, l, u) {
            var l = l ? l : 0,
                u = u || u === 0 ? u : arr.length - 1,
                m;

            if (u < l) return { found: false, index: u };
            m = (l + u) / 2 | 0;
            if (isGreaterThan(arr[m], o))
                return binary(o, l, m - 1);
            else if (isLessThan(arr[m], o))
                return binary(o, m + 1, u);
            else
                return { found: true, index: m };
        }

        //add a point to the array in sorted position
        function add(v) {
            if (v.width <= 0) return -1;
            if (arr.length === 0) {
                arr.push(v);
                return -1;
            }
            var r = binary(v);
            if (!r.found) {
                arr.splice(r.index + 1, 0, v);
            }
            return r.index + 1;
        }

        //finds a point in the array based on a condition
        function first(conditionFunc) {
            var conditionMet = false;
            for (var i = 0; i < arr.length; i++) {
                conditionMet = conditionFunc(arr[i]);
                if (conditionMet) break;
            }
            return conditionMet ? arr[i] : undefined;
        }

        //finds all points and returns them as an array based on a condition
        function find(conditionFunc) {
            var results = [];
            for (var i = 0; i < arr.length; i++) {
                if (conditionFunc(arr[i])) results.push(arr[i]);
            }
            return results;
        }

        //updates values. 
        function update(point, updatedVals) {
            var oldPoint = binary(point),
                newPoint;

            if (oldPoint.found) {
                //if x or y have changed, the old point must be removed
                //and new point must be inserted
                if (has(updatedVals.x) || has(updatedVals.y)) {
                    newPoint = arr[oldPoint.index];

                    newPoint.x = has(updatedVals.x) ? updatedVals.x : newPoint.x;
                    newPoint.y = has(updatedVals.y) ? updatedVals.y : newPoint.y;
                    newPoint.width = has(updatedVals.width) ? updatedVals.width : newPoint.width;

                    arr.splice(oldPoint.index, 1);
                    add(newPoint);
                } //if x or y have not changed, the width will need to be updated
                else if (has(updatedVals.width)) {
                    if (updatedVals.width <= 0) arr.splice(oldPoint.index, 1);
                    else arr[oldPoint.index].width = updatedVals.width;
                }
            }
        }

        //returns the last insertion point
        function last() {
            return arr[arr.length - 1];
        }

        //prints the array
        function print() {
            var str = "";
            for (var i = 0; i < arr.length; i++) {
                str += "Point " + i + ": (" + arr[i].x / 150 + "," + arr[i].y / 150 + ") width: " + arr[i].width + "\n";
            }
            console.log(str);
        }

        return {
            add: add,
            first: first,
            find: find,
            update: update,
            last: last,
            print: print,
            arr: arr
        };
    }

    return frontStruct;
});
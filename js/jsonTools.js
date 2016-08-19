var list_1 = document.getElementById("list_1");
var list_2 = document.getElementById("list_2");
var resultBlockDiff = document.getElementById("result_block_diff");
var resultBlockOK = document.getElementById("result_block_ok");
resultBlockOK.style.display = 'none';
resultBlockDiff.style.display = 'none';
function generate() {

    resultBlockOK.style.display = 'none';
    resultBlockDiff.style.display = 'none';
    json_1 = document.getElementById("inputArea_1").value;
    json_2 = document.getElementById("inputArea_2").value;
    if (json_1.length == 0 || json_2.length == 0) {
        return;
    } else {
        var outObject1 = {};
        try {
            var jsonObject1 = JSON.parse(json_1);
            if (Object.prototype.toString.call(jsonObject1) === '[object Array]') {
                outObject1 = [];
                processJSONData(jsonObject1, outObject1, true);
            } else {
                outObject1 = {};
                processJSONData(jsonObject1, outObject1, false);
            }
//            processJSONData(
//                    JSON.parse(json_1), outObject1, false
//                    );
        } catch (e) {
            alert(e);
        }
        var outObject2 = {};
        try {
            var jsonObject2 = JSON.parse(json_2);
            if (Object.prototype.toString.call(jsonObject2) === '[object Array]') {
                outObject2 = [];
                processJSONData(jsonObject2, outObject2, true);
            } else {
                outObject2 = {};
                processJSONData(jsonObject2, outObject2, false);
            }
//            processJSONData(
//                    JSON.parse(json_2), outObject2, false
//                    );
        } catch (e) {
            alert(e);
        }

        while (list_1.firstChild) {
            list_1.removeChild(list_1.firstChild);
        }
        while (list_2.firstChild) {
            list_2.removeChild(list_2.firstChild);
        }
        compare(outObject1, outObject2, list_1,"root");
        compare(outObject2, outObject1, list_2,"root");

        if (list_1.firstChild || list_2.firstChild) {
            resultBlockDiff.style.display = '';
        } else {
            resultBlockOK.style.display = '';
        }

    }
}

var stack = [];
function getStack() {
    if (stack == null)
        return "";
    var result = "> ";
    for (var item in stack) {
        if (stack[item] == "0") {
            result = result + "> ";
        } else {
            result = result + stack[item] + " > ";
        }
    }
    return result;
}

function getInfoNode(errorName, key, comment) {
    var node = document.createElement("LI");
    var textnode = document.createTextNode(errorName + ": ");
    var element = document.createElement("b");
    element.innerHTML = getStack() + key;
    node.appendChild(textnode);
    node.appendChild(element);
    if (comment != null) {
        var commentElement = document.createElement("i");
        commentElement.innerHTML = " (" + comment + ")";
        node.appendChild(commentElement);
    }
    return node;
}

function compare(object_1, object_2, listContaner, key) {

    if (object_1 != null) {
        var type_1 = typeof object_1;
        if (object_2 == null) {
            listContaner.appendChild(getInfoNode("EXTRA FIELD", key));
        }
        else if (type_1 != typeof object_2) {
            listContaner.appendChild(getInfoNode("DIFFERENT FORMAT", key,
                    type_1 + ", not " + typeof object_2));
        }
        else if (type_1 == "object") {
            var isObj1Array = Object.prototype.toString.call(object_1) === '[object Array]';
            var isObj2Array = Object.prototype.toString.call(object_2) === '[object Array]';
            if (isObj1Array != isObj2Array) {
                listContaner.appendChild(getInfoNode("DIFFERENT FORMAT", key,
                        isObj1Array ? "array, not an object" : "object, not an array"));
            } else {
                for (var key in object_1) {
                    stack.push(key);
                    compare(object_1[ key ], object_2[key], listContaner, key);
                    stack.pop();
                }
            }

        }
        else {
            type_2 = typeof object_2[ key ]
            if (type_1 == "number") {
                var isObj1Int = isInt(object_1);
                var isObj2Int = isInt(object_2);
                if (isObj1Int != isObj2Int) {
                    listContaner.appendChild(getInfoNode("DIFFERENT FORMAT", key,
                            isObj1Int ? "int, not decimal" : "decimal, not int"));
                }
            }
        }
    }

}

//function compare(object_1, object_2, listContaner) {
//    for (var key in object_1) {
//        if (object_1[ key ] != null) {
//            var type_1 = typeof object_1[ key ];
//            if (object_2[key] == null) {
//                listContaner.appendChild(getInfoNode("EXTRA FIELD", key));
//            }
//            else if (type_1 != typeof object_2[ key ]) {
//                listContaner.appendChild(getInfoNode("DIFFERENT FORMAT", key,
//                type_1+", not "+typeof object_2[ key ]));
//            }
//            else if (type_1 == "object") {
//                var isObj1Array = Object.prototype.toString.call(object_1[key]) === '[object Array]';
//                var isObj2Array = Object.prototype.toString.call(object_2[key]) === '[object Array]';
//                if (isObj1Array != isObj2Array) {
//                    listContaner.appendChild(getInfoNode("DIFFERENT FORMAT", key,
//                            isObj1Array ? "array, not an object" : "object, not an array"));
//                } else {
//                    stack.push(key);
//                    compare(object_1[ key ], object_2[key], listContaner);
//                    stack.pop();
//                }
//
//            }
//            else {
//                type_2 = typeof object_2[ key ]
//                if (type_1 == "number") {
//                    var isObj1Int = isInt(object_1[ key ]);
//                    var isObj2Int = isInt(object_2[ key ]);
//                    if (isObj1Int != isObj2Int) {
//                        listContaner.appendChild(getInfoNode("DIFFERENT FORMAT", key,
//                                isObj1Int ? "int, not decimal" : "decimal, not int"));
//                    }
//                }
//            }
//        }
//    }
//}

function isInt(n) {
    return n % 1 === 0;
}
function getStandarizedValur(value) {
    var type = typeof value;
    if (type == "string") {
        return type;
    } else if (type == "number") {
        if (isInt(value)) {
            return 1;
        } else {
            return 1.12;
        }
    } else if (type == "boolean") {
        return true;
    }
}

function processJSONData(thisData, outData, isArray) {
    var data = thisData;
    // var thisList = document.createElement("ul");
    for (var key in data) {
        if (data[ key ] != null) {
            // var thisItem = document.createElement("li");
            var thisType = typeof data[ key ];
            if (thisType == "object") {
                var falseKey = key;
                if (isArray) {
                    //thisItem.appendChild(document.createTextNode(key));
                    falseKey = "0";
                    //outData[falseKey]=data[key];
                } else {
                    //thisItem.appendChild(document.createTextNode(key));
                }
                //outData[key]=data[key];
                if (Object.prototype.toString.call(data[key]) === '[object Array]') {
                    outData[key] = [];
                    //thisItem.appendChild(
                    processJSONData(data[ key ], outData[key], true);
                } else {
                    if (outData[falseKey] == null)
                        outData[falseKey] = {};
                    if (isArray) {
                        // thisItem.appendChild(
                        processJSONData(data[ key ], outData[falseKey], false);
                    } else {
                        // thisItem.appendChild(
                        processJSONData(data[ key ], outData[key], false);
                    }
                }
            }
            else {
                if (!isArray || key == "0")
                    outData[key] = getStandarizedValur(data[key]);
                //thisItem.appendChild(document.createTextNode(key + " : " + data[ key ] + " [" + thisType + "]"));
            }
            // thisList.appendChild(thisItem);
        }
    }
    // return thisList;
}

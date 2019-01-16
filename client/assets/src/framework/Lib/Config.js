// 全局表配置加载
let Config = {
    arrTables: [],
    csvTables: {},
    csvTableForArr: {},
    tableCast: {},
    tableComment: {},
    CELL_DELIMITERS: [",", ";", "\t", "|", "^"],
    LINE_DELIMITERS: ["\r\n", "\r", "\n"],
    // 动画--
    PageAnimation: {}
};

// [Min,Max],可以取到最大值与最小值
Config.randomNum = function(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range);
    return num;
};

Config.getTable = function(tableName) {
    return Config.csvTables[tableName];
};

Config.getTableArr = function(tableName) {
    return Config.csvTableForArr[tableName];
};

Config.queryOne = function(tableName, key, value) {
    var table = Config.getTable(tableName);
    if (!table) {
        return null;
    }

    if (key) {
        for (var tbItem in table) {
            if (!table.hasOwnProperty(tbItem)) {
                continue;
            }

            if (table[tbItem][key] === value) {
                return table[tbItem];
            }
        }
    } else {
        return table[value];
    }
};

Config.queryByID = function(tableName, ID) {
    return Config.queryOne(tableName, null, ID);
};

Config.queryAll = function(tableName, key, value) {
    var table = Config.getTable(tableName);
    if (!table || !key) {
        return null;
    }

    var ret = {};
    for (var tbItem in table) {
        if (!table.hasOwnProperty(tbItem)) {
            continue;
        }

        if (table[tbItem][key] === value) {
            ret[tbItem] = table[tbItem];
        }
    }

    return ret;
};

Config.loadConfigs = function(progressCb, callback) {

    // 加载动画
    cc.loader.loadResDir("panelAnimClips", cc.AnimationClip, function(err, clips) {
        if (err) {
            cc.error(err.message || err);
            return;
        }
        for (var i = 0; i < clips.length; i++) {
            Config.PageAnimation[clips[i].name] = clips[i];
        }
    });

    // 加载数据表
    var currentLoad = 0;
    Config.arrTables.forEach(function(tableName, index) {
        cc.loader.loadRes("data/" + tableName, function(err, content) {
            if (err) {
                cc.error(err.message || err);
                return;
            }
            if (progressCb) {
                progressCb(index + 1, Config.arrTables.length);
            }
            addTable(tableName, content);
            if (callback) {
                currentLoad++;
                if (currentLoad >= Config.arrTables.length) {
                    callback();
                }
            }
        });
    });

    function addTable(tableName, tableContent, force) {
        if (Config.csvTables[tableName] && !force) {
            return;
        }

        var tableData = {};
        var tableArr = [];
        var opts = {header: true};
        CSV.parse(tableContent, opts, function(row, keyname) {
            tableData[row[keyname]] = row;
            tableArr.push(row);
        });

        Config.tableCast[tableName] = CSV.opts.cast;
        Config.tableComment[tableName] = CSV.opts.comment;
        Config.csvTables[tableName] = tableData;
        Config.csvTableForArr[tableName] = tableArr;
    };

    function getterCast(value, index, cast, d) {

        if (cast instanceof Array) {
            if (cast[index] === "number") {
                return Number(d[index]);
            } else if (cast[index] === "boolean") {
                return d[index] === "true" || d[index] === "t" || d[index] === "1";
            } else {
                return d[index];
            }
        } else {
            if (!isNaN(Number(value))) {
                return Number(d[index]);
            } else if (value == "false" || value == "true" || value == "t" || value == "f") {
                return d[index] === "true" || d[index] === "t" || d[index] === "1";
            } else {
                return d[index];
            }
        }
    }
}

window.GConfig = Config;
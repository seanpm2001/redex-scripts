#!/usr/bin/env node
'use strict';

var Fs          = require("fs");
var NPMS        = require("./common/NPMS.js");
var Path        = require("path");
var Utils       = require("./common/Utils.js");
var Config      = require("./common/Config.js");
var Rebase      = require("@glennsl/rebase/src/Rebase.bs.js");
var Resync      = require("refetch/src/Resync.js");
var Package     = require("./common/Package.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.js");

require('isomorphic-fetch')
;

function getSources() {
  return Json_decode.field("published", (function (param) {
                return Json_decode.array(Json_decode.string, param);
              }), JSON.parse(Fs.readFileSync(Config.sourcesFile, "ascii")));
}

Rebase.$$Array[/* forEach */8]((function (source) {
        return Resync.Future[/* whenCompleted */6]((function (param) {
                      if (param.tag) {
                        console.log("\n", source, "\n", param[0]);
                        return /* () */0;
                      } else {
                        var data = param[0];
                        var json = JSON.stringify(Package.fromPublished(data));
                        var path = Path.join(Config.packageDir, encodeURIComponent(data[/* name */1]) + ".json");
                        return Utils.Fs[/* writeFile */2](path, json);
                      }
                    }), NPMS.get(source));
      }), getSources(/* () */0));

exports.getSources = getSources;
/*  Not a pure module */

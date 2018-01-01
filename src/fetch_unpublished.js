#!/usr/bin/env node
'use strict';

var Fs          = require("fs");
var Path        = require("path");
var Curry       = require("bs-platform/lib/js/curry.js");
var Utils       = require("./common/Utils.js");
var Config      = require("./common/Config.js");
var Rebase      = require("@glennsl/rebase/src/Rebase.bs.js");
var Resync      = require("refetch/src/Resync.js");
var Source      = require("./common/Source.js");
var Package     = require("./common/Package.js");
var Manifest    = require("./common/Manifest.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.js");

require('isomorphic-fetch')
;

function getSources() {
  return Json_decode.field("unpublished", (function (param) {
                return Json_decode.array(Json_decode.string, param);
              }), JSON.parse(Fs.readFileSync(Config.sourcesFile, "ascii")));
}

Rebase.$$Array[/* forEach */8]((function (source) {
        return Resync.Future[/* whenCompleted */6]((function (param) {
                      if (param.tag) {
                        console.log("\n", source, "\n", param[0]);
                        return /* () */0;
                      } else {
                        return /* () */0;
                      }
                    }), Utils.Future[/* >>= */0](Manifest.get(source), (function (manifest) {
                          return Utils.Future[/* >>= */0](Source.getReadme(source), (function (readme) {
                                        return Utils.Future[/* >>= */0](Source.getStats(source), (function (stats) {
                                                      var json = JSON.stringify(Package.fromUnpublished(source, manifest, readme, stats));
                                                      var path = Path.join(Config.packageDir, "unpublished", encodeURIComponent(Source.makeId(source)) + ".json");
                                                      return Curry._1(Utils.Future[/* return */1], Utils.Fs[/* writeFile */2](path, json));
                                                    }));
                                      }));
                        })));
      }), Rebase.$$Array[/* map */0](Source.parse, getSources(/* () */0)));

exports.getSources = getSources;
/*  Not a pure module */

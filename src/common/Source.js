// Generated by BUCKLESCRIPT VERSION 2.1.0, PLEASE EDIT WITH CARE
'use strict';

var Caml_array = require("bs-platform/lib/js/caml_array.js");
var Pervasives = require("bs-platform/lib/js/pervasives.js");

function looksLikeUrl(str) {
  if (str.startsWith("http://")) {
    return /* true */1;
  } else {
    return +str.startsWith("https://");
  }
}

function parseUrl(url) {
  if (url.includes("github.com")) {
    var segments = url.split("/");
    var length = segments.length;
    if (length < 2) {
      Pervasives.failwith("What the hell kind of a URL is this: " + url);
    }
    return /* Github */[
            Caml_array.caml_array_get(segments, length - 2 | 0),
            Caml_array.caml_array_get(segments, length - 1 | 0)
          ];
  } else {
    return Pervasives.failwith("Unknown URL: " + url);
  }
}

function looksLikeGitHubPath(str) {
  return +(str.split("/").length === 2);
}

function parseGitHubPath(path) {
  var match = path.split("/");
  if (match.length !== 2) {
    return Pervasives.failwith("???");
  } else {
    var user = match[0];
    var repo = match[1];
    return /* Github */[
            user,
            repo
          ];
  }
}

function parse(str) {
  if (looksLikeUrl(str)) {
    return parseUrl(str);
  } else if (looksLikeGitHubPath(str)) {
    return parseGitHubPath(str);
  } else {
    return Pervasives.failwith("Fuck if I know what this is: " + str);
  }
}

exports.looksLikeUrl        = looksLikeUrl;
exports.parseUrl            = parseUrl;
exports.looksLikeGitHubPath = looksLikeGitHubPath;
exports.parseGitHubPath     = parseGitHubPath;
exports.parse               = parse;
/* No side effect */

open Rebase;

type t = {.
  "type"          : string,
  "id"            : string,

  "name"          : string,
  "version"       : string,
  "description"   : string,
  "author"        : Js.nullable(string),
  "license"       : Js.nullable(string),
  "keywords"      : array(string),
  "readme"        : string,
  "analyzed"      : Js.Date.t,
  "updated"       : Js.Date.t,
  "stars"         : Js.nullable(int),
  "score"         : float,
  "quality"       : float,
  "popularity"    : float,
  "maintenance"   : float,
  "homepageUrl"   : Js.nullable(string),
  "repositoryUrl" : Js.nullable(string),
  "npmUrl"        : Js.nullable(string),
  "issuesUrl"     : Js.nullable(string),
  "docsUrl"       : Js.nullable(string),
};

external unsafeDecode : Js.Json.t => t = "%identity";
external encode : t => Js.Json.t = "%identity";

let normalizeKeyword = keyword =>
  switch (Js.String.toLowerCase(keyword)) {
  | "reasonml"  => "reason"
  | keyword     => keyword
  };

let fromPublished = (data: NPMS.t): t =>
  {
    "type"          : "published",
    "id"            : data.name,
    "name"          : data.name,
    "version"       : data.version,
    "description"   : data.description,
    "author"        : data.author         |> Js.Nullable.from_opt,
    "license"       : data.license        |> Js.Nullable.from_opt,
    "keywords"      : data.keywords       |> Option.getOr([||])
                                          |> Array.map(normalizeKeyword)
                                          |> Utils.filterDuplicates,
    "readme"        : data.readme         |> Option.getOr(""),
    "analyzed"      : data.analyzed,
    "updated"       : data.analyzed,
    "stars"         : data.stars          |> Js.Nullable.from_opt,
    "score"         : data.score,
    "quality"       : data.quality,
    "popularity"    : data.popularity,
    "maintenance"   : data.maintenance,
    "homepageUrl"   : data.homepageUrl    |> Js.Nullable.from_opt,
    "repositoryUrl" : data.repositoryUrl  |> Js.Nullable.from_opt,
    "npmUrl"        : data.npmUrl         |> Js.Nullable.from_opt,
    "issuesUrl"     : data.issuesUrl      |> Js.Nullable.from_opt,
    "docsUrl"       : Js.Nullable.null
  };

let fromUnpublished = (source: Source.t, manifest: Manifest.t, readme: string, stars: int): t =>
  {
    "type"          : "unpublished",
    "id"            : Source.makeId(source),
    "name"          : Source.makeName(source),
    "version"       : manifest.version,
    "description"   : manifest.description  |> Option.getOr(""),
    "author"        : manifest.author       |> Js.Nullable.from_opt,
    "license"       : manifest.license      |> Js.Nullable.from_opt,
    "keywords"      : manifest.keywords     |> Option.getOr([||])
                                            |> Array.map(normalizeKeyword)
                                            |> Utils.filterDuplicates,
    "readme"        : readme,
    "analyzed"      : Js.Date.make(),
    "updated"       : Js.Date.make(),
    "stars"         : Js.Nullable.return(stars),
    "score"         : 0.,
    "quality"       : 0.,
    "popularity"    : 0.,
    "maintenance"   : 0.,
    "homepageUrl"   : manifest.homepage     |> Js.Nullable.from_opt,
    "repositoryUrl" : Js.Nullable.return(Source.getRepositoryUrl(source)),
    "npmUrl"        : Js.Nullable.null,
    "issuesUrl"     : manifest.bugsUrl      |> Js.Nullable.from_opt,
    "docsUrl"       : Js.Nullable.null
  };

const CleanCSS = require("clean-css");

module.exports = function (eleventyConfig) {
  eleventyConfig.addLiquidFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });
  eleventyConfig.addCollection("experience", function (collection) {
    return collection.getAllSorted().filter(function (item) {
      return item.inputPath.match(/^\.\/experience\//) !== null;
    });
  });

  eleventyConfig.addCollection("awards", function (collection) {
    return collection.getAllSorted().filter(function (item) {
      return item.inputPath.match(/^\.\/awards\//) !== null;
    });
  });

  eleventyConfig.addCollection("skills", function (collection) {
    const skillset = collection
      .getAllSorted()
      .map((p) => p.data.skills)
      .filter((s) => Boolean(s))
      .flat();
    return [...new Set(skillset)];
  });

  eleventyConfig.setFrontMatterParsingOptions({
    workingDate: true,
    skills: true,
    order: true,
  });
};

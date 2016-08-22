(function() {

  'use strict';

  var imgutils = {};

  // global on the server, window in the browser
  var previous_imgutils;

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = typeof self === 'object' && self.self === self && self ||
      typeof global === 'object' && global.global === global && global ||
      this;

  if (root != null) {
    previous_imgutils = root.imgutils;
  }

  imgutils.noConflict = function () {
    root.imgutils = previous_imgutils;
    return imgutils;
  };

  //////////////////////////////

  // ImgUtils - shared code for image-related components.


  imgutils.scalingFactor = (intendedHeight, item) => intendedHeight / item.height;

  imgutils.getDimsForType = (w, h, computeType) => {
    let templateString = _.isEqual('style', computeType) ?
      'width: {w}px; height: {h}px;' : '{w}x{h}';
    return _.template(templateString)({w: w, h: h});
  };

  imgutils.scaledWidth = (item, intendedHeight) => Math.round(item.width * imgutils.scalingFactor(intendedHeight, item));

  imgutils.computeSquareDims = (item, intendedHeight, computeType) => imgutils.getDimsForType(intendedHeight, intendedHeight, computeType);

  imgutils.computeThumbDims = (item, intendedHeight, computeType) => {
    if (item.width <= 0 || item.height <= 0) {
      return imgutils.computeSquareDims(item, intendedHeight, computeType);
    }

    let scaledWidth = imgutils.scaledWidth(item, intendedHeight);
    return imgutils.getDimsForType(scaledWidth, intendedHeight, computeType);
  };

  imgutils.irsThumb = (config, dims, source) => {
    let template = '{irsBase}/1/process/{dims}?source={source}';
    return _.template(template)(_.extend({dims: dims, source: source}, config));
  };

  imgutils.irsDownload = (config, source) => {
    let template = '{irsBase}/1/download?source={source}';
    return _.template(template)(_.extend({source: source}, config));
  };

  imgutils.firstMediaItem = (article, typeOpt) => _.head(imgutils.mediaItems(article, typeOpt));

  imgutils.mediaItems = function(article, typeOpt) {
    console.info('hasMedia(typeOpt=%s)', typeOpt);
    if (imgutils.hasMedia(article)) {
      return _.filter(article.mediaList.mediaItems, {mediaType: typeOpt});
    } else {
      return [];
    }
  };

  imgutils.hasMedia = (article) => _.has(article, 'mediaList.mediaItems') && !_.isEmpty(_.head(article.mediaList.mediaItems));

  imgutils.hasImages = function(article) {
    let firstImageItem = imgutils.firstMediaItem(article, 'Image');
    return firstImageItem && !_.isEmpty(firstImageItem.references);
  };

  imgutils.firstMediaItemReference = (mediaItem) => _.head(mediaItem.references);

  //////////////////////////////

  // Node.js
  if (typeof module === 'object' && module.exports) {
    module.exports = imgutils;
  }
  // AMD / RequireJS
  else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return imgutils;
    });
  }
  // included directly via <script> tag
  else {
    root.imgutils = imgutils;
  }

})();

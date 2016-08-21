'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

(function () {

  'use strict';

  var imgutils = {};

  // global on the server, window in the browser
  var previous_imgutils;

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = (typeof self === 'undefined' ? 'undefined' : _typeof(self)) === 'object' && self.self === self && self || (typeof global === 'undefined' ? 'undefined' : _typeof(global)) === 'object' && global.global === global && global || this;

  if (root != null) {
    previous_imgutils = root.imgutils;
  }

  imgutils.noConflict = function () {
    root.imgutils = previous_imgutils;
    return imgutils;
  };

  //////////////////////////////

  // ImgUtils - shared code for image-related components.


  imgutils.scalingFactor = function (intendedHeight, item) {
    return intendedHeight / item.height;
  };

  imgutils.getDimsForType = function (w, h, computeType) {
    var templateString = _.isEqual('style', computeType) ? 'width: {w}px; height: {h}px;' : '{w}x{h}';
    return _.template(templateString)({ w: w, h: h });
  };

  imgutils.scaledWidth = function (item, intendedHeight) {
    return Math.round(item.width * imgutils.scalingFactor(intendedHeight, item));
  };

  imgutils.computeSquareDims = function (item, intendedHeight, computeType) {
    return imgutils.getDimsForType(intendedHeight, intendedHeight, computeType);
  };

  imgutils.computeThumbDims = function (item, intendedHeight, computeType) {
    if (item.width <= 0 || item.height <= 0) {
      return imgutils.computeSquareDims(item, intendedHeight, computeType);
    }

    var scaledWidth = imgutils.scaledWidth(item, intendedHeight);
    return imgutils.getDimsForType(scaledWidth, intendedHeight, computeType);
  };

  imgutils.irsThumb = function (config, dims, source) {
    var template = '{irsBase}/1/process/{dims}?source={source}';
    return _.template(template)(_.extend({ dims: dims, source: source }, config));
  };

  imgutils.irsDownload = function (config, source) {
    var template = '{irsBase}/1/download?source={source}';
    return _.template(template)(_.extend({ source: source }, config));
  };

  imgutils.firstMediaItem = function (article, typeOpt) {
    return _.head(imgutils.mediaItems(article, typeOpt));
  };

  imgutils.mediaItems = function (article, typeOpt) {
    console.info('hasMedia(typeOpt=%s)', typeOpt);
    if (imgutils.hasMedia(article)) {
      return _.filter(article.mediaList.mediaItems, { mediaType: typeOpt });
    } else {
      return [];
    }
  };

  imgutils.hasMedia = function (article) {
    return _.has(article, 'mediaList.mediaItems') && !_.isEmpty(_.head(article.mediaList.mediaItems));
  };

  imgutils.hasImages = function (article) {
    var firstImageItem = imgutils.firstMediaItem(article, 'Image');
    return firstImageItem && !_.isEmpty(firstImageItem.references);
  };

  imgutils.firstMediaItemReference = function (mediaItem) {
    return _.head(mediaItem.references);
  };

  //////////////////////////////

  // Node.js
  if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module.exports) {
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
//# sourceMappingURL=data:application/json;base64,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QUFnRDtBQUNuRCxhQUFPLEVBQVAsRUFBVyxZQUFZO0FBQ3JCLGVBQU8sUUFBUDtBQUNELE9BRkQ7QUFHRDtBQUNEO0FBTEssU0FNQTtBQUNILGFBQUssUUFBTCxHQUFnQixRQUFoQjtBQUNEO0FBRUYsQ0FsR0QiLCJmaWxlIjoic2NyaXB0cy9pbWd1dGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcblxuICAndXNlIHN0cmljdCc7XG5cbiAgdmFyIGltZ3V0aWxzID0ge307XG5cbiAgLy8gZ2xvYmFsIG9uIHRoZSBzZXJ2ZXIsIHdpbmRvdyBpbiB0aGUgYnJvd3NlclxuICB2YXIgcHJldmlvdXNfaW1ndXRpbHM7XG5cbiAgLy8gRXN0YWJsaXNoIHRoZSByb290IG9iamVjdCwgYHdpbmRvd2AgKGBzZWxmYCkgaW4gdGhlIGJyb3dzZXIsIGBnbG9iYWxgXG4gIC8vIG9uIHRoZSBzZXJ2ZXIsIG9yIGB0aGlzYCBpbiBzb21lIHZpcnR1YWwgbWFjaGluZXMuIFdlIHVzZSBgc2VsZmBcbiAgLy8gaW5zdGVhZCBvZiBgd2luZG93YCBmb3IgYFdlYldvcmtlcmAgc3VwcG9ydC5cbiAgdmFyIHJvb3QgPSB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcgJiYgc2VsZi5zZWxmID09PSBzZWxmICYmIHNlbGYgfHxcbiAgICAgIHR5cGVvZiBnbG9iYWwgPT09ICdvYmplY3QnICYmIGdsb2JhbC5nbG9iYWwgPT09IGdsb2JhbCAmJiBnbG9iYWwgfHxcbiAgICAgIHRoaXM7XG5cbiAgaWYgKHJvb3QgIT0gbnVsbCkge1xuICAgIHByZXZpb3VzX2ltZ3V0aWxzID0gcm9vdC5pbWd1dGlscztcbiAgfVxuXG4gIGltZ3V0aWxzLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgcm9vdC5pbWd1dGlscyA9IHByZXZpb3VzX2ltZ3V0aWxzO1xuICAgIHJldHVybiBpbWd1dGlscztcbiAgfTtcblxuICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuICAvLyBJbWdVdGlscyAtIHNoYXJlZCBjb2RlIGZvciBpbWFnZS1yZWxhdGVkIGNvbXBvbmVudHMuXG5cblxuICBpbWd1dGlscy5zY2FsaW5nRmFjdG9yID0gKGludGVuZGVkSGVpZ2h0LCBpdGVtKSA9PiBpbnRlbmRlZEhlaWdodCAvIGl0ZW0uaGVpZ2h0O1xuXG4gIGltZ3V0aWxzLmdldERpbXNGb3JUeXBlID0gKHcsIGgsIGNvbXB1dGVUeXBlKSA9PiB7XG4gICAgbGV0IHRlbXBsYXRlU3RyaW5nID0gXy5pc0VxdWFsKCdzdHlsZScsIGNvbXB1dGVUeXBlKSA/XG4gICAgICAnd2lkdGg6IHt3fXB4OyBoZWlnaHQ6IHtofXB4OycgOiAne3d9eHtofSc7XG4gICAgcmV0dXJuIF8udGVtcGxhdGUodGVtcGxhdGVTdHJpbmcpKHt3OiB3LCBoOiBofSk7XG4gIH07XG5cbiAgaW1ndXRpbHMuc2NhbGVkV2lkdGggPSAoaXRlbSwgaW50ZW5kZWRIZWlnaHQpID0+IE1hdGgucm91bmQoaXRlbS53aWR0aCAqIGltZ3V0aWxzLnNjYWxpbmdGYWN0b3IoaW50ZW5kZWRIZWlnaHQsIGl0ZW0pKTtcblxuICBpbWd1dGlscy5jb21wdXRlU3F1YXJlRGltcyA9IChpdGVtLCBpbnRlbmRlZEhlaWdodCwgY29tcHV0ZVR5cGUpID0+IGltZ3V0aWxzLmdldERpbXNGb3JUeXBlKGludGVuZGVkSGVpZ2h0LCBpbnRlbmRlZEhlaWdodCwgY29tcHV0ZVR5cGUpO1xuXG4gIGltZ3V0aWxzLmNvbXB1dGVUaHVtYkRpbXMgPSAoaXRlbSwgaW50ZW5kZWRIZWlnaHQsIGNvbXB1dGVUeXBlKSA9PiB7XG4gICAgaWYgKGl0ZW0ud2lkdGggPD0gMCB8fCBpdGVtLmhlaWdodCA8PSAwKSB7XG4gICAgICByZXR1cm4gaW1ndXRpbHMuY29tcHV0ZVNxdWFyZURpbXMoaXRlbSwgaW50ZW5kZWRIZWlnaHQsIGNvbXB1dGVUeXBlKTtcbiAgICB9XG5cbiAgICBsZXQgc2NhbGVkV2lkdGggPSBpbWd1dGlscy5zY2FsZWRXaWR0aChpdGVtLCBpbnRlbmRlZEhlaWdodCk7XG4gICAgcmV0dXJuIGltZ3V0aWxzLmdldERpbXNGb3JUeXBlKHNjYWxlZFdpZHRoLCBpbnRlbmRlZEhlaWdodCwgY29tcHV0ZVR5cGUpO1xuICB9O1xuXG4gIGltZ3V0aWxzLmlyc1RodW1iID0gKGNvbmZpZywgZGltcywgc291cmNlKSA9PiB7XG4gICAgbGV0IHRlbXBsYXRlID0gJ3tpcnNCYXNlfS8xL3Byb2Nlc3Mve2RpbXN9P3NvdXJjZT17c291cmNlfSc7XG4gICAgcmV0dXJuIF8udGVtcGxhdGUodGVtcGxhdGUpKF8uZXh0ZW5kKHtkaW1zOiBkaW1zLCBzb3VyY2U6IHNvdXJjZX0sIGNvbmZpZykpO1xuICB9O1xuXG4gIGltZ3V0aWxzLmlyc0Rvd25sb2FkID0gKGNvbmZpZywgc291cmNlKSA9PiB7XG4gICAgbGV0IHRlbXBsYXRlID0gJ3tpcnNCYXNlfS8xL2Rvd25sb2FkP3NvdXJjZT17c291cmNlfSc7XG4gICAgcmV0dXJuIF8udGVtcGxhdGUodGVtcGxhdGUpKF8uZXh0ZW5kKHtzb3VyY2U6IHNvdXJjZX0sIGNvbmZpZykpO1xuICB9O1xuXG4gIGltZ3V0aWxzLmZpcnN0TWVkaWFJdGVtID0gKGFydGljbGUsIHR5cGVPcHQpID0+IF8uaGVhZChpbWd1dGlscy5tZWRpYUl0ZW1zKGFydGljbGUsIHR5cGVPcHQpKTtcblxuICBpbWd1dGlscy5tZWRpYUl0ZW1zID0gZnVuY3Rpb24oYXJ0aWNsZSwgdHlwZU9wdCkge1xuICAgIGNvbnNvbGUuaW5mbygnaGFzTWVkaWEodHlwZU9wdD0lcyknLCB0eXBlT3B0KTtcbiAgICBpZiAoaW1ndXRpbHMuaGFzTWVkaWEoYXJ0aWNsZSkpIHtcbiAgICAgIHJldHVybiBfLmZpbHRlcihhcnRpY2xlLm1lZGlhTGlzdC5tZWRpYUl0ZW1zLCB7bWVkaWFUeXBlOiB0eXBlT3B0fSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gIH07XG5cbiAgaW1ndXRpbHMuaGFzTWVkaWEgPSAoYXJ0aWNsZSkgPT4gXy5oYXMoYXJ0aWNsZSwgJ21lZGlhTGlzdC5tZWRpYUl0ZW1zJykgJiYgIV8uaXNFbXB0eShfLmhlYWQoYXJ0aWNsZS5tZWRpYUxpc3QubWVkaWFJdGVtcykpO1xuXG4gIGltZ3V0aWxzLmhhc0ltYWdlcyA9IGZ1bmN0aW9uKGFydGljbGUpIHtcbiAgICBsZXQgZmlyc3RJbWFnZUl0ZW0gPSBpbWd1dGlscy5maXJzdE1lZGlhSXRlbShhcnRpY2xlLCAnSW1hZ2UnKTtcbiAgICByZXR1cm4gZmlyc3RJbWFnZUl0ZW0gJiYgIV8uaXNFbXB0eShmaXJzdEltYWdlSXRlbS5yZWZlcmVuY2VzKTtcbiAgfTtcblxuICBpbWd1dGlscy5maXJzdE1lZGlhSXRlbVJlZmVyZW5jZSA9IChtZWRpYUl0ZW0pID0+IF8uaGVhZChtZWRpYUl0ZW0ucmVmZXJlbmNlcyk7XG5cbiAgLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbiAgLy8gTm9kZS5qc1xuICBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGltZ3V0aWxzO1xuICB9XG4gIC8vIEFNRCAvIFJlcXVpcmVKU1xuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBpbWd1dGlscztcbiAgICB9KTtcbiAgfVxuICAvLyBpbmNsdWRlZCBkaXJlY3RseSB2aWEgPHNjcmlwdD4gdGFnXG4gIGVsc2Uge1xuICAgIHJvb3QuaW1ndXRpbHMgPSBpbWd1dGlscztcbiAgfVxuXG59KSgpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

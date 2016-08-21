'use strict';

window.addEventListener('WebComponentsReady', function () {

  // We use Page.js for routing. This is a Micro
  // client-side router inspired by the Express router
  // More info: https://visionmedia.github.io/page.js/

  // Removes end / from app.baseUrl which page.base requires for production
  if (window.location.port === '') {
    // if production
    page.base(app.baseUrl.replace(/\/$/, ''));
  }

  // Middleware
  function scrollToTop(ctx, next) {
    app.scrollPageToTop();
    next();
  }

  function closeDrawer(ctx, next) {
    //app.closeDrawer();
    next();
  }

  // Routes
  page('*', scrollToTop, closeDrawer, function (ctx, next) {
    next();
  });

  page('/', function () {
    app.route = 'home';
  });

  page(app.baseUrl, function () {
    app.route = 'home';
  });

  page('/configure', function (ctx) {
    console.info('ctx for config: ', ctx);

    var config = app.parseConfigFromQueryString(ctx.querystring);
    console.info('parsed config: ', config);

    app.saveConfig(config);

    if (config.launch) {
      console.warn('redirecting from launch=%s', config.launch);
      page.redirect(config.launch);
    } else {
      app.route = 'home';
    }
  });

  page('/search', function () {
    app.route = 'search';
  });

  page('/browse', function () {
    app.route = 'browse';
    app.browse = {
      page: 0,
      perPage: 10
    };
  });

  page('/browse/:page', function (ctx) {
    app.route = 'browse';
    app.params = ctx.params;
    var qparams = {};
    app.parseParams(ctx.querystring).map(function (tuple) {
      return qparams[tuple[0]] = tuple[1];
    });

    app.browse = {
      page: ctx.params.page,
      perPage: qparams.perPage ? qparams.perPage : 10
    };
  });

  page('/article/:contentKey', function (ctx) {
    app.route = 'articleLookup';
    app.params = ctx.params;
    app.$.lookupView.lookup();
  });

  // 404
  page('*', function (ctx) {
    //             http://johan-dev.afrozaar.com/#!/launch?\
    //                searchBase=http://johan.afrozaar.com/ashes-support
    //                &tk=sbp&appId=8
    //                &irsBase=http://johan-irs.afrozaar.com/image
    //                &contentBase=http://johan.afrozaar.com/ashes-web&launch=true
    // Can't find: http://johan-dev.afrozaar.com/#!/launch
    //        ?searchBase=http://johan.afrozaar.co…zaar.com/image
    //        &contentBase=http://johan.afrozaar.com/ashes-web
    //        &launch=true. Redirected you to Home Page

    console.error('couldnt parse location from ctx: ', ctx);

    if (ctx.path.startsWith('//')) {
      page.redirect(ctx.path.substr(1));
      return;
    }

    console.error('parsing hash from href: ', window.location.href);

    var hidx = window.location.href.indexOf('#');
    var qidx = window.location.href.indexOf('?');

    var hash;
    var qs;
    if (qidx > hidx) {
      // hash at start
      hash = window.location.href.substr(hidx, qidx - hidx);
    } else {
      // hash at end

      if (qidx >= 0) {
        hash = window.location.href.substr(hidx);
        qs = window.location.href.substr(qidx, hidx - qidx);
        var redr = hash.substr(hash.indexOf('/')) + qs;
        console.warn('hash: %s, qs: %s, redr: %s', hash, qs, redr);
        page.redirect(redr);
      } else {
        // no query string
        hash = window.location.href.substr(hidx);
        console.info('redr: ', hash.substr(hash.indexOf('/')));
      }

      return;
    }

    console.info('hidx: %s, qidx: %s, hash: %s, qs: %s', hidx, qidx, hash, qs);

    var message = 'Can\'t find: ' + window.location.href + '. Redirected you to Home Page';
    app.showToast(message, {}, true);
    page.redirect(app.baseUrl);
  });

  // add #! before urls
  page({
    hashbang: true
  });
});
//# sourceMappingURL=data:application/json;base64,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TCxDQUFhLEdBQWIsQ0FBWixDQUF2QjtBQUNEOztBQUVEO0FBQ0Q7O0FBRUQsWUFBUSxJQUFSLENBQWEsc0NBQWIsRUFBcUQsSUFBckQsRUFBMkQsSUFBM0QsRUFBaUUsSUFBakUsRUFBdUUsRUFBdkU7O0FBRUEsUUFBSSxVQUFVLGtCQUFrQixPQUFPLFFBQVAsQ0FBZ0IsSUFBbEMsR0FBMEMsK0JBQXhEO0FBQ0EsUUFBSSxTQUFKLENBQWMsT0FBZCxFQUF1QixFQUF2QixFQUEyQixJQUEzQjtBQUNBLFNBQUssUUFBTCxDQUFjLElBQUksT0FBbEI7QUFDRCxHQWpERDs7QUFtREE7QUFDQSxPQUFLO0FBQ0gsY0FBVTtBQURQLEdBQUw7QUFJRCxDQTFJSCIsImZpbGUiOiJlbGVtZW50cy9yb3V0aW5nLmpzIiwic291cmNlc0NvbnRlbnQiOlsid2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ1dlYkNvbXBvbmVudHNSZWFkeScsIGZ1bmN0aW9uKCkge1xuXG4gICAgLy8gV2UgdXNlIFBhZ2UuanMgZm9yIHJvdXRpbmcuIFRoaXMgaXMgYSBNaWNyb1xuICAgIC8vIGNsaWVudC1zaWRlIHJvdXRlciBpbnNwaXJlZCBieSB0aGUgRXhwcmVzcyByb3V0ZXJcbiAgICAvLyBNb3JlIGluZm86IGh0dHBzOi8vdmlzaW9ubWVkaWEuZ2l0aHViLmlvL3BhZ2UuanMvXG5cbiAgICAvLyBSZW1vdmVzIGVuZCAvIGZyb20gYXBwLmJhc2VVcmwgd2hpY2ggcGFnZS5iYXNlIHJlcXVpcmVzIGZvciBwcm9kdWN0aW9uXG4gICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5wb3J0ID09PSAnJykgeyAgLy8gaWYgcHJvZHVjdGlvblxuICAgICAgcGFnZS5iYXNlKGFwcC5iYXNlVXJsLnJlcGxhY2UoL1xcLyQvLCAnJykpO1xuICAgIH1cblxuICAgIC8vIE1pZGRsZXdhcmVcbiAgICBmdW5jdGlvbiBzY3JvbGxUb1RvcChjdHgsIG5leHQpIHtcbiAgICAgIGFwcC5zY3JvbGxQYWdlVG9Ub3AoKTtcbiAgICAgIG5leHQoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjbG9zZURyYXdlcihjdHgsIG5leHQpIHtcbiAgICAgIC8vYXBwLmNsb3NlRHJhd2VyKCk7XG4gICAgICBuZXh0KCk7XG4gICAgfVxuXG4gICAgLy8gUm91dGVzXG4gICAgcGFnZSgnKicsIHNjcm9sbFRvVG9wLCBjbG9zZURyYXdlciwgZnVuY3Rpb24oY3R4LCBuZXh0KSB7XG4gICAgICBuZXh0KCk7XG4gICAgfSk7XG5cbiAgICBwYWdlKCcvJywgZnVuY3Rpb24oKSB7XG4gICAgICBhcHAucm91dGUgPSAnaG9tZSc7XG4gICAgfSk7XG5cbiAgICBwYWdlKGFwcC5iYXNlVXJsLCBmdW5jdGlvbigpIHtcbiAgICAgIGFwcC5yb3V0ZSA9ICdob21lJztcbiAgICB9KTtcblxuICAgIHBhZ2UoJy9jb25maWd1cmUnLCBmdW5jdGlvbihjdHgpIHtcbiAgICAgIGNvbnNvbGUuaW5mbygnY3R4IGZvciBjb25maWc6ICcsIGN0eCk7XG5cbiAgICAgIHZhciBjb25maWcgPSBhcHAucGFyc2VDb25maWdGcm9tUXVlcnlTdHJpbmcoY3R4LnF1ZXJ5c3RyaW5nKTtcbiAgICAgIGNvbnNvbGUuaW5mbygncGFyc2VkIGNvbmZpZzogJywgY29uZmlnKTtcblxuICAgICAgYXBwLnNhdmVDb25maWcoY29uZmlnKTtcblxuICAgICAgaWYgKGNvbmZpZy5sYXVuY2gpIHtcbiAgICAgICAgY29uc29sZS53YXJuKCdyZWRpcmVjdGluZyBmcm9tIGxhdW5jaD0lcycsIGNvbmZpZy5sYXVuY2gpO1xuICAgICAgICBwYWdlLnJlZGlyZWN0KGNvbmZpZy5sYXVuY2gpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXBwLnJvdXRlID0gJ2hvbWUnO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcGFnZSgnL3NlYXJjaCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnJvdXRlID0gJ3NlYXJjaCc7XG4gICAgfSk7XG5cbiAgICBwYWdlKCcvYnJvd3NlJywgZnVuY3Rpb24oKSB7XG4gICAgICBhcHAucm91dGUgPSAnYnJvd3NlJztcbiAgICAgIGFwcC5icm93c2UgPSB7XG4gICAgICAgIHBhZ2U6IDAsXG4gICAgICAgIHBlclBhZ2U6IDEwXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBwYWdlKCcvYnJvd3NlLzpwYWdlJywgZnVuY3Rpb24oY3R4KSB7XG4gICAgICBhcHAucm91dGUgPSAnYnJvd3NlJztcbiAgICAgIGFwcC5wYXJhbXMgPSBjdHgucGFyYW1zO1xuICAgICAgbGV0IHFwYXJhbXMgPSB7fTtcbiAgICAgIGFwcC5wYXJzZVBhcmFtcyhjdHgucXVlcnlzdHJpbmcpLm1hcCgodHVwbGUpID0+IHFwYXJhbXNbdHVwbGVbMF1dID0gdHVwbGVbMV0pO1xuXG4gICAgICBhcHAuYnJvd3NlID0ge1xuICAgICAgICBwYWdlOiBjdHgucGFyYW1zLnBhZ2UsXG4gICAgICAgIHBlclBhZ2U6IHFwYXJhbXMucGVyUGFnZSA/IHFwYXJhbXMucGVyUGFnZSA6IDEwLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHBhZ2UoJy9hcnRpY2xlLzpjb250ZW50S2V5JywgZnVuY3Rpb24oY3R4KSB7XG4gICAgICBhcHAucm91dGUgPSAnYXJ0aWNsZUxvb2t1cCc7XG4gICAgICBhcHAucGFyYW1zID0gY3R4LnBhcmFtcztcbiAgICAgIGFwcC4kLmxvb2t1cFZpZXcubG9va3VwKCk7XG4gICAgfSk7XG5cbiAgICAvLyA0MDRcbiAgICBwYWdlKCcqJywgZnVuY3Rpb24oY3R4KSB7XG4gICAgICAvLyAgICAgICAgICAgICBodHRwOi8vam9oYW4tZGV2LmFmcm96YWFyLmNvbS8jIS9sYXVuY2g/XFxcbiAgICAgIC8vICAgICAgICAgICAgICAgIHNlYXJjaEJhc2U9aHR0cDovL2pvaGFuLmFmcm96YWFyLmNvbS9hc2hlcy1zdXBwb3J0XG4gICAgICAvLyAgICAgICAgICAgICAgICAmdGs9c2JwJmFwcElkPThcbiAgICAgIC8vICAgICAgICAgICAgICAgICZpcnNCYXNlPWh0dHA6Ly9qb2hhbi1pcnMuYWZyb3phYXIuY29tL2ltYWdlXG4gICAgICAvLyAgICAgICAgICAgICAgICAmY29udGVudEJhc2U9aHR0cDovL2pvaGFuLmFmcm96YWFyLmNvbS9hc2hlcy13ZWImbGF1bmNoPXRydWVcbiAgICAgIC8vIENhbid0IGZpbmQ6IGh0dHA6Ly9qb2hhbi1kZXYuYWZyb3phYXIuY29tLyMhL2xhdW5jaFxuICAgICAgLy8gICAgICAgID9zZWFyY2hCYXNlPWh0dHA6Ly9qb2hhbi5hZnJvemFhci5jb+KApnphYXIuY29tL2ltYWdlXG4gICAgICAvLyAgICAgICAgJmNvbnRlbnRCYXNlPWh0dHA6Ly9qb2hhbi5hZnJvemFhci5jb20vYXNoZXMtd2ViXG4gICAgICAvLyAgICAgICAgJmxhdW5jaD10cnVlLiBSZWRpcmVjdGVkIHlvdSB0byBIb21lIFBhZ2VcblxuICAgICAgY29uc29sZS5lcnJvcignY291bGRudCBwYXJzZSBsb2NhdGlvbiBmcm9tIGN0eDogJywgY3R4KTtcblxuICAgICAgaWYgKGN0eC5wYXRoLnN0YXJ0c1dpdGgoJy8vJykpIHtcbiAgICAgICAgcGFnZS5yZWRpcmVjdChjdHgucGF0aC5zdWJzdHIoMSkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoJ3BhcnNpbmcgaGFzaCBmcm9tIGhyZWY6ICcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgICAgdmFyIGhpZHggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCcjJyk7XG4gICAgICB2YXIgcWlkeCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJz8nKTtcblxuICAgICAgdmFyIGhhc2g7XG4gICAgICB2YXIgcXM7XG4gICAgICBpZiAocWlkeCA+IGhpZHgpIHsgLy8gaGFzaCBhdCBzdGFydFxuICAgICAgICBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3Vic3RyKGhpZHgsIHFpZHggLSBoaWR4KTtcbiAgICAgIH0gZWxzZSB7IC8vIGhhc2ggYXQgZW5kXG5cbiAgICAgICAgaWYgKHFpZHggPj0gMCkge1xuICAgICAgICAgIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zdWJzdHIoaGlkeCk7XG4gICAgICAgICAgcXMgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zdWJzdHIocWlkeCwgKGhpZHggLSBxaWR4KSk7XG4gICAgICAgICAgdmFyIHJlZHIgPSBoYXNoLnN1YnN0cihoYXNoLmluZGV4T2YoJy8nKSkgKyBxcztcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ2hhc2g6ICVzLCBxczogJXMsIHJlZHI6ICVzJywgaGFzaCwgcXMsIHJlZHIpO1xuICAgICAgICAgIHBhZ2UucmVkaXJlY3QocmVkcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbm8gcXVlcnkgc3RyaW5nXG4gICAgICAgICAgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnN1YnN0cihoaWR4KTtcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ3JlZHI6ICcsIGhhc2guc3Vic3RyKGhhc2guaW5kZXhPZignLycpKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUuaW5mbygnaGlkeDogJXMsIHFpZHg6ICVzLCBoYXNoOiAlcywgcXM6ICVzJywgaGlkeCwgcWlkeCwgaGFzaCwgcXMpO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9ICdDYW5cXCd0IGZpbmQ6ICcgKyB3aW5kb3cubG9jYXRpb24uaHJlZiAgKyAnLiBSZWRpcmVjdGVkIHlvdSB0byBIb21lIFBhZ2UnO1xuICAgICAgYXBwLnNob3dUb2FzdChtZXNzYWdlLCB7fSwgdHJ1ZSk7XG4gICAgICBwYWdlLnJlZGlyZWN0KGFwcC5iYXNlVXJsKTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCAjISBiZWZvcmUgdXJsc1xuICAgIHBhZ2Uoe1xuICAgICAgaGFzaGJhbmc6IHRydWVcbiAgICB9KTtcblxuICB9KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

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

  page('/settings', function (ctx) {
    app.route = 'settings';
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
//# sourceMappingURL=data:application/json;base64,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LE9BQUs7QUFDSCxjQUFVO0FBRFAsR0FBTDtBQUlELENBOUhIIiwiZmlsZSI6ImVsZW1lbnRzL3JvdXRpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignV2ViQ29tcG9uZW50c1JlYWR5JywgZnVuY3Rpb24oKSB7XG5cbiAgICAvLyBXZSB1c2UgUGFnZS5qcyBmb3Igcm91dGluZy4gVGhpcyBpcyBhIE1pY3JvXG4gICAgLy8gY2xpZW50LXNpZGUgcm91dGVyIGluc3BpcmVkIGJ5IHRoZSBFeHByZXNzIHJvdXRlclxuICAgIC8vIE1vcmUgaW5mbzogaHR0cHM6Ly92aXNpb25tZWRpYS5naXRodWIuaW8vcGFnZS5qcy9cblxuICAgIC8vIFJlbW92ZXMgZW5kIC8gZnJvbSBhcHAuYmFzZVVybCB3aGljaCBwYWdlLmJhc2UgcmVxdWlyZXMgZm9yIHByb2R1Y3Rpb25cbiAgICBpZiAod2luZG93LmxvY2F0aW9uLnBvcnQgPT09ICcnKSB7ICAvLyBpZiBwcm9kdWN0aW9uXG4gICAgICBwYWdlLmJhc2UoYXBwLmJhc2VVcmwucmVwbGFjZSgvXFwvJC8sICcnKSk7XG4gICAgfVxuXG4gICAgLy8gTWlkZGxld2FyZVxuICAgIGZ1bmN0aW9uIHNjcm9sbFRvVG9wKGN0eCwgbmV4dCkge1xuICAgICAgYXBwLnNjcm9sbFBhZ2VUb1RvcCgpO1xuICAgICAgbmV4dCgpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsb3NlRHJhd2VyKGN0eCwgbmV4dCkge1xuICAgICAgLy9hcHAuY2xvc2VEcmF3ZXIoKTtcbiAgICAgIG5leHQoKTtcbiAgICB9XG5cbiAgICAvLyBSb3V0ZXNcbiAgICBwYWdlKCcqJywgc2Nyb2xsVG9Ub3AsIGNsb3NlRHJhd2VyLCBmdW5jdGlvbihjdHgsIG5leHQpIHtcbiAgICAgIG5leHQoKTtcbiAgICB9KTtcblxuICAgIHBhZ2UoJy8nLCBmdW5jdGlvbigpIHtcbiAgICAgIGFwcC5yb3V0ZSA9ICdob21lJztcbiAgICB9KTtcblxuICAgIHBhZ2UoYXBwLmJhc2VVcmwsIGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnJvdXRlID0gJ2hvbWUnO1xuICAgIH0pO1xuXG4gICAgcGFnZSgnL3NldHRpbmdzJywgZnVuY3Rpb24oY3R4KSB7XG4gICAgICBhcHAucm91dGUgPSAnc2V0dGluZ3MnO1xuICAgIH0pO1xuXG4gICAgcGFnZSgnL3NlYXJjaCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXBwLnJvdXRlID0gJ3NlYXJjaCc7XG4gICAgfSk7XG5cbiAgICBwYWdlKCcvYnJvd3NlJywgZnVuY3Rpb24oKSB7XG4gICAgICBhcHAucm91dGUgPSAnYnJvd3NlJztcbiAgICAgIGFwcC5icm93c2UgPSB7XG4gICAgICAgIHBhZ2U6IDAsXG4gICAgICAgIHBlclBhZ2U6IDEwXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBwYWdlKCcvYnJvd3NlLzpwYWdlJywgZnVuY3Rpb24oY3R4KSB7XG4gICAgICBhcHAucm91dGUgPSAnYnJvd3NlJztcbiAgICAgIGFwcC5wYXJhbXMgPSBjdHgucGFyYW1zO1xuICAgICAgbGV0IHFwYXJhbXMgPSB7fTtcbiAgICAgIGFwcC5wYXJzZVBhcmFtcyhjdHgucXVlcnlzdHJpbmcpLm1hcCgodHVwbGUpID0+IHFwYXJhbXNbdHVwbGVbMF1dID0gdHVwbGVbMV0pO1xuXG4gICAgICBhcHAuYnJvd3NlID0ge1xuICAgICAgICBwYWdlOiBjdHgucGFyYW1zLnBhZ2UsXG4gICAgICAgIHBlclBhZ2U6IHFwYXJhbXMucGVyUGFnZSA/IHFwYXJhbXMucGVyUGFnZSA6IDEwLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHBhZ2UoJy9hcnRpY2xlLzpjb250ZW50S2V5JywgZnVuY3Rpb24oY3R4KSB7XG4gICAgICBhcHAucm91dGUgPSAnYXJ0aWNsZUxvb2t1cCc7XG4gICAgICBhcHAucGFyYW1zID0gY3R4LnBhcmFtcztcbiAgICAgIGFwcC4kLmxvb2t1cFZpZXcubG9va3VwKCk7XG4gICAgfSk7XG5cbiAgICAvLyA0MDRcbiAgICBwYWdlKCcqJywgZnVuY3Rpb24oY3R4KSB7XG4gICAgICAvLyAgICAgICAgICAgICBodHRwOi8vam9oYW4tZGV2LmFmcm96YWFyLmNvbS8jIS9sYXVuY2g/XFxcbiAgICAgIC8vICAgICAgICAgICAgICAgIHNlYXJjaEJhc2U9aHR0cDovL2pvaGFuLmFmcm96YWFyLmNvbS9hc2hlcy1zdXBwb3J0XG4gICAgICAvLyAgICAgICAgICAgICAgICAmdGs9c2JwJmFwcElkPThcbiAgICAgIC8vICAgICAgICAgICAgICAgICZpcnNCYXNlPWh0dHA6Ly9qb2hhbi1pcnMuYWZyb3phYXIuY29tL2ltYWdlXG4gICAgICAvLyAgICAgICAgICAgICAgICAmY29udGVudEJhc2U9aHR0cDovL2pvaGFuLmFmcm96YWFyLmNvbS9hc2hlcy13ZWImbGF1bmNoPXRydWVcbiAgICAgIC8vIENhbid0IGZpbmQ6IGh0dHA6Ly9qb2hhbi1kZXYuYWZyb3phYXIuY29tLyMhL2xhdW5jaFxuICAgICAgLy8gICAgICAgID9zZWFyY2hCYXNlPWh0dHA6Ly9qb2hhbi5hZnJvemFhci5jb+KApnphYXIuY29tL2ltYWdlXG4gICAgICAvLyAgICAgICAgJmNvbnRlbnRCYXNlPWh0dHA6Ly9qb2hhbi5hZnJvemFhci5jb20vYXNoZXMtd2ViXG4gICAgICAvLyAgICAgICAgJmxhdW5jaD10cnVlLiBSZWRpcmVjdGVkIHlvdSB0byBIb21lIFBhZ2VcblxuICAgICAgY29uc29sZS5lcnJvcignY291bGRudCBwYXJzZSBsb2NhdGlvbiBmcm9tIGN0eDogJywgY3R4KTtcblxuICAgICAgaWYgKGN0eC5wYXRoLnN0YXJ0c1dpdGgoJy8vJykpIHtcbiAgICAgICAgcGFnZS5yZWRpcmVjdChjdHgucGF0aC5zdWJzdHIoMSkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoJ3BhcnNpbmcgaGFzaCBmcm9tIGhyZWY6ICcsIHdpbmRvdy5sb2NhdGlvbi5ocmVmKTtcblxuICAgICAgdmFyIGhpZHggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCcjJyk7XG4gICAgICB2YXIgcWlkeCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJz8nKTtcblxuICAgICAgdmFyIGhhc2g7XG4gICAgICB2YXIgcXM7XG4gICAgICBpZiAocWlkeCA+IGhpZHgpIHsgLy8gaGFzaCBhdCBzdGFydFxuICAgICAgICBoYXNoID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3Vic3RyKGhpZHgsIHFpZHggLSBoaWR4KTtcbiAgICAgIH0gZWxzZSB7IC8vIGhhc2ggYXQgZW5kXG5cbiAgICAgICAgaWYgKHFpZHggPj0gMCkge1xuICAgICAgICAgIGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zdWJzdHIoaGlkeCk7XG4gICAgICAgICAgcXMgPSB3aW5kb3cubG9jYXRpb24uaHJlZi5zdWJzdHIocWlkeCwgKGhpZHggLSBxaWR4KSk7XG4gICAgICAgICAgdmFyIHJlZHIgPSBoYXNoLnN1YnN0cihoYXNoLmluZGV4T2YoJy8nKSkgKyBxcztcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ2hhc2g6ICVzLCBxczogJXMsIHJlZHI6ICVzJywgaGFzaCwgcXMsIHJlZHIpO1xuICAgICAgICAgIHBhZ2UucmVkaXJlY3QocmVkcik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gbm8gcXVlcnkgc3RyaW5nXG4gICAgICAgICAgaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmLnN1YnN0cihoaWR4KTtcbiAgICAgICAgICBjb25zb2xlLmluZm8oJ3JlZHI6ICcsIGhhc2guc3Vic3RyKGhhc2guaW5kZXhPZignLycpKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUuaW5mbygnaGlkeDogJXMsIHFpZHg6ICVzLCBoYXNoOiAlcywgcXM6ICVzJywgaGlkeCwgcWlkeCwgaGFzaCwgcXMpO1xuXG4gICAgICB2YXIgbWVzc2FnZSA9ICdDYW5cXCd0IGZpbmQ6ICcgKyB3aW5kb3cubG9jYXRpb24uaHJlZiAgKyAnLiBSZWRpcmVjdGVkIHlvdSB0byBIb21lIFBhZ2UnO1xuICAgICAgYXBwLnNob3dUb2FzdChtZXNzYWdlLCB7fSwgdHJ1ZSk7XG4gICAgICBwYWdlLnJlZGlyZWN0KGFwcC5iYXNlVXJsKTtcbiAgICB9KTtcblxuICAgIC8vIGFkZCAjISBiZWZvcmUgdXJsc1xuICAgIHBhZ2Uoe1xuICAgICAgaGFzaGJhbmc6IHRydWVcbiAgICB9KTtcblxuICB9KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=

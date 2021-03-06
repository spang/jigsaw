var JigsawRouterClass = Backbone.Router.extend({
  routes: {
    "puzzle/:puzzleId": "routePuzzle",
    "search/*query": "routeSearch",
    "admin": "routeAdmin",
    "": "routeSearch"
  },
  routeSearch: function (query) {
    Session.set("route.puzzleId", undefined);
    Session.set("route.searchQuery", query || '');
    Session.set("route.admin", undefined);
  },
  routePuzzle: function (puzzleId) {
    Session.set("route.puzzleId", puzzleId);
    Session.set("route.searchQuery", undefined);
    Session.set("route.admin", undefined);
  },
  routeAdmin: function () {
    Session.set("route.puzzleId", undefined);
    Session.set("route.searchQuery", undefined);
    Session.set("route.admin", true);
  },
  navigateToPuzzle: function (puzzleId) {
    this.navigate("puzzle/" + puzzleId, true);
  },
  currentPuzzleId: function () {
    return Session.get("route.puzzleId");
  },
  currentPuzzle: function () {
    var id = this.currentPuzzleId();
    if (!id)
      return null;
    return Puzzles.findOne(id);
  },
  showingSearch: function () {
    return !Session.equals("route.searchQuery", undefined);
  },
  showingAdmin: function () {
    return Session.equals("route.admin", true);
  },
  currentSearchQueryUrl: function () {
    return Session.get("route.searchQuery");
  }
});

JigsawRouter = new JigsawRouterClass;

Meteor.startup(function () {
  Backbone.history.start({pushState: true});
});

Template.body.events({
  // Handle any links to /relative/URLs locally instead of using the network.
  'click a': function (evt) {
    // Try not to hijack anything other than a simple click (so that
    // "open-in-new-tab" clicks work, etc).
    if (evt.which > 1 || evt.shiftKey || evt.altKey || evt.metaKey)
      return;

    // Use getAttribute instead of ".href" since the latter normalizes to a full
    // URL.
    var href = evt.currentTarget.getAttribute('href');
    if (href && href.substr(0, 1) === '/') {
      evt.preventDefault();
      JigsawRouter.navigate(href, true);
    }
  },

  'click .show-add-puzzle': function () {
    Session.set('dialog.addPuzzle', true);
    Session.set('dialog.addPuzzle.error', '');
    Meteor.flush();
    var focusElement = DomUtils.find(document, '.focus-addPuzzle');
    if (focusElement)
      focusElement.focus();
  }
});

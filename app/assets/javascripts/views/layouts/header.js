Slipmat.Views.Header = Backbone.View.extend({

  tagName: "header",
  className: "header",
  template: JST["layouts/header/header"],

  initialize: function (options) {
    this.results = new Slipmat.Collections.SearchResults();
    this.resultTemplate = JST["layouts/header/_searchResult"];

    this.listenTo(Slipmat.currentUser, "sync", this.renderPanel);
    this.listenTo(Slipmat.currentUser, "signIn signOut", this.togglePanel);
    this.listenTo(this.results, "sync", this.renderSearchResults);
  },

  events: {
    "input input": "fetchSearchResults",
    "click .search-result": "redirect",
    "blur .search": "clearSearchResults",
    "submit #search": "search",
    "click button": "signIn",
    "click #signOut": "signOut",
    "click #demo": "demo"
  },

  render: function () {
    var content = this.template({ currentUser: Slipmat.currentUser });
    this.$el.html(content);
    this.togglePanel(Slipmat.currentUser);

    return this;
  },

  renderPanel: function () {
    if (!Slipmat.currentUser.isSignedIn()) { return; }

    var userPanel = JST["layouts/header/_signedInPanel"];
    this.$(".header-user-list").html(userPanel());
  },

  togglePanel: function () {
    var userPanel;

    if (Slipmat.currentUser.isSignedIn()) {
      userPanel = JST["layouts/header/_signedInPanel"];
    } else {
      userPanel = JST["layouts/header/_signedOutPanel"];
    }
    this.$(".header-user-list").html(userPanel());
  },

  fetchSearchResults: function (e) {
    e.preventDefault();

    var userInput = $(e.currentTarget).val();
    var query = {
      query: userInput,
      limit: 10
    };

    this.results.fetch({ data: query });
  },

  renderSearchResults: function () {
    var header = this;
    var $results = this.$(".search-results").empty();

    if (!this.results.length) {
      $results.hide();
    } else {
      $results.show();

      var results = this.results.slice(0, 10);
      results.forEach(function (result) {
        var $result = header.resultTemplate({ result: result });
        $results.append($result);
      });
    }
  },

  clearSearchResults: function () {
    window.setTimeout(this._clearSearchResults, 150);
  },

  _clearSearchResults: function () {
    this.$(".search-results").empty().hide();
  },

  redirect: function (e) {
    e.preventDefault();
    this._clearSearchResults();

    var fragment = $(e.currentTarget).data("fragment");
    Backbone.history.navigate(fragment, { trigger: true });
  },

  search: function (e) {
    e.preventDefault();
    this._clearSearchResults();

    var query = $(e.currentTarget).find("input").val();
    var queryFragment = window.encodeURIComponent(query);
    var fragment = (query.length ? "/search?query=" + queryFragment : "");
    Backbone.history.navigate(fragment, { trigger: true });
  },

  signIn: function (e) {
    e.preventDefault();
    Backbone.history.navigate("/login", { trigger: true });
  },

  signOut: function (e) {
    e.preventDefault();
    Slipmat.currentUser.signOut();
  },

  demo: function (e) {
    e.preventDefault();
    Slipmat.currentUser.signInAsDemoUser();
  }

});

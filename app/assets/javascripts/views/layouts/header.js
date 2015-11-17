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
    "click #sign-in": "signIn",
    "click #sign-out": "signOut",
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

    var userInput = $(e.currentTarget).val(),
        query = {
          query: userInput,
          limit: 10
        };

    this.results.fetch({ data: query });
  },

  renderSearchResults: function () {
    var $result,
        $results = this.$(".search-results").empty(),
        results = this.results.slice(0, 10);

    if (!this.results.length) {
      $results.hide();
    } else {
      $results.show();
      results.forEach((result, i) => {
        $result = this.resultTemplate({
          result: result,
          resultID: i
        });
        $results.append($result);
      });
      this.bindResultsNavigation();
    }
  },

  bindResultsNavigation: function () {
    this.$(".header-search")
      .off("keydown")
      .on("keydown", e => {
        var resultID,
            nextResult,
            fragment,
            $results = this.$(".search-result");
            selected = this.$(".search-results").find(".selected");

        switch (e.which) {
          case 40: // down
            e.preventDefault();
            if (selected.length) {
              resultID = selected.data("result-id") + 1;
            } else {
              resultID = 0;
            }
            break;
          case 38: // up
            e.preventDefault();
            if (selected.length) {
              resultID = selected.data("result-id") - 1;
            } else {
              resultID = $results.length - 1;
            }
            break;
          case 13: // enter
            if (selected.length) {
              e.preventDefault();
              fragment = selected.data("fragment");
              Backbone.history.navigate(fragment, { trigger: true });
              this._clearSearchResults();
              this.$(".header-search").off("keydown").blur();
            }
            break;
        }

        if (typeof resultID !== "undefined") {
          selected.removeClass("selected");
          nextResult = $results.filter("[data-result-id=" + resultID + "]");
          nextResult.addClass("selected");
        }
      });
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

    var query = $(e.currentTarget).find("input").val(),
        queryFragment = window.encodeURIComponent(query),
        fragment = (query.length ? "/search?query=" + queryFragment : "");

    Backbone.history.navigate(fragment, { trigger: true });
  },

  signIn: function (e) {
    e.preventDefault();
    Backbone.history.navigate("/login", { trigger: true });
  },

  signOut: function (e) {
    e.preventDefault();

    var fragment = Backbone.history.fragment;
    Slipmat.currentUser.signOut({
      success: () => {
        Backbone.history.fragment = null;
        Backbone.history.navigate(fragment, { trigger: true });
      }
    });
  },

  demo: function (e) {
    e.preventDefault();
    Slipmat.currentUser.signInAsDemoUser();
  }

});

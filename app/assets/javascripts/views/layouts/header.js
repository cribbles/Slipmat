Slipmat.Views.Header = Backbone.View.extend({

  tagName: "header",
  className: "header",
  template: JST["layouts/header/header"],

  initialize: function (options) {
    this.listenTo(Slipmat.currentUser, "sync", this.renderPanel);
    this.listenTo(Slipmat.currentUser, "signIn signOut", this.togglePanel);
  },

  events: {
    "click #signOut": "signOut",
    "click #register": "register"
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

  register: function (e) {
    e.preventDefault();

    Backbone.history.navigate("/register", { trigger: true });
  },

  signOut: function (e) {
    e.preventDefault();

    Slipmat.currentUser.signOut();
  }

});

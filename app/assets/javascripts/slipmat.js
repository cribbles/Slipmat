window.Slipmat = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  initialize: function() {
    var header = new Slipmat.Views.Header();
    var footer = new Slipmat.Views.Footer();

    $("body").prepend(header.render().$el);
    $("body").append(footer.render().$el);

    var router = new Slipmat.Routers.Router({
      $rootEl: $("main.content")
    });

    Backbone.history.start();
  }
};

$(document).ready(function(){
  Slipmat.initialize();
});

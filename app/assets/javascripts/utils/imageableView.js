Backbone.ImageableView = Backbone.View.extend({

  submitImage: function (options) {
    var image = options.image,
        param = options.param,
        model = options.model;
    if (!image) { return; }

    var formData = new FormData();
    formData.append(param, image);

    $.ajax({
      url: _.result(model, "url"),
      type: "PATCH",
      data: formData,
      processData: false,
      contentType: false,
      success: function () {
        options.success && options.success();
      }
    });
  },

  triggerUpload: function (e) {
    e.preventDefault();
    $("#image-form").trigger("click");
  },

  replaceFormImage: function (e) {
    e.preventDefault();
    var files = e.currentTarget.files
    if (!files || !files.length) { return; }

    var reader = new FileReader();
    reader.onload = function (readerEvent) {
      $("#form-image").attr("src", readerEvent.target.result);
    }
    reader.readAsDataURL(files[0]);
  }

});

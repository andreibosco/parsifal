$(function () {

  'use strict';

  $(".js-jump-page").popover({
    html: true,
    content: function () {
      var first_page = "?page=1";
      var last_page_number = $("#library-documents").attr("data-num-pages");
      var last_page = "?page=" + last_page_number;

      var querystring = $("#search-form [name='q']").val();
      if (querystring.length > 0) {
        first_page += "&q=" + querystring;
        last_page += "&q=" + querystring;
      }

      var html = "<div><small><a href='" + first_page + "'>First page</a></small></div>";
      html += "<div><small><a href='" + last_page + "'>Last page</a></small></div>";
      return html;
    }
  });

  var hideAllSelectionMessages = function () {
    $(".js-message-select-all-pages").hide();
    $(".js-message-clear-selection").hide();
  };

  var showSelectAllPagesMessage = function () {
    hideAllSelectionMessages();
    $(".js-message-select-all-pages").show();
  };

  var showClearSelectionMessage = function () {
    hideAllSelectionMessages();
    $(".js-message-clear-selection").show();
  };

  var clearSelection = function () {
    $("#library-documents .js-document-checkbox").each(function () {
      $(this).unselectDocument();
    });
    $(".js-toggle-select-documents .glyphicon").removeClass().addClass("glyphicon glyphicon-unchecked");
    $(".select-all-pages").val("");
    hideAllSelectionMessages();
    modifyToolbarButtonsState();
  };

  var selectAllInPage = function () {
    $("#library-documents .js-document-checkbox").each(function () {
      $(this).selectDocument();
    });
    $(".js-toggle-select-documents .glyphicon").removeClass().addClass("glyphicon glyphicon-check");
    $(".select-all-pages").val("");
    showSelectAllPagesMessage();
    modifyToolbarButtonsState();
  };

  $(".js-toggle-select-documents").click(function () {
    var isChecked = $(".glyphicon", this).hasClass("glyphicon-check");
    if (isChecked) {
      clearSelection();
    }
    else {
      selectAllInPage();
    }
  });

  $(".js-select-all-documents-in-page").click(function () {
    selectAllInPage();
  });

  $(".js-select-all-documents").click(function () {
    showClearSelectionMessage();
    $(".select-all-pages").val("all");
  });

  $(".js-clear-selection").click(function () {
    clearSelection();
  });

  $.fn.selectDocument = function () {
    var row = $(this).closest("tr");
    var checkbox = $("input[type='checkbox']", this);
    var icon = $(".glyphicon", this);

    $(checkbox).prop("checked", true);
    $(icon).removeClass().addClass("glyphicon glyphicon-check");
    $(row).addClass("bg-warning");
  };

  $.fn.unselectDocument = function () {
    var row = $(this).closest("tr");
    var checkbox = $("input[type='checkbox']", this);
    var icon = $(".glyphicon", this);

    $(checkbox).prop("checked", false);
    $(icon).removeClass().addClass("glyphicon glyphicon-unchecked");
    $(row).removeClass("bg-warning");
  };

  $(".js-document-checkbox").click(function () {
    var checkbox = $("input[type='checkbox']", this);
    var isChecked = $(checkbox).is(":checked");

    if (isChecked) {
      $(this).unselectDocument();
      $(".select-all-pages").val("");
      hideAllSelectionMessages();
    }
    else {
      $(this).selectDocument();
    }
    modifyToolbarButtonsState();
    modifySelectAllCheckboxState();
  });

  var modifySelectAllCheckboxState = function () {
    // Ensure the integrity of the check all button icon
    var totalDocumentsInThisPage = parseInt($("#library-documents").attr("data-num-documents"));
    var selectedDocuments = $("[name='document']:checked").length;
    var allDocumentsInThisPageAreSelected = (selectedDocuments === totalDocumentsInThisPage);

    if (allDocumentsInThisPageAreSelected) {
      $(".js-toggle-select-documents .glyphicon").removeClass().addClass("glyphicon glyphicon-check");
    }
    else {
      $(".js-toggle-select-documents .glyphicon").removeClass().addClass("glyphicon glyphicon-unchecked");
    }
  };

  var modifyToolbarButtonsState = function () {
    // Ensure the integrity of the delete and move buttons disabled state
    var selectedDocuments = $("[name='document']:checked").length;
    var atLeastOneDocumentIsSelected = (selectedDocuments > 0);

    if (atLeastOneDocumentIsSelected) {
      $(".js-selection-action").prop("disabled", false);
      $(".js-selection-action").closest(".btn-group").removeClass("not-allowed");      
    }
    else {
      $(".js-selection-action").prop("disabled", true);
      $(".js-selection-action").closest(".btn-group").addClass("not-allowed");
    }
  };

  /* Folder Management */

  var clearNewFolderFormState = function () {
    $(".js-add-folder-input").hide();
    $(".js-add-folder").show();
    $("#form-new-folder .form-group").removeClass().addClass("form-group has-feedback");
    $("#form-new-folder .form-control-feedback").removeClass().addClass("form-control-feedback")
    $("#form-new-folder .form-control-feedback").hide();
    $("#form-new-folder .errors").html("");
    $("#form-new-folder #id_name").val("");
  };

  $(".js-add-folder").click(function () {
    $(".js-add-folder").fadeOut(100, function () {
      $(".js-add-folder-input").fadeIn(100, function () {
        $(".js-add-folder-input #id_name").focus();
      });
    })
  });

  $("#form-new-folder").submit(function () {
    var form = $(this);
    $.ajax({
      url: $(form).attr("action"),
      data: $(form).serialize(),
      type: $(form).attr("method"),
      cache: false,
      beforeSend: function () {
        $("#form-new-folder .form-group").removeClass().addClass("form-group has-feedback");
        $("#form-new-folder .form-control-feedback").removeClass().addClass("glyphicon glyphicon-refresh spin form-control-feedback");
        $("#form-new-folder #id_name").prop("readonly", true);
      },
      success: function (data) {
        $("#form-new-folder .form-group").removeClass().addClass("form-group has-feedback has-success");
        $("#form-new-folder .form-control-feedback").removeClass().addClass("glyphicon glyphicon-ok form-control-feedback");
        $("#form-new-folder .form-control-feedback").show();
        setTimeout(function () {
          $(".js-add-folder").before("<a href='/library/folders/" + data.folder.slug + "/' class='list-group-item'>" + data.folder.name + "</a>");
          clearNewFolderFormState();
        }, 200);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#form-new-folder .form-group").removeClass().addClass("form-group has-feedback has-error");
        $("#form-new-folder .form-control-feedback").removeClass().addClass("glyphicon glyphicon-remove form-control-feedback");
        $("#form-new-folder .form-control-feedback").show();
        $("#form-new-folder .errors").html("");
        jqXHR.responseJSON.name.forEach(function (error) {
          $("#form-new-folder .errors").append("<span class='help-block' style='margin-bottom: 0;'><small>" + error + "</small></span>");
        });
      },
      complete: function () {
        $("#form-new-folder #id_name").prop("readonly", false);
      }
    });
    return false;
  });

  $("#form-new-folder #id_name").blur(function () {
    var isEmpty = ($(this).val().trim().length === 0);
    if (isEmpty) {
      clearNewFolderFormState();
    }
  });

  
  $("#form-new-folder #id_name").keyup(function(e) {
    var KEYCODE_ESC = 27;
    if (e.keyCode == KEYCODE_ESC) {
      clearNewFolderFormState();
    }
  });

});
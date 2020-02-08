(function() {
  $(document).ready(function() {
    
    var body, click_event, content, nav, nav_toggler;
    nav_toggler = $("header .toggle-nav");
    nav = $("#main-nav");
    content = $("#content");
    body = $("body");
    click_event = (jQuery.support.touch ? "tap" : "click");
    $("#main-nav .dropdown-collapse").on(click_event, function(e) {
      var link, list;
      e.preventDefault();     
      link = $(this);
       // to reset menu 
      reset_main_menu(link);
      list = link.parent().find("> ul");
      if (list.is(":visible")) {
        if (body.hasClass("main-nav-closed") && link.parents("li").length === 1) { //console.log("line16");
          false;
        } else {
          link.removeClass("in");//console.log("line19");
          list.slideUp(1, function() { //console.log("line20");
            return $(this).removeClass("in");
          });
        }
      } else { //console.log("line24");
        if (list.parents("ul.nav.nav-stacked").length === 1) { //console.log("line25");
          $(document).trigger("nav-open");
        }
     link.addClass("in");
        list.slideDown(1, function() {
          return $(this).addClass("in");
        });
      }
      return false;
    });
    if (jQuery.support.touch) {
      nav.on("swiperight", function(e) {
        return $(document).trigger("nav-open");
      });
      nav.on("swipeleft", function(e) {
        return $(document).trigger("nav-close");
      });
    }
    nav_toggler.on(click_event, function() {
      if (nav_open()) {
        $(document).trigger("nav-close");
      } else {
        $(document).trigger("nav-open");
      }
      return false;
    });
    $(document).bind("nav-close", function(event, params) {
      var nav_open;
      body.removeClass("main-nav-opened").removeClass("main-nav-closed");
      return nav_open = false;
    });
    return $(document).bind("nav-open", function(event, params) {
      var nav_open;
      body.addClass("main-nav-opened").removeClass("main-nav-closed");
      return nav_open = true;
    });

    // to reset main menu on click of menu ul
    function reset_main_menu(ele){ //console.log(ele);console.log(ele.parent().hasClass("click-nav")); //console.log("line 65 menu reset");
         
         if(ele.parent().hasClass("click-nav")){
         $(ele).parents("ul.nav-stacked").find("li.click-nav").each(function() { //console.log("line 65 inside");  
                //console.log($(this));
              if($(this).children("a.dropdown-collapse").hasClass("in")){
                
              $(this).children("a.dropdown-collapse").removeClass("in");
              $(this).children("a.dropdown-collapse").next("ul.nav-stacked").removeClass("in");
              $(this).children("a.dropdown-collapse").next("ul.nav-stacked").hide();
               /*  $(this).find("a.dropdown-collapse").each(function() { console.log($(this));
                  
                  if($(this).hasClass("in")){
                    console.log("inner_ele");
                  }
                  // 
                  //  $(this).next("ul.nav-stacked").hide();
                });*/
                //  console.log($(this).find("a.dropdown-collapse"));
               // $(this).removeClass("in");
                 // list = link.parent().find("> ul");
               // $(this).next("ul.nav-stacked").removeClass("in");
              // 
             }
         });
      } // else chk
    }

  });

// $(document).ready(function(){  
//     $("#main-nav .click-nav ").mouseleave(function(){
//         $(".navigation > .nav > li > ul").css("display", "none");
//     });
// });





$(document).on("click", function(event){
        var $trigger = $(".click-nav");
        if($trigger !== event.target && !$trigger.has(event.target).length){
            $(".navigation > .nav > li > ul.in").slideUp("fast");
        }            
    });

  this.nav_open = function() {
    return $("body").hasClass("main-nav-opened") || $("#main-nav").width() > 50;
  };

  $(document).ready(function() {
    var touch;
    setTimeAgo();
    setScrollable();
    setSortable($(".sortable"));
    setSelect2();
    setAutoSize();
    setCharCounter();
    setMaxLength();
    setValidateForm();
    $(".box .box-remove").live("click", function(e) {
      $(this).parents(".box").first().remove();
      e.preventDefault();
      return false;
    });
    $(".box .box-collapse").live("click", function(e) {
      var box;
      box = $(this).parents(".box").first();
      box.toggleClass("box-collapsed");
      e.preventDefault();
      return false;
    });
    if (jQuery().pwstrength) {
      $('.pwstrength').pwstrength({
        showVerdicts: false
      });
    }
    $(".check-all").live("click", function(e) {
      return $(this).parents("table:eq(0)").find(".only-checkbox :checkbox").attr("checked", this.checked);
    });
    if (jQuery().tabdrop) {
      $('.nav-responsive.nav-pills, .nav-responsive.nav-tabs').tabdrop();
    }
    setDataTable($(".data-table"));
    setDataTable($(".data-table-column-filter"));
    if (jQuery().wysihtml5) {
      $('.wysihtml5').wysihtml5();
    }
    if (jQuery().nestable) {
      $('.dd-nestable').nestable();
    }
    if (!$("body").hasClass("fixed-header")) {
      if (jQuery().affix) {
        $('#main-nav.main-nav-fixed').affix({
          offset: 40
        });
      }
    }
    touch = false;
    if (window.Modernizr) {
      touch = Modernizr.touch;
    }
    if (!touch) {
      $("body").on("mouseenter", ".has-popover", function() {
        var el;
        el = $(this);
        if (el.data("popover") === undefined) {
          el.popover({
            placement: el.data("placement") || "top",
            container: "body"
          });
        }
        return el.popover("show");
      });
      $("body").on("mouseleave", ".has-popover", function() {
        return $(this).popover("hide");
      });
    }
    touch = false;
    if (window.Modernizr) {
      touch = Modernizr.touch;
    }
    if (!touch) {
      $("body").on("mouseenter", ".has-tooltip", function() {
        var el;
        el = $(this);
        if (el.data("tooltip") === undefined) {
          el.tooltip({
            placement: el.data("placement") || "top",
            container: "body"
          });
        }
        return el.tooltip("show");
      });
      $("body").on("mouseleave", ".has-tooltip", function() {
        return $(this).tooltip("hide");
      });
    }
    if (window.Modernizr && Modernizr.svg === false) {
      $("img[src*=\"svg\"]").attr("src", function() {
        return $(this).attr("src").replace(".svg", ".png");
      });
    }
    if (jQuery().colorpicker) {
      $(".colorpicker-hex").colorpicker({
        format: "hex"
      });
      $(".colorpicker-rgb").colorpicker({
        format: "rgb"
      });
    }
    if (jQuery().datetimepicker) {
      $(".datetimepicker").datetimepicker();
      $(".datepicker").datetimepicker({
        pickTime: false
      });
      $(".timepicker").datetimepicker({
        pickDate: false
      });
    }
    if (jQuery().bootstrapFileInput) {
      $('input[type=file]').bootstrapFileInput();
    }
    if (window.Modernizr) {
      if (!Modernizr.input.placeholder) {
        $("[placeholder]").focus(function() {
          var input;
          input = $(this);
          if (input.val() === input.attr("placeholder")) {
            input.val("");
            return input.removeClass("placeholder");
          }
        }).blur(function() {
          var input;
          input = $(this);
          if (input.val() === "" || input.val() === input.attr("placeholder")) {
            input.addClass("placeholder");
            return input.val(input.attr("placeholder"));
          }
        }).blur();
        return $("[placeholder]").parents("form").submit(function() {
          return $(this).find("[placeholder]").each(function() {
            var input;
            input = $(this);
            if (input.val() === input.attr("placeholder")) {
              return input.val("");
            }
          });
        });
      }
    }
  });

  this.setMaxLength = function(selector) {
    if (selector == null) {
      selector = $(".char-max-length");
    }
    if (jQuery().maxlength) {
      return selector.maxlength();
    }
  };

  this.setCharCounter = function(selector) {
    if (selector == null) {
      selector = $(".char-counter");
    }
    if (jQuery().charCount) {
      return selector.charCount({
        allowed: selector.data("char-allowed"),
        warning: selector.data("char-warning"),
        cssWarning: "text-warning",
        cssExceeded: "text-error"
      });
    }
  };

  this.setAutoSize = function(selector) {
    if (selector == null) {
      selector = $(".autosize");
    }
    if (jQuery().autosize) {
      return selector.autosize();
    }
  };

  this.setTimeAgo = function(selector) {
    if (selector == null) {
      selector = $(".timeago");
    }
    if (jQuery().timeago) {
      jQuery.timeago.settings.allowFuture = true;
      jQuery.timeago.settings.refreshMillis = 60000;
      selector.timeago();
      return selector.addClass("in");
    }
  };

  this.setScrollable = function(selector) {
    if (selector == null) {
      selector = $(".scrollable");
    }
    if (jQuery().slimScroll) {
      return selector.each(function(i, elem) {
        return $(elem).slimScroll({
          height: $(elem).data("scrollable-height"),
          start: $(elem).data("scrollable-start") || "top"
        });
      });
    }
  };

  this.setSortable = function(selector) {
    if (selector == null) {
      selector = null;
    }
    if (selector) {
      return selector.sortable({
        axis: selector.data("sortable-axis"),
        connectWith: selector.data("sortable-connect")
      });
    }
  };

  this.setSelect2 = function(selector) {
    if (selector == null) {
      selector = $(".select2");
    }
    if (jQuery().select2) {
      return selector.each(function(i, elem) {
        return $(elem).select2();
      });
    }
  };

  this.setDataTable = function(selector) {
    if (jQuery().dataTable) {
      return selector.each(function(i, elem) {
        var dt, sdom;
        if ($(elem).data("pagination-top-bottom") === true) {
          sdom = "<'row datatables-top'<'col-sm-6'l><'col-sm-6 text-right'pf>r>t<'row datatables-bottom'<'col-sm-6'i><'col-sm-6 text-right'p>>";
        } else if ($(elem).data("pagination-top") === true) {
          sdom = "<'row datatables-top'<'col-sm-6'l><'col-sm-6 text-right'pf>r>t<'row datatables-bottom'<'col-sm-6'i><'col-sm-6 text-right'>>";
        } else {
          sdom = "<'row datatables-top'<'col-sm-6'l><'col-sm-6 text-right'f>r>t<'row datatables-bottom'<'col-sm-6'i><'col-sm-6 text-right'p>>";
        }
        if ($(elem).hasClass("quote_tbl")) { // quote table
        dt = $('.quote_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 25,
           "fnDrawCallback": function( oSettings ) {
            $("#example_processing").addClass('hide');
            $("#table_quote").removeClass('hide');
            },
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
        //  aaSorting: [[2,'desc']], aoColumnDefs: [ { "sType": "date-euro", "aTargets": [ 2 ] } ],

           aaSorting: [[ 0, "desc" ]],"bAutoWidth"       : false,
           aoColumnDefs: [
      { "iDataSort": 0, "aTargets": [ 1 ] },{ "iDataSort": 2, "aTargets": [ 3 ] },{ "iDataSort": 5, "aTargets": [ 6 ] },
      { "sWidth": "15%", "aTargets": [ 1 ] },{ "sWidth": "10%", "aTargets": [ 3 ] },{ "sWidth": "20%", "aTargets": [ 4 ] },
      { "sWidth": "10%", "aTargets": [ 6 ] },{ "sWidth": "30%", "aTargets": [ 7 ] }
    ],
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }

      else if ($(elem).hasClass("vendor_tbl")) { // vendor table
        dt = $('.vendor_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 25,
          "fnDrawCallback": function( oSettings ) {
            $("#example_processing").addClass('hide');
            $("#table_vendor").removeClass('hide');
            },
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
           aaSorting: [[ 0, "desc" ]],
         
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }

      else if ($(elem).hasClass("user_tbl")) { // user table
        dt = $('.user_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 25,
          "fnDrawCallback": function( oSettings ) {
            $("#example_processing").addClass('hide');
            $("#table_user").removeClass('hide');
            },
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
           aaSorting: [[ 0, "desc" ]],
         
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }

      else if ($(elem).hasClass("warehouse_tbl")) { // warehouse table
        dt = $('.warehouse_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 25,
          "fnDrawCallback": function( oSettings ) {
            $("#example_processing").addClass('hide');
            $("#table_warehouse").removeClass('hide');
            },
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
           aaSorting: [[ 0, "desc" ]],
         
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }


     else if ($(elem).hasClass("invce_tbl")) { // invoice table
        dt = $('.invce_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 25,
          "fnDrawCallback": function( oSettings ) {
            $("#example_processing").addClass('hide');
            $("#table_invoice").removeClass('hide');
            },
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
        //  aaSorting: [[2,'desc']], aoColumnDefs: [ { "sType": "date-euro", "aTargets": [ 2 ] } ],

           aaSorting: [[ 0, "desc" ]],"bAutoWidth"       : false,
           aoColumnDefs: [
      { "iDataSort": 0, "aTargets": [ 1 ] },{ "iDataSort": 2, "aTargets": [ 3 ] },{ "iDataSort": 5, "aTargets": [ 6 ] },
      { "sWidth": "15%", "aTargets": [ 1 ] },{ "sWidth": "10%", "aTargets": [ 3 ] },{ "sWidth": "20%", "aTargets": [ 4 ] },
    { "sWidth": "10%", "aTargets": [ 6 ] },{ "sWidth": "5%", "aTargets": [ 7 ] },{ "sWidth": "30%", "aTargets": [ 8 ] }
    ],
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }
      else if ($(elem).hasClass("purchase_order_tbl")) { // purchase order table
        dt = $('.purchase_order_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 25,
          "fnDrawCallback": function( oSettings ) {
            $("#example_processing").addClass('hide');
            $("#table_purchase_order").removeClass('hide');
            },
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
        //  aaSorting: [[2,'desc']], aoColumnDefs: [ { "sType": "date-euro", "aTargets": [ 2 ] } ],

           aaSorting: [[ 0, "desc" ]],"bAutoWidth"       : false,
           aoColumnDefs: [
      { "iDataSort": 1, "aTargets": [ 2 ] },{ "iDataSort": 3, "aTargets": [ 4 ] },{ "iDataSort": 5, "aTargets": [ 6 ] }
    ],
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }
  
      else if ($(elem).hasClass("estimate_tbl")) { // estimate table
        dt = $('.estimate_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 25,
          "fnDrawCallback": function( oSettings ) {
            $("#example_processing").addClass('hide');
            $("#table_estimate").removeClass('hide');
            },
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
        //  aaSorting: [[2,'desc']], aoColumnDefs: [ { "sType": "date-euro", "aTargets": [ 2 ] } ],

           aaSorting: [[ 0, "desc" ]],"bAutoWidth"       : false,
           aoColumnDefs: [
      { "iDataSort": 0, "aTargets": [ 1 ] },{ "iDataSort": 2, "aTargets": [ 3 ] },{ "iDataSort": 5, "aTargets": [ 6 ] },
      { "sWidth": "15%", "aTargets": [ 1 ] },{ "sWidth": "10%", "aTargets": [ 3 ] },{ "sWidth": "20%", "aTargets": [ 4 ] },
    { "sWidth": "10%", "aTargets": [ 6 ] },{ "sWidth": "5%", "aTargets": [ 7 ] },{ "sWidth": "30%", "aTargets": [ 8 ] }
    ],
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }
     else if ($(elem).hasClass("purchase_tbl")) { // purchase table
        dt = $('.purchase_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 25,
          "fnDrawCallback": function( oSettings ) {
            $("#example_processing").addClass('hide');
            $("#table_purchase").removeClass('hide');
            },
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
        //  aaSorting: [[2,'desc']], aoColumnDefs: [ { "sType": "date-euro", "aTargets": [ 2 ] } ],

           aaSorting: [[ 0, "desc" ]],"bAutoWidth"       : false,
           aoColumnDefs: [
      { "iDataSort": 1, "aTargets": [ 2 ] },{ "iDataSort": 4, "aTargets": [ 5 ] }
    ],
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }

      else if ($(elem).hasClass("admin_usr_tbl")) {
        dt = $('.admin_usr_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 10,
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
        //  aaSorting: [[2,'desc']], aoColumnDefs: [ { "sType": "date-euro", "aTargets": [ 2 ] } ],

           aaSorting: [[ 0, "desc" ]],
           aoColumnDefs: [
      { "iDataSort": 5 , "aTargets": [ 6 ] } , { "iDataSort": 8, "aTargets": [ 9 ] }
    ],
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }else if ($(elem).hasClass("outstanding_invce_tbl")) {
        dt = $('.outstanding_invce_tbl').dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 10,
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
        //  aaSorting: [[2,'desc']], aoColumnDefs: [ { "sType": "date-euro", "aTargets": [ 2 ] } ],

           aaSorting: [[ 0, "desc" ]],
           aoColumnDefs: [
      { "iDataSort": 0 , "aTargets": [ 1 ] } , { "iDataSort": 2, "aTargets": [ 3 ] },{ "iDataSort": 4, "aTargets": [ 5 ] },{ "iDataSort": 6, "aTargets": [ 7 ] }
      ,{ "iDataSort": 8, "aTargets": [ 9 ] },{ "iDataSort": 10, "aTargets": [ 11 ] }
    ],
    sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
        });
      }
      else{
        dt = $(elem).dataTable({
          sDom: sdom,
          sPaginationType: "bootstrap",
          "iDisplayLength": $(elem).data("pagination-records") || 10,
          oLanguage: {
            sLengthMenu: "_MENU_ records per page"
          },
           aaSorting: [[ 0, "desc" ]],
          sDom: 'lf<"clear"><"datatable-scroll"t><"pull-right"p>i',
           
        });
      }
        if ($(elem).hasClass("data-table-column-filter")) {
          dt.columnFilter();
        }
        dt.closest('.dataTables_wrapper').find('div[id$=_filter] input').css("width", "200px");
        return dt.closest('.dataTables_wrapper').find('input').addClass("form-control input-sm").attr('placeholder', 'Search');
      });
    }
  };

  this.setValidateForm = function(selector) {
    if (selector == null) {
      selector = $(".validate-form");
    }
    if (jQuery().validate) {
      return selector.each(function(i, elem) {
        return $(elem).validate({
          errorElement: "span",
          errorClass: "help-block has-error",
          errorPlacement: function(e, t) {
            return t.parents(".controls").first().append(e);
          },
          highlight: function(e) {
            return $(e).closest('.form-group').removeClass("has-error has-success").addClass('has-error');
          },
          success: function(e) {
            return e.closest(".form-group").removeClass("has-error");
          }
        });
      });
    }
  };
$(document).ready(function() {
   
  $('.alert-warning').delay(3000).hide('highlight', {color: '#00ACEC'}, 1500);

  });
}).call(this);


$(document).ready(function(){
  $('.toggle-nav').click(function(){
      $('html, body').animate({scrollTop : 0},800);
      return false;
    });
});

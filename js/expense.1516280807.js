var ExpenseModule = angular.module('ExpenseModule', ['ui.bootstrap', 'ui.directives', 'toaster', 'ngTable']);
//---------------------button group for selecting table view in expenses------------
ExpenseModule.directive('buttonsRadio', function() {
        return {
            restrict: 'E',
            scope: { model: '=', options:'='},
            controller: function($scope){
                $scope.activate = function(option){
                    $scope.model = option;
                };      
            },
            template: "<button type='button' class='btn  btn-danger' "+
                        "ng-class='{active: option == model}'"+
                        "ng-repeat='option in options' "+
                        "ng-click='activate(option)'>{{option}} "+
                      "</button>"
        };
    });
//---------------------ends -------------------------------------------

//------------------------filters used for sorting date fxn----------------
ExpenseModule.filter('offset', function () {
  return function (input, start) {
    if (!input) return [];
    start = parseInt(start, 10);
    return input.slice(start);
  };
})

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
ExpenseModule.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        if(input){
           return input.slice(start);
        }
      
    }
});
//---------------------------ends---------------------------

//-------------------------indian currency directive-----------------------
ExpenseModule.filter('IndianFractionCurrency',
    [ '$filter', '$locale', function(filter, locale) {
      var currencyFilter = filter('currency');
      var formats = locale.NUMBER_FORMATS;
      return function(amount, currencySymbol) {
        var value = currencyFilter(amount, currencySymbol);
        var sep = value.indexOf(formats.DECIMAL_SEP);
        //console.log(amount, value);
        if(amount >= 0) { 
           var x=parseFloat(amount).toFixed(2);
                x=x.toString();
                //console.log(x);
                var afterPoint = '';
                if(x.indexOf('.') > 0)
                   afterPoint = (x.substring(x.indexOf('.'),x.length)).substring(0, 3);
                   //afterPoint=decVal.substring(0, 3);
                x = Math.floor(x);
                x=x.toString();
                var lastThree = x.substring(x.length-3);
                var otherNumbers = x.substring(0,x.length-3);
                if(otherNumbers != '')
                    lastThree = ',' + lastThree;
                var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + afterPoint;
                     // console.log(res);
                     return res;
          return value.substring(0, sep);
        }
        return value.substring(0, sep) + ')';
      };
    } ]);
//--------------------------ends----------------------------------------------------
ExpenseModule.controller('ExpenseCtrl',['$scope', '$modal', '$rootScope', 'toaster', '$filter', '$timeout','$http','ngTableParams',
  function($scope, $modal, $rootScope, toaster, $filter,$timeout,$http, ngTableParams) {
      //-------------initalisation for angular variables and objects----------------
      $scope.ready = 1;
      $scope.Expnse_form={};
      $scope.Expnse_form.Expense={};
      $scope.Expnse_form.Vendor={};
      $scope.Expnse_form.ExpenseType={};
      $scope.Options = ["All", "By Category", "By Vendor"];
      $scope.show_expense = "All";
      $scope.check_table={};
      $scope.numPages = 0;  // # pages
      $rootScope.direction = 'right';  
      $scope.show_allcat = 0;
      $scope.cat_list_hover = 0;
      $scope.add_category = 0;
      $scope.add_cat_hover = 0;
      $scope.recent_expense_id = 0;
      $scope.warning = 0;
      $scope.category_error = 0;
      $scope.total_amt = 0;
      $scope.category_total = 0;
      $scope.vendor_total = 0;
      $scope.exe_save = 0;
      $scope.saving = 1;
      $scope.edit = 0;
      $scope.cancel_btn = 0;
      $scope.static_link_placeholder = 0;
      $scope.categories =[];                                       // initially can only move right
      $scope.date_range={};
      $scope.attachments='';
      //-------------initalisation for angular variables and objects ends here----------------
      //----------------------------Expense date setting fxn--------------------------------
      function ddmmyyyy() {
      var d = new Date();
      var yyyy = d.getFullYear().toString();
      var mm = (d.getMonth()+1).toString(); // getMonth() is zero-based
        var dd  = d.getDate().toString();
        return (dd[1]?dd:"0"+dd[0])+'-'+ (mm[1]?mm:"0"+mm[0]) +'-'+yyyy; // padding
     }
     //----------------------------Expense date setting fxn ends here--------------------------------
      var date=new Date("YYYY-mm-dd");
      $scope.Expnse_form.Expense.date=ddmmyyyy();
      $scope.Expnse_form.Expense.id=0;
      //---------------------------attachment view modal init--------------------
      $scope.load_modal = function (size,user) {
         var id=user.id;
        $http.post('/expenses/attachment_view',id.toString()).success(function(response){
          $scope.attachmentview_info = response;
        });
        $timeout(function() {
          var modalInstance = $modal.open({      
                  templateUrl: 'attachmentprocess.html',
                  controller: 'AttachmentCtrl',
                  size: size,
                  resolve : {
                    attachmentinfo: function () {
                    return $scope.attachmentview_info; 
                  }
                }
          });
        }, 1000);
        
   };
   //---------------------------attachment view modal init ends here--------------------

  //---------------------------set Expense date in the view--------------------
    $scope.setdate=function(val){
      $scope.Expnse_form.Expense.date = val;
    }
  //---------------------------set Expense date in the view ends here--------------------


  //------------------------------export to excel starts-----------------------------
    $scope.export_excel = function(){
      var check = $scope.show_expense;
      if(check == 'All'){
        /*var blob = new Blob([document.getElementById('expotable').innerHTML],{
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "expense_report.xls");*/
        $scope.data_ran={};
        $http.post('/expenses/allexpenses_export',{data_ran:$scope.export_init}).success(function(response){
          if(response.status=="success"){
            $("#cons_inv_download").attr("href", response.file_path);
            $("#cons_inv_download").get(0).click();
          }else{
            toaster.pop('warning', "Sorry", "The selected date range has no data to export.");
          }
        });
      }

      else if(check == 'By Category'){
        /*var blob = new Blob([document.getElementById('export_cat').innerHTML], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "category_expense_report.xls");*/
        $scope.data_ran={};
        if($scope.category_table.length > 0) {
          $http.post('/expenses/catexpenses_export',{data_ran:$scope.category_table}).success(function(response){
            if(response.status=="success"){
              $("#cons_inv_download").attr("href", response.file_path);
              $("#cons_inv_download").get(0).click();
            }else{
              toaster.pop('warning', "Sorry", "The selected date range has no data to export.");
            }
          });
        } else {
          toaster.pop('warning', "Sorry", "The selected date range has no data to export.");
        }
      }

      else if(check == 'By Vendor'){
        /*var blob = new Blob([document.getElementById('export_vendor').innerHTML], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "vendor_expense_report.xls");*/
        $scope.data_ran={};
        if($scope.vendor_table.length > 0) {
          $http.post('/expenses/venexpenses_export',{data_ran:$scope.vendor_table}).success(function(response){
            if(response.status=="success"){
              $("#cons_inv_download").attr("href", response.file_path);
              $("#cons_inv_download").get(0).click();
            }else{
              toaster.pop('warning', "Sorry", "The selected date range has no data to export.");
            }
          });
        } else {
          toaster.pop('warning', "Sorry", "The selected date range has no data to export.");
        }
      }
    }
  //------------------------------export to excel ends-----------------------------

  //---------------------------focus out category fxn--------------------
    $scope.focusout_category=function(){
      if($scope.cat_list_hover == 0){
        $scope.show_allcat = 0;
      }else{
        $scope.show_allcat = 1;
      }
      if($scope.add_cat_hover == 0){
        $scope.add_category = 0;
        $scope.cat_input = 0;
      }else{
        $scope.add_category = 1;
        $scope.cat_input = 1;
      } 
    }
  //---------------------------focus out category fxn ends here--------------------

  //---------------------------add new category tab fxn--------------------
    $scope.show_category_toadd=function(){
      $('#add_new_link').addClass('hide');
      $scope.cat_input = 1;
      $('#add_categ_input').focus();
    }
  //---------------------------add new category tab fxn ends here--------------------

  //---------------------------add new category fxn--------------------
    $scope.add_new_cat=function(new_name){
      if(new_name.length == 0){
        var $toast = toastr['error']('Enter a value to add category', 'Caution');
        $scope.add_category = 0;
      }else{
        $http.post('/expenses/addnew_category',{name:new_name}).success(function(response){
          //$scope.Expnse_form.ExpenseType.id = response.id;
          if($scope.category_error == 1){
            $scope.category_error = 0;
          }
          if(response.status){
            var $toast = toastr['warning']('Category Already Exists');
            $scope.Expnse_form.ExpenseType.name = response.cat_name;
            $scope.Expnse_form.ExpenseType.id = response.cat_id;
          }else{
            var $toast = toastr['success']('New Category Added');
            $scope.Expnse_form.ExpenseType.id = response.ExpenseType_id;
          }
          $scope.add_category = 0;
      $scope.get_category_name_new();
       });
      }
    }
    //---------------------------add new category fxn ends here--------------------

    //---------------------------set category id on typeahead select fxn--------------------
    $scope.set_catid_typehead = function(item){
      $scope.Expnse_form.ExpenseType.id = item.id;
    }
    //---------------------------set category id on typeahead select fxn ends here--------------------

    $scope.uploadFile = function(files) {      
      $scope.files=files;
    }
    $scope.setvendor_name=function(val){
      $scope.Expnse_form.Vendor.name = val;
    }
    //---------------------------set vendor details on typeahead select fxn--------------------
    $scope.setvendor_detail=function(id,phoneno,email,addr){
      $scope.Expnse_form.Vendor.phone_no = phoneno;
      $scope.Expnse_form.Vendor.email_id = email;
      $scope.Expnse_form.Vendor.addr = addr;
      $scope.Expnse_form.Vendor.id = id;
    }
     //---------------------------set vendor details on typeahead select fxn ends here--------------------

    $scope.setvendor_detail_categoryexist=function(id,phoneno,email,addr,category_name,category_id){
        $scope.Expnse_form.Vendor.phone_no = phoneno;
        $scope.Expnse_form.Vendor.email_id = email;
        $scope.Expnse_form.Vendor.addr = addr;
        $scope.Expnse_form.Vendor.id = id;
    }
    //---------------------------delete attachment fxn--------------------
    $scope.delete_attachment=function(attachments){
      $http.post('/expenses/del_attachment',attachments.id).success(function(response){
          $scope.attachments.splice($scope.attachments.indexOf(attachments), 1);
      });
    }
    //---------------------------delete attachment fxn ends here--------------------

    //---------------------------clear fields fxn--------------------
    $scope.clear_fields=function(){
      $scope.Expnse_form.Vendor.phone_no = '';
      $scope.Expnse_form.Vendor.email_id = '';
      $scope.Expnse_form.Vendor.addr = '';
      $scope.Expnse_form.Vendor.id = '0';
    }
    //---------------------------clear fields fxn ends here--------------------

    //---------------------------edit cancel fxn--------------------
    $scope.edit_cancel=function(){
      $scope.clear_fields();
      $scope.Expnse_form.Expense.amount='';
      $scope.Expnse_form.Expense.description='';
      $scope.Expnse_form.Expense.id='0';
      $scope.Expnse_form.Vendor.name='';
      $scope.Expnse_form.ExpenseType.final_name='';
      $scope.Expnse_form.ExpenseType.id='';
      $scope.Expnse_form.ExpenseType.name=''; 
      $scope.Expnse_form.Expense.date=ddmmyyyy();
      $('#ven_phone').addClass('hide');
      $('#ven_email').addClass('hide');
      $('#ven_addr').addClass('hide');
      var control = $('#expenses_attachment');
      control.replaceWith( control = control.clone( true ) );
      $('#expenses_attachment').val('');
      $scope.attachments={};
      $scope.files={};
      $scope.cancel_btn = 0;
    }
    //---------------------------edit cancel fxn ends here--------------------


    //---------------------------pg limit change fxn for expense table--------------------
    $scope.page_limit_change=function(){
      $scope.currentPage_category=0;
      $scope.total_pg = Math.ceil($scope.category_items/$scope.pgsize);
    }
     //---------------------------pg limit change fxn for expense table ends here--------------------

     //---------------------------pg limit change fxn for vendor table--------------------
    $scope.vendor_page_limit_change=function(){
      $scope.currentPage_vendor=0;
      $scope.ven_total_pg = Math.ceil($scope.vendor_items/$scope.ven_pgsize);
    }
    //---------------------------pg limit change fxn for vendor table ends here--------------------

    //---------------------------fetch all category list fxn--------------------
     $scope.get_category_list=function(){
        $http.post('/expenses/get_expense_type_default').success(function(response){
             var category_option = response;
              if(category_option != null){
                angular.forEach(category_option, function(option) {
                  $scope.categories.push(option);
                });
                var link = {'name' : 'Add New Category'};
                $scope.categories.push(link);
              }
             
          });
    }
    //---------------------------fetch all category list fxn ends here--------------------
    $scope.get_category_list();
    //---------------------------category name len fxn--------------------
    $scope.catlen=function(){
      if($scope.Expnse_form.ExpenseType.name){
        $scope.show_allcat = 0;
      }else{
        $scope.show_allcat = 1;
        $scope.add_category = 0;
      }
      
    }
    //---------------------------category name len fxn ends here--------------------

  //---------------------------category keypress fxn--------------------------
  $scope.category_keypress=function(e){
    if($scope.show_allcat == 1){
      var total_item = $scope.categories.length;
      $nxt_id = 0;
      $prev_id = 0;

        if(e.keyCode == 40){
          if($('#all_category > li').hasClass('selected')){
            $('#all_category > li').each(function(){
              if($(this).hasClass('selected')){
                $this = $(this);
                $nxt = $this.next();
                $nxt_id = $nxt.attr('id');
                $this_id = $this.attr('id');
                if($nxt_id != undefined){
                  $('#'+$this_id).removeClass('selected');
                    //console.log($this_id);
                    var container = $('#all_category'),
                    scrollTo = $('#'+$nxt_id);
                   container.animate({
                    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                  });
                 }
              }
            });
            if($nxt_id != 0){
              $('#'+$nxt_id).addClass('selected');
            }
          }else{
             $('#list_element0').addClass('selected');
             var container = $('#all_category'),
                    scrollTo = $('#list_element0');

                   container.animate({
                    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                  });
          }
        
        }

        if(e.keyCode == 38){
          if($('#all_category > li').hasClass('selected')){
            $('#all_category > li').each(function(){
              if($(this).hasClass('selected')){
                $this = $(this);
                $prev = $this.prev();
                $prev_id = $prev.attr('id');
                $this_id = $this.attr('id');
                if($this_id != 'list_element0'){
                  $('#'+$this_id).removeClass('selected');
                
                 var container = $('#all_category'),
                    scrollTo = $('#'+$prev_id);

                   container.animate({
                    scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                  });
                 }
              }
            });
            if($prev_id != 0){
              $('#'+$prev_id).addClass('selected');
            }
          }
        }

      if(e.keyCode == 13){
        e.preventDefault();
        if($('#all_category > li').hasClass('selected')){
          $('#all_category > li').each(function(){
            if($(this).hasClass('selected')){
              $this = $(this);
              $this_id = $this.attr('id');
              var static_link_placeholder = $scope.categories.length-1;
              if($this_id == 'list_element'+static_link_placeholder){
                $scope.open_add_cat();
                $scope.show_allcat = 0;
              }else{
                $scope.Expnse_form.ExpenseType.name = $('#'+$this_id).find('.val').html();
                $scope.Expnse_form.ExpenseType.id = $('#'+$this_id).find('.cat_id').html();
                var container = $('#all_category'),
                      scrollTo = $('#list_element0');

                     container.animate({
                      scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop()
                    });
                     $('#'+$this_id).removeClass('selected');
                      $scope.show_allcat = 0;
              }
            }
          });
        }
      }
    }     
    setTimeout(function() {
      var attr = $('#category').attr('aria-expanded');
      if(attr == 'true'){
       
          var active = $('#category').attr('aria-activedescendant');
          var len = active.length-1;
          var index = active.substr(len);
          if(index == $scope.static_link_placeholder){
              if(e.keyCode == 13){
                $('#category').next().addClass('hide');
                e = document.getElementById('ExpenseCtrl');  
                 scope = angular.element(e).scope();
                 scope.$apply(function(){
                   scope.open_add_cat();
                   });

              } 

          }
        
      }
    }, 300);
    
  }
//---------------------------category keypress fxn ends here-------------------- 

//---------------------------new category add fxn-------------------- 
  $scope.keypressadd_cat=function(e,new_name){
    if(e.keyCode == 13){
      e.preventDefault();
      $scope.cat_input = 0;
      if(new_name.length == 0){
        var $toast = toastr['error']('Enter a value to add category', 'Caution');
        $scope.add_category = 0;
      }else{
        $http.post('/expenses/addnew_category',{name:new_name}).success(function(response){
          //$scope.Expnse_form.ExpenseType.id = response.id;
          var $toast = toastr['success']('New Category Added');
          $scope.Expnse_form.ExpenseType.id = response.ExpenseType_id;
       });
      $scope.add_category = 0;
      $scope.get_category_name_new();
      //$scope.show_allcat = 1;
      }
    }
  }
  //---------------------------new category add fxn ends here-------------------- 

//---------------------------category change fxn-------------------- 
    $scope.category_change=function(){
      setTimeout(function() {
        var attr = $('#category').attr('aria-expanded');
        if(attr == 'true'){
          var first_li = $('#category').next().children();
          var static_link = first_li[$scope.static_link_placeholder];
          $(static_link).on('click',function(){
            e = document.getElementById('ExpenseCtrl'); 
            //console.log(e);  
           scope = angular.element(e).scope();
           scope.$apply(function(){
             scope.open_add_cat();
             });
          });  

        }
      }, 300);
      
      if($scope.add_category == 0){
        $scope.show_allcat = 0;
      }
      if($scope.Expnse_form.ExpenseType.name.length == 0){
        $scope.show_allcat = 1;
        $scope.add_category = 0;
      }
      $('#add_new_link').removeClass('hide');
      $scope.cat_input = 0;
    }
  //---------------------------category change fxn ends here-------------------- 

  //---------------------------new category tab open fxn-------------------- 
    $scope.open_add_cat=function(){
      $timeout(function() {
        $('#add_new_link').addClass('hide');
         $('#add_categ_input').focus();
        // angular.element('#add_categ_input').trigger('focus');
        $scope.add_category = 1;
        $scope.cat_input = 1;
      }, 100);

    }
//---------------------------new category tab open fxn ends here-------------------- 

//---------------------------toggle btw category lists fxn-------------------- 
    $scope.get_category_name=function(){
      if($scope.Expnse_form.ExpenseType.name){
        $scope.show_allcat = 0;
      }else{
        $scope.show_allcat = 1;
        $scope.add_category = 0;
        $scope.cat_input = 0;
      }
    }
//---------------------------toggle btw category lists fxn ends here-------------------- 

//---------------------------fetch category lists for typeahead fxn-------------------- 
    $scope.getcategory=function(val){
      return $http.get('/expenses/typehead_category', {
        params: {
          address: val,
          sensor: false
        }
      }).then(function(response){
        $scope.Expnse_form.ExpenseType.id = '';
        if(response.data.length != 0){
          $scope.show_allcat = 0;
          $scope.add_category = 0;
         var typeahead_category = [];
           angular.forEach(response.data, function(item){
            typeahead_category.push(item);
           });
           var link = {'name' : '<li id="static_id" onclick="try_link()">Add New Category</li>'};
         typeahead_category.push(link);
          $scope.static_link_placeholder = typeahead_category.length-1;
           return typeahead_category;
        }
        else{
          var nothing = '';
          $scope.show_allcat = 0;
          $scope.add_category = 1;
          return nothing;
         }
          
        });
      
    }
//---------------------------fetch category lists for typeahead fxn ends here-------------------- 

//---------------------------click on static link fxn for add new category-------------------- 
    $scope.link=function(){
      $scope.add_category = 1; 
      $scope.cat_input = 1;
      $('#add_categ_input').focus();
      $scope.Expnse_form.ExpenseType.name = '';
    }
//---------------------------click on static link fxn for add new category ends here-------------------- 

//---------------------------fetch newly added category after adding new fxn-------------------- 
    $scope.get_category_name_new=function(){
      $http.post('/expenses/get_expense_type_default').success(function(response){
          var category_option = response;
          if(category_option != null){
            var cat_len = $scope.categories.length;
              if(response.length == cat_len){
                angular.forEach(category_option, function(option, $key) {
                  if($key == response.length-1){
                    var len = $scope.categories.length-1;
                    $scope.categories.pop();
                    $scope.categories.push(option);
                    var link = {'name' : 'Add New Category'};
                    $scope.categories.push(link);
                  }
                });

              }
          }
      });
    }
 //---------------------------fetch newly added category after adding new fxn ends here--------------------

 //---------------------------set category for to input field fxn--------------------
    $scope.set_category=function(category,id){
      var static_link_placeholder = $scope.categories.length-1;
      if(id == 'list_element'+static_link_placeholder){
        $scope.open_add_cat();
        $scope.show_allcat = 0;
      }else{
        $scope.Expnse_form.ExpenseType.name = category.name;
        $scope.Expnse_form.ExpenseType.id = category.id;
        $scope.show_allcat = 0;
      }
      
    }
 //---------------------------set category for to input field fxn ends here--------------------

  //---------------------------set the expense data into the table fxn--------------------
      $scope.table_data=function(){
        $scope.expen_init={};
        $scope.export_init = {};
        if($scope.exe_save == 0){
          $scope.recent_expense_id = '';
        }
        
      $http.post('/expenses/get_expense_details',$scope.date_range).success(function(response){ 
        
          if(response.total==0){
            $scope.check_table=false;
          }else{
            $scope.check_table=true;
          }
           $scope.expen_init = response.table;
           $scope.export_init = response.table;
           $scope.total_amt=response.total;
           $scope.tableParams.reload(); 

        });      
      }
 //---------------------------set the expense data into the table fxn ends here--------------------          
          $scope.table_data();
  //---------------------------expense data-table config--------------------         
          $scope.tableParams = new ngTableParams({
                      page: 1,            // show first page
                      count: 10,
                      sorting: {
                        id : 'desc'     // initial sorting
                      }        // count per page
          }, {
              total: $scope.expen_init.length, // length of data
              getData: function($defer, params) {
                if(($scope.expen_init) && ($scope.expen_init.length > 0)){
                  $timeout(function() {
                      // use build-in angular filter
                      var filteredData = params.filter() ?
                              $filter('filter')($scope.expen_init, params.filter()) :
                              $scope.expen_init; 

                     var orderedData = params.sorting() ?
                      $filter('orderBy')(filteredData, params.orderBy()) :
                      data;
                      params.total(orderedData.length); // set total for recalc pagination 
                      if(orderedData.length > 0){
                         $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        $scope.ready = 0;
                        if($scope.exe_save == 1){
                          $('#expense_table').removeClass('list_effect');
                          setTimeout(function() {
                          var $toast = toastr['success']('Expenses updated', 'Success');
                           }, 1500);
                          setTimeout(function() {
                            $('#expense_table').addClass('list_effect');
                          }, 3500);
                          $scope.exe_save = 0;
                        }
                       $('#expense_body').removeClass('hide');
                        $('#loader').addClass('hide');
                      }
                     
                   }, 1000);
                }else{
                        $('#expense_body').removeClass('hide');
                        $('#loader').addClass('hide');
                      }
                
              }
          }); 
//---------------------------expense data-table config ends here-------------------- 

//---------------------------getting data for expense data-table-------------------- 
    $scope.get_catagory_tabledata=function(){
      var aggregate_amt = 0;
        var category_names = 0;
        $scope.category_table=[];
        var category_table=[];
        var total = 0;
          $http.post('/expenses/get_aggregate_expensetype',$scope.date_range).success(function(response){ 
            $scope.currentPage_category = 0;
            $scope.category_items = response.length;
              $scope.total_pg = Math.ceil(response.length/$scope.pgsize);    
            angular.forEach(response,function(response, key){
              aggregate_amt = response['0']['category_aggregate_amount'];
              category_names = response['ExpenseType']['name'];
              total=total+ parseFloat(aggregate_amt);
              if((response['ExpenseType']['name'] == null) || (response['ExpenseType']['name'] == '')){
                category_names = "Undefined";
              }
             category_table.push({"amount":aggregate_amt,"name":category_names});
            });
             $scope.category_table=category_table;
             total = total.toFixed(2);
             $scope.category_total=total;
          });
    }
//---------------------------getting data for expense data-table ends here-------------------- 

//---------------------------getting data for vendor table fxn-------------------- 
    $scope.get_vendor_tabledata=function(){
      var aggregate_amt = 0;
        var vendor_names = 0;
        $scope.vendor_table=[];
        var vendor_table=[];
        var total = 0;
        var total_final = 0;
        $http.post('/expenses/get_aggregate_vendor',$scope.date_range).success(function(response){ 
          $scope.currentPage_vendor = 0;
              $scope.ven_total_pg = Math.ceil(response.length/$scope.ven_pgsize);
              $scope.vendor_items = response.length;
          angular.forEach(response,function(response, key){
              aggregate_amt = response['0']['vendor_aggregate_amount'];
              vendor_names = response['Vendor']['name'];
              total=total+parseFloat(aggregate_amt);
              if(response['Vendor']['name'] == null){
                vendor_names = "Undefined";
              }
             vendor_table.push({"amount":aggregate_amt,"name":vendor_names});
            });
            $scope.vendor_table=vendor_table;
            total = total.toFixed(2);
            $scope.vendor_total=total;
        });
    }
//---------------------------getting data for vendor table fxn ends here-------------------- 

//---------------------------sorting table data fxn-------------------- 
    $scope.sorting_table=function(){
      var check = $scope.show_expense;
      if(check == 'All'){

        $('#table_wrapper').show();
        $('#category_table').addClass('hide');
        $('#vendor_table').addClass('hide');
        $('#all_total').removeClass('hide');
        $('#category_total').addClass('hide');
        $('#vendor_total').addClass('hide');
        //$scope.expen_init={};
        $scope.table_data();
      }
      if(check == 'By Category'){
          $('#daterange').daterangepicker('option', {minDate: null, maxDate: null});
        $('#table_wrapper').hide();
        $('#category_table').removeClass('hide');
        $('#vendor_table').addClass('hide');
        $('#all_total').addClass('hide');
        $('#category_total').removeClass('hide');
        $('#vendor_total').addClass('hide');
        $scope.get_catagory_tabledata();
      }
      if(check == 'By Vendor'){
        $('#table_wrapper').hide();
        $('#category_table').addClass('hide');
        $('#vendor_table').removeClass('hide');
        $('#all_total').addClass('hide');
        $('#category_total').addClass('hide');
        $('#vendor_total').removeClass('hide');
        $scope.get_vendor_tabledata();
      }
    }
//---------------------------sorting table data fxn ends here-------------------- 

//---------------------------fetch newly added expense data and set in table fxn-------------------- 
    $scope.update_expense=function(response){
      if($scope.edit == 1){
        $scope.table_data();
        $scope.tableParams.reload();
      }else{
        if($scope.expen_init){
          $scope.expen_init.push(response.table);
        }else{
          $scope.table_data();
        }
        
         if($scope.exe_save == 0){
          $scope.recent_expense_id = '';
        }
        if($scope.exe_save == 1){
          $('#expense_table').removeClass('list_effect');
          setTimeout(function() {
            $('#expense_table').addClass('list_effect');
          }, 3500);
          $scope.exe_save = 0;
        }
        $scope.total_amt =  parseFloat($scope.total_amt) +  parseFloat(response.table.amount);
        $scope.tableParams.reload();
        setTimeout(function() { 
          var $toast = toastr['success']('Expenses added', 'Success');
        }, 1500);
       
      }
    }
//---------------------------fetch newly added expense data and set in table fxn ends here-------------------- 

//---------------------------Expense save fxn-------------------- 
    $scope.save=function($event){
      $scope.tableParams.sorting({id : 'desc'});
      if($scope.form_expense.$valid){
        $scope.warning = 0;
        
        $scope.cancel_btn = 0;
      var fd = new FormData();
        var uploadUrl = '/expenses/upload';
        //Take the first selected file
        if($scope.Expnse_form.Expense.id == 0){
          $scope.edit = 0;
        }else{
          $scope.edit = 1;
        }
        angular.forEach($scope.files,function(file, key){
          fd.append("file"+[key], file);

        });
        fd.append("Expense", angular.toJson($scope.Expnse_form.Expense));
        fd.append("Vendor",angular.toJson($scope.Expnse_form.Vendor));
       
        if($scope.Expnse_form.ExpenseType.id){
          fd.append("ExpenseType", angular.toJson($scope.Expnse_form.ExpenseType));

        }if($scope.Expnse_form.ExpenseType.id == '0'){
          fd.append("ExpenseType", angular.toJson($scope.Expnse_form.ExpenseType));
        }
        var obj = angular.toJson(fd);
        if($scope.add_category == 1){
        $scope.category_error = 1;
        }
        else{
           $scope.saving = 0;
          $scope.category_error = 0;
          $http.post('/expenses/save_expenses',fd, {
              withCredentials: true,
              headers: {'Content-Type': undefined },
              transformRequest: angular.identity

          })
          .success(function(response){ 
           $scope.exe_save = 1;
         $scope.saving = 1;
            //console.log(response);
            $scope.update_expense(response);

         $scope.recent_expense_id = response.table.id;
          $('#expense_amount').focus();
          
           // tableParams.reload();
            $scope.clear_fields();
            $scope.Expnse_form.Expense.amount='';
            $scope.Expnse_form.Expense.description='';
            $scope.Expnse_form.Expense.id='0';
            $scope.Expnse_form.Vendor.name='';
            $scope.Expnse_form.ExpenseType.final_name='';
            $scope.Expnse_form.ExpenseType.id='';
            $scope.Expnse_form.ExpenseType.name=''; 
            $scope.Expnse_form.Expense.date=ddmmyyyy();
            $('#ven_phone').addClass('hide');
            $('#ven_email').addClass('hide');
            $('#ven_addr').addClass('hide');
            var control = $('#expenses_attachment');
            control.replaceWith( control = control.clone( true ) );
            $('#expenses_attachment').val('');
            $scope.attachments={};
            $scope.files={};
          });
        }
      
    }
      if(($('#desc').val().length != 0) && ($scope.amt.$error.pattern != false)){
          $scope.warning = 0;
        }
        if(($('#expense_amount').val().length == 0)){
          $scope.warning = 1;
        }
        if(($('#desc').val().length == 0)){
          $scope.warning = 1;
        }
    }
//---------------------------Expense save fxn ends here-------------------- 

//---------------------------Expense edit set data fxn-------------------- 
    $scope.set_data = function (user) {
      $scope.cancel_btn = 1;
      var id=user.id;
      $http.post('/expenses/edit', id.toString()).success(function(response){
          $scope.Expnse_form.Expense.date= response['Expense']['date'];
          $scope.Expnse_form.Expense.amount=response['Expense']['amount'];
          $scope.Expnse_form.Expense.description=response['Expense']['description'];
          $scope.Expnse_form.Expense.id=response['Expense']['id'];
          $scope.Expnse_form.Vendor.name=response['Vendor']['name'];
          $scope.Expnse_form.Vendor.id=response['Vendor']['id'];
          $scope.Expnse_form.Vendor.phone_no = response['Vendor']['phone_no'];
          $scope.Expnse_form.Vendor.email_id = response['Vendor']['email_id'];
          $scope.Expnse_form.Vendor.addr = response['Vendor']['addr'];
          $scope.Expnse_form.ExpenseType.id=response['ExpenseType']['id'];
          $scope.Expnse_form.ExpenseType.name=response['ExpenseType']['name'];
          if(response['attachment']){
            $scope.attachments=response['attachment'];
          }
          else{
            $scope.attachments='';
          }
          if(response['ExpenseType']['name'] == null){
            $('.select2-chosen').html('Select category');
          }else{
             $('.select2-chosen').html(response['ExpenseType']['name']);
          }
         
          $('#ven_phone').removeClass('hide');
          $('#ven_email').removeClass('hide');
          $('#ven_addr').removeClass('hide');
      });
    } 
//---------------------------Expense edit set data fxn ends here-------------------- 

//---------------------------delete Expense fxn-------------------- 
    $scope.delete_expense = function (user){
      var action=confirm("Are you sure you want to delete?");
      if (action==true){
        $http.post('/expenses/delete', user.id.toString()).success(function(response){
          if(response.status == 'success'){
            var $toast = toastr['success']('Expense Deleted');
            $scope.table_data();
            $scope.clear_fields();
            $scope.Expnse_form.Expense.amount='';
            $scope.Expnse_form.Expense.description='';
            $scope.Expnse_form.Expense.id='0';
            $scope.Expnse_form.Vendor.name='';
            $scope.Expnse_form.ExpenseType.final_name='';
            $scope.Expnse_form.ExpenseType.id='';
            $scope.Expnse_form.ExpenseType.name=''; 
            $scope.Expnse_form.Expense.date=ddmmyyyy();
            $('#ven_phone').addClass('hide');
            $('#ven_email').addClass('hide');
            $('#ven_addr').addClass('hide');
            var control = $('#expenses_attachment');
            control.replaceWith( control = control.clone( true ) );
            $('#expenses_attachment').val('');
            $scope.attachments={};
            $scope.files={};
          }
        });

      }
      else{
        //do nothing....
      }
    }
  //---------------------------delete Expense fxn ends here-------------------- 

  //---------------------------sort Expense on date range val fxn-------------------- 
    $scope.daterange_val = function (start,end){
      $scope.date_range.start_date = start;
      $scope.date_range.end_date = end;
      if($scope.show_expense == 'All'){
        $http.post('/expenses/set_daterange', $scope.date_range).success(function(response){
          $scope.expen_init = response.table;
          $scope.total_amt=response.total;
          $scope.table_data(); 
        });
      }
      if($scope.show_expense == 'By Category'){
        var aggregate_amt = 0;
        var category_names = 0;
        $scope.category_table=[];
        var category_table=[];
        var total = 0;
        $http.post('/expenses/set_daterange_category', $scope.date_range).success(function(response){
          angular.forEach(response,function(response, key){
            aggregate_amt = response['0']['category_aggregate_amount'];
            category_names = response['ExpenseType']['name'];
            total=total+ parseFloat(aggregate_amt);
            if((response['ExpenseType']['name'] == null) || (response['ExpenseType']['name'] == '')){
              category_names = "Undefined";
            }
            category_table.push({"amount":aggregate_amt,"name":category_names});
          });
          $scope.category_table=category_table;
          $scope.category_total=total;
          $scope.table_data();
        });
      }
      if($scope.show_expense == 'By Vendor'){
        var aggregate_amt = 0;
        var vendor_names = 0;
        $scope.vendor_table=[];
        var vendor_table=[];
        var total = 0;
        $http.post('/expenses/set_daterange_vendor', $scope.date_range).success(function(response){
          angular.forEach(response,function(response, key){
            aggregate_amt = response['0']['vendor_aggregate_amount'];
            vendor_names = response['Vendor']['name'];
            total=total+parseFloat(aggregate_amt);
            if(response['Vendor']['name'] == null){
              vendor_names = "Undefined";
            }
            vendor_table.push({"amount":aggregate_amt,"name":vendor_names});
          });
          $scope.vendor_table=vendor_table;
          $scope.vendor_total=total;
          $scope.table_data();
        });
      }
    }
    //---------------------------sort Expense on date range val fxn ends here--------------------
  }
]);
//---------------------------attachments modal ctrl and fxn-------------------- 
var AttachmentCtrl = function ($scope,$rootScope,$filter,$http, $modal,$modalInstance,attachmentinfo,$timeout) {
  $scope.attachment_info=attachmentinfo;
  $scope.numPages=attachmentinfo.length;

      $scope.currentPage = 0;  // current page
  $scope.todisplay=function(){
    if($scope.attachment_info.length == 0){
     return true;
    }else{
      return false;
    }
  }
   $scope.next = function () {
    if ($scope.currentPage < $scope.numPages - 1) {
      $rootScope.direction = 'right';
      $scope.currentPage++;
    }
  }

  
  $scope.prev = function () {
    if ($scope.currentPage > 0) {
      $rootScope.direction = 'left';
      $scope.currentPage--;
    }
  }

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };
}; 
//---------------------------attachments modal ctrl and fxn ends here-------------------- 

//---------------------------javascript onclick fxn for add new category in typeahead-------------------- 
  function try_link(){
    e = document.getElementById('ExpenseCtrl');  
                 scope = angular.element(e).scope();
                 scope.$apply(function(){
                   scope.open_add_cat();
                   });
  }
  //---------------------------javascript onclick fxn for add new category in typeahead ends here-------------------- 

//------------------------------------jquery functions--------------------------------------
$(document).ready(function(){  

  $('#expense_amount').focus();
  var control = $('#expenses_attachment');
        control.replaceWith( control = control.clone( true ) );
  $('#expense_date').change(function () {
    var datepick_value = $('#expense_date').val();
    e = document.getElementById('ExpenseCtrl'); 
            //console.log(e);  
           scope = angular.element(e).scope();
           scope.$apply(function(){
             scope.setdate(datepick_value);
             });
  });
  $('#vendor_name').typeahead({
      
       ajax: { 
                url: '/expenses/get_vendor_name/',
                triggerLength: 1,
                method: 'POST',
                 preDispatch: function () {
                  return {
                    
                      otherParam: $('#vendor_name').val()
                  }
              } 
            }

    });

    $('#vendor_name').change(function () {
    var vendor_name = $('#vendor_name').val();
    $('#ven_phone').addClass('hide');
    $('#ven_email').addClass('hide');
    $('#ven_addr').addClass('hide');
    $('#ven_detail_link').addClass('hide');
    e = document.getElementById('ExpenseCtrl'); 
            //console.log(e);  
           scope = angular.element(e).scope();
           scope.$apply(function(){
             scope.setvendor_name(vendor_name);
             });
        $.ajax({
            type: "post",
            url: "/expenses/get_vendor_details",
            data: {vendor_name: vendor_name},
            success: function(data){
              $('#ven_detail_link').addClass('hide');
              //console.log(data);
              if(data!='false'){
                var res = JSON.parse(data);
                var vendor_id = res.Vendor.id;
                var vendor_phoneno = res.Vendor.phone_no;
                var vendor_email = res.Vendor.email_id;
                var vendor_addr = res.Vendor.addr;
                //console.log(res.ExpenseType.id);
               if((res.ExpenseType.name == null) && (res.ExpenseType.id == null)){
                  var category_name = 'Select category';
                }else{
                   var category_name = res.ExpenseType.name;
                   var category_id = res.ExpenseType.id;
                }
                $('#ven_detail_link').addClass('hide');
                $('#ven_phone').removeClass('hide');
                $('#ven_email').removeClass('hide');
                $('#ven_addr').removeClass('hide');
                $('#vendor_phoneno').val(vendor_phoneno);
                $('#vendor_email').val(vendor_email);
                $('#vendor_addr').val(vendor_addr);
                $('#vendor_id').val(vendor_id);
                $('.select2-chosen').html(category_name);
                if((res.ExpenseType.name == null) && (res.ExpenseType.id == null)){
                  scope.$apply(function(){
                   scope.setvendor_detail(vendor_id,vendor_phoneno,vendor_email,vendor_addr);
                  });
                }else{
                  scope.$apply(function(){
                   scope.setvendor_detail_categoryexist(vendor_id,vendor_phoneno,vendor_email,vendor_addr,category_name,category_id);
                  });
                }
               
              } 
              if(data =='false'){
                $('#ven_detail_link').removeClass('hide');
                $('#vendor_phoneno').val('');
                $('#vendor_email').val('');
                $('#vendor_addr').val('');
                $('#vendor_id').val('0');
                scope.$apply(function(){
                  scope.clear_fields();
                });
              }
              if($('#vendor_name').val().length == 0){
                $('#ven_detail_link').addClass('hide');
                $('#ven_phone').addClass('hide');
                $('#ven_email').addClass('hide');
                $('#ven_addr').addClass('hide');
                $('#vendor_id').val('');
              }

            }
        });

  });
  
   $('#ven_detail_link').on('click', function(){
      $('#ven_phone').removeClass('hide');
      $('#ven_email').removeClass('hide');
      $('#ven_addr').removeClass('hide');
      $('#ven_detail_link').addClass('hide');
       $('#vendor_phoneno').focus();
   });

  $("#daterange").daterangepicker({
      ranges: {
        "Since Beginning": [moment("1970-02-27"),moment()],
        "Yesterday": [moment().subtract('days', 1), moment().subtract('days', 1)],
        "Last 30 Days": [moment().subtract('days', 29), moment()],
        "This Month": [moment().startOf('month'), moment().endOf('month')],
      },
      //startDate: moment().subtract("days", 29),
     // endDate: moment(),
      opens: "left",
      cancelClass: "btn-danger",
      buttonClasses: ['btn', 'btn-sm']
  }, function(start, end) {
      var end_date=end.format("DD-MM-YYYY");
      var start_date=start.format("DD-MM-YYYY");
      e = document.getElementById('ExpenseCtrl'); 
            //console.log(e);  
           scope = angular.element(e).scope();
      scope.daterange_val(start_date,end_date);
      if(start_date == '27-02-1970'){
        return $("#daterange span").html('Since Beginning');
      }
      if((start_date == moment().subtract('days', 1).format("DD-MM-YYYY")) && (end_date == moment().subtract('days', 1).format("DD-MM-YYYY"))){
        return $("#daterange span").html('Yesterday');
      }
      if((start_date == moment().subtract('days', 29).format("DD-MM-YYYY")) && (end_date == moment().format("DD-MM-YYYY"))){
        return $("#daterange span").html('Last 30 Days');
      }
      if((start_date == moment().startOf('month').format("DD-MM-YYYY")) && (end_date == moment().endOf('month').format("DD-MM-YYYY"))){
        return $("#daterange span").html('This Month');
      }
        else{
        return $("#daterange span").html(start.format("D-M-YYYY") + " - " + end.format("D-M-YYYY"));
      }  
  });

$('.ranges').on('click')
});
//------------------------------------jquery functions ends here--------------------------------------
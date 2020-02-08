var UserValidation = angular.module('UserValidation', ['ui.directives']);
function userCtrl($scope,$timeout,$http) {
        $scope.submit_loading=1;
       $scope.submit_btn=function(){
      if($scope.form.$valid){
             // console.log('changed', $scope.form.$valid);
             $scope.submit_loading=0;
             $scope.submit_btn_row=1;
               //flash.success = 'Clicked';
           }
    }
          $scope.reset=function() {
               $scope.not_available_status=0;
            $scope.available_status=0;
             $scope.form.emailfield.$setValidity("available", false);  
          }
            $scope.check_user=function(){              
           
            $scope.not_available_status=0;
            $scope.available_status=0;
          //  $scope.save_btn_status=1;
            if(($scope.email) && ($scope.email!=$scope.curr_email)){
                $('.process_status').html("<b><i class='icon-spinner icon-spin orange bigger-125'> </i>  Checking please wait ...</b>");
          $http.post('/users/user_credential_check/',{email:$scope.email}).success(function(response)
                 {       
                     $('.process_status').html("");
                 // console.log(response.avail_status);
                    if(response.avail_status){
                       // alert('available');
                       // $scope.save_btn_status=0;
                       $scope.form.emailfield.$setValidity("available", true);    
                       $('#email_id').removeClass('ng-invalid');                  
                        $scope.available_status=1;
                        $scope.not_available_status=0;
                    }else{
                       // alert('Already Taken');
                         $scope.form.emailfield.$setValidity("available", false);                     
                         //console.log($scope);
                         $('#email_id').addClass('ng-invalid');
                       $scope.available_status=0;
                        $scope.not_available_status=1;
                      //  $scope.save_btn_status=1;

                    }
                    //alert('Error: Server Connection. Try again.');            
                 }).error(function(data) {
                    alert('Error: Server Connection. Try again.');            
                 });
          }
        }
	};

UserValidation.directive('pwCheck', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var firstPassword = '#' + attrs.pwCheck;
      elem.add(firstPassword).on('keyup', function () {
        scope.$apply(function () {
          var v = elem.val()===$(firstPassword).val();
          ctrl.$setValidity('pwmatch', v);
        });
      });
    }
  }
}]);

  UserValidation.directive('ngBlur', ['$parse', function($parse) {
return function(scope, element, attr) {
var fn = $parse(attr['ngBlur']);
element.bind('blur', function(event) {
scope.$apply(function() {
fn(scope, {$event:event});
});
});
}
}]);

UserValidation.directive('ngFocus', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngFocus']);
    element.bind('focus', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}]);
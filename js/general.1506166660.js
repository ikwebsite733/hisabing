$(document).ready(function(){
   toastr.options = {
                closeButton: true,
                positionClass: 'toast-top-right',
                onclick: null
            };

  $('#demo_modal').on('click', function(){
     $('#validate-email').css('display', 'none');
      $('#required-email').css('display', 'none');
      $('#required-date').css('display', 'none');
  });
     
    $('#demo_send').on('click', function(e){

      var phone_no = $('#demo_phone_id').val();
      var email = $('#demo_mail_id').val();
      var date = $('#demo_date').val();
      var time = $('#demo_time').val();
      $('#validate-email').css('display', 'none');
      $('#required-email').css('display', 'none');
      $('#required-date').css('display', 'none');
      var pattern = /^\b[A-Z0-9._%]+@[A-Z0-9.]+\.[A-Z]{2,4}\b$/i;
      var validation = pattern.test(email);
      if(validation == false && email.length != 0){
        e.preventDefault();
        $('#validate-email').css('display', 'block');
        $('#required-email').css('display', 'none');
        $('#required-date').css('display', 'none');
      }
      if(email.length == 0){
         e.preventDefault();
         $('#required-email').css('display', 'block');
         $('#validate-email').css('display', 'none');
         $('#required-date').css('display', 'none');
      }
      if(validation == true && email.length != 0 && $('#demo_date').val().length != 0){
        $('#demo_send').hide();
      $('#spinner').show();
      $.ajax({
        type: "post",
              url: "/dashboards/demo_email",
              data: {email : email, phone_no : phone_no, date : date, time : time},
              success: function(data){
                $('#spinner').hide();
                $('#demo_send').show();
                $('#demo_request_Modal').modal('hide');
                var $toast = toastr['success']('your demo request has been received', 'Thank you');
              }
       });
      }
      if($('#demo_date').val().length == 0){
        $('#required-date').css('display', 'block');
      }
      
    });
  });
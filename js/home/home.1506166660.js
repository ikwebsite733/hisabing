function IsEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}
$(function(){
$("#btn_newsletter" ).click(function() {
email_id=$("#mce-EMAIL").val();
if(IsEmail(email_id)){
    $('#news_mail_load').show();
             $.ajax({
                        type: "POST",
                        url: "/homes/send_news_mail",
                        data: {email_id : email_id},
                 
                       success: function(html){          
                        $('#news_mail_load').hide();
                        $("#mce-EMAIL").val('');
                        $('#news_info_msg').html("Thank you! You are the best.");
                        $('#news_mail_info').fadeIn();
                        setTimeout(function(){
                            $('#news_mail_info').fadeOut();
                        },6000);
                        },
                        error: function(data){   
                         $('#news_mail_load').hide();
                         $("#mce-EMAIL").val('');
                         $('#news_info_msg').html("Oops! Something went wrong, try again?");
                        $('#news_mail_info').fadeIn();
                        setTimeout(function(){
                            $('#news_mail_info').fadeOut();
                        },6000);
                        }
                    });
            }
});
});


$(function(){
$("#contact_mail" ).click(function() {
cont_name=$("#contact_name").val();
email_id=$("#contact_email").val();
sub=$("#contact_sub").val();
msg=$("#contact_msg").val();
if( isBlank(cont_name) || isBlank(email_id) ){
   $("#contact_form_info").fadeIn();
     $("#contact_form_info span").html("Required Fields have been left blank, please check again.");
    return 0;
}
if(!validEmail(email_id)){
    $("#contact_form_info").fadeIn();
     $("#contact_form_info span").html("Email entered doesnt seem valid, please check again");
    return 0;
}
$('#contact_mail_load').show();
 $.ajax({
            type: "POST",
            url: "/homes/send_contact_mail",
            data: {cont_name : cont_name,email_id : email_id,sub : sub, msg : msg},
     
           success: function(html){          
            $('#contact_mail_load').hide();
            $("#contact_name").val('');
            $("#contact_email").val('');
            $("#contact_sub").val('');
            $("#contact_msg").val('');
            $("#contact_form_info").fadeIn();
            $("#contact_form_info span").html("Thank you! We will get back in touch shortly.");
            setTimeout(function(){
                $("#contact_form_info").fadeOut();
            },4000);

            },
            error: function(data){   
            $('#contact_mail_load').hide();
            $("#contact_form_info").fadeIn();
            $("#contact_form_info span").html("Something went wrong, please try again.");
            }
        });
    });
});

function validEmail(e) {
    var filter = /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/;
    return String(e).search (filter) != -1;
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}
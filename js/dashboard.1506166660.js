 function isEmpty(d){

    for (var k in d) 
      return false;

     return true
   }
 $(document).ready(function() {
  $.ajax({
      type: "POST",
      url: "/app/notification_count",
      

     success: function(data){  
        if(data != 0){
            $('.notification_count').html(data); 
        }else{
           $('.notification_count').html('');
        }
        
      },
      error: function(data){   
           $('#info_box').html('<p>Error!..</p>');
      }
  });
  //console.log($('.icon-rss').next());
 (function() {
        $("#daterange").daterangepicker({
          ranges: {
            Yesterday: [moment().subtract("days", 1), moment().subtract("days", 1)],
            "Last 30 Days": [moment().subtract("days", 29), moment()],
            "This Month": [moment().startOf("month"), moment().endOf("month")]
          },
          //startDate: moment().subtract("days", 29),
         // endDate: moment(),
          opens: "left",
          cancelClass: "btn-danger",
          buttonClasses: ['btn', 'btn-sm']
        }, function(start, end) { 
          
            var end_date=end.format("D-M-YYYY");
            var start_date=start.format("D-M-YYYY");
            //alert(start_date);
         $.ajax({
            type: "POST",
            url: "/dashboards/dash_update",
            data: {start_date : start_date,end_date: end_date},
     
           success: function(html){      
           $('#info_box').fadeOut(5);      
            $('#info_box').html(html);
             $('#info_box').fadeIn(500);
            },
            error: function(data){   
                 $('#info_box').html('<p>Error!..</p>');
            }
        });

          return $("#daterange span").html(start.format("D-M-YYYY") + " - " + end.format("D-M-YYYY"));
         
         
          
        });
      
      }).call(this);

    $.ajax({
            type: "POST",
            url: "/app/notification_fetch_alert",
            
     
           success: function(data){   
            
           var resp=JSON.parse(data);
           if(!isEmpty(resp)){
              $.each( resp, function( key, value ) {
                  $('.show_all').remove();
                  $('#alerts').append('<li><p class="pull-right"><span id="n_id_'+key+'" class="hide">'+value.Notification.id+'</span><a href="#" id="read_btn_'+key+'" class="icon-check-empty has-tooltip" title="Mark as read" onClick="mark_read(this.id)"></a></p><div class="icon-lightbulb text-red pull-left"><div class=""></div></div><div class="action pull-left" style="margin-left:3%">'+value.Notification.msg+'</div><small class="date pull-right text-muted" style="padding-right:2%;"><p class="icon-time"> '+value.Notification.time+'</p><p class="">'+value.Notification.date+' </p></small></li>');                    
                });
              console.log(resp.length);
              if(resp.length > 4){
                $('#alerts').append('<li id="show_more" style="text-align:center;" onClick="show_alert()"><a href="">show more</a></li>');
              }
              }  
            },
            error: function(data){   
                 $('#info_box').html('<p>Error!..</p>');
            }
        });
        
    $.ajax({
            type: "POST",
            url: "/app/notification_fetch_activity",
            
     
           success: function(data){   
            
           var resp=JSON.parse(data);
           if(!isEmpty(resp)){
              $.each( resp, function( key, value ) {
                $('.err_msg').remove();
                $('#activity').append('<li><p class="pull-right"><span id="n_id_'+key+'" class="hide">'+value.Notification.id+'</span><a href="#" id="read_activity_btn_'+key+'" class="icon-check-empty has-tooltip" title="Mark as read" onClick="mark_read_activity(this.id)"></a></p><div class="icon-comments-alt text-success pull-left"><div class=""></div></div><div class="action pull-left" style="margin-left:3%">'+value.Notification.msg+'</div><small class="date pull-right text-muted" style="padding-right:2%;"><p class="icon-time"> '+value.Notification.time+'</p><p class="">'+value.Notification.date+' </p></small></li>');                    
              });
             if(resp.length > 4){
                $('#activity').append('<li id="show_more" style="text-align:center;" onClick="show_activity()"><a href="">show more</a></li>');
             }  
           }
              
            },
            error: function(data){   
                 $('#info_box').html('<p>Error!..</p>');
            }
        });
          
 });

 function show_alert() {
    $.ajax({
        type: "POST",
        url: "/app/notification_fetch_all_alert",
        
 
       success: function(data){   
        
       var resp=JSON.parse(data);
          $('#alerts li').remove();
          $.each( resp, function( key, value ) {
                $('#alerts').append('<li><p class="pull-right"><span id="n_id_'+key+'" class="hide">'+value.Notification.id+'</span><a href="#" id="read_btn_'+key+'" class="icon-check-empty has-tooltip" title="Mark as read" onClick="mark_read(this.id)"></a></p><div class="icon-lightbulb text-red pull-left"><div class=""></div></div><div class="action pull-left" style="margin-left:3%">'+value.Notification.msg+'</div><small class="date pull-right text-muted" style="padding-right:2%;"><p class="icon-time"> '+value.Notification.time+'</p><p class="">'+value.Notification.date+' </p></small></li>');                                        
          });
        },
        error: function(data){   
             $('#info_box').html('<p>Error!..</p>');
        }
    });
}

function show_activity() {
    $.ajax({
        type: "POST",
        url: "/app/notification_fetch_all_activity",
        
 
       success: function(data){   
        
       var resp=JSON.parse(data);
          $('#activity li').remove();
          $.each( resp, function( key, value ) {
                $('#activity').append('<li><p class="pull-right"><span id="n_id_'+key+'" class="hide">'+value.Notification.id+'</span><a href="#" id="read_activity_btn_'+key+'" class="icon-check-empty has-tooltip" title="Mark as read" onClick="mark_read_activity(this.id)"></a></p><div class="icon-comments-alt text-success pull-left"><div class=""></div></div><div class="action pull-left" style="margin-left:3%">'+value.Notification.msg+'</div><small class="date pull-right text-muted" style="padding-right:2%;"><p class="icon-time"> '+value.Notification.time+'</p><p class="">'+value.Notification.date+' </p></small></li>');                                        
          });
        },
        error: function(data){   
             $('#info_box').html('<p>Error!..</p>');
        }
    });
}


function mark_read(id){
  //console.log(id);
  $('#'+id).removeClass('icon-check-empty');
  $('#'+id).addClass('icon-check');
  var notification_id = $('#'+id).prev().html();
  $('#'+id).parent().parent().fadeOut();
  var post_data = {"id":notification_id}
   $.ajax({
        type: "POST",
        url: "/app/update_notification",
        data: post_data,
 
       success: function(data){   
          var resp=JSON.parse(data);
          if(!isEmpty(resp)){
          	 setTimeout(function() {
              $('#alerts li').remove();
	              $.each( resp, function( key, value ) {
	                $('#alerts').append('<li><p class="pull-right"><span id="n_id_'+key+'" class="hide">'+value.Notification.id+'</span><a href="#" id="read_btn_'+key+'" class="icon-check-empty has-tooltip" title="Mark as read" onClick="mark_read(this.id)"></a></p><div class="icon-lightbulb text-red pull-left"><div class=""></div></div><div class="action pull-left">'+value.Notification.msg+'</div><small class="date pull-right text-muted" ><p class="icon-time"> '+value.Notification.time+'</p><p class="">'+value.Notification.date+' </p></small></li>');                    
	              });
	              $('#alerts').append('<li id="show_more" style="text-align:center;" onClick="show_alert()"><a href="">show more</a></li>');        
	          }, 500);
          	}else{
          		$('#alerts li').remove();
          		$('#alerts').append('<li class="show_all" style="text-align:center;">No Alerts</li>');
          	}
         
              
          },
        error: function(data){   
             $('#info_box').html('<p>Error!..</p>');
        }
    });
 setTimeout(function() {
   $.ajax({
        type: "POST",
        url: "/app/notification_count",
        

       success: function(data){  
          if(data != 0){
            $('.notification_count').html(data); 
          }else{
             $('.notification_count').html('');
          }
          
        },
        error: function(data){   
             $('#info_box').html('<p>Error!..</p>');
        }
    });

 }, 500);
 
}


function mark_read_activity(id){
  $('#'+id).removeClass('icon-check-empty');
  $('#'+id).addClass('icon-check');
  var notification_id = $('#'+id).prev().html();
  console.log(notification_id);
  $('#'+id).parent().parent().fadeOut();
  var post_data = {"id":notification_id}
   $.ajax({
        type: "POST",
        url: "/app/update_activity_notification",
        data: post_data,
 
       success: function(data){   
          var resp=JSON.parse(data);
          if(!isEmpty(resp)){
          	setTimeout(function() {
	              $('#activity li').remove();
	              $.each( resp, function( key, value ) {
	                $('#activity').append('<li><p class="pull-right"><span id="n_id_'+key+'" class="hide">'+value.Notification.id+'</span><a href="#" id="read_activity_btn_'+key+'" class="icon-check-empty has-tooltip" title="Mark as read" onClick="mark_read_activity(this.id)"></a></p><div class="icon-comments-alt text-success pull-left"><div class=""></div></div><div class="action pull-left">'+value.Notification.msg+'</div><small class="date pull-right text-muted" ><p class="icon-time"> '+value.Notification.time+'</p><p class="">'+value.Notification.date+' </p></small></li>');                    
	              });
	              $('#activity').append('<li id="show_more" style="text-align:center;" onClick="show_activity()"><a href="">show more</a></li>');        
	          }, 500);
          }else{
          		$('#activity li').remove();
          		$('#activity').append('<li class="err_msg" style="text-align:center;">No Activities</li>');
          }
          
              
          },
        error: function(data){   
             $('#info_box').html('<p>Error!..</p>');
        }
    });
setTimeout(function() {

  $.ajax({
      type: "POST",
      url: "/app/notification_count",
      

     success: function(data){  
        if(data != 0){
            $('.notification_count').html(data); 
        }else{
           $('.notification_count').html('');
        }
        
      },
      error: function(data){   
           $('#info_box').html('<p>Error!..</p>');
      }
  });
}, 500);
  
  
}
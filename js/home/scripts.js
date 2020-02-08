$(document).ready(function() {
                $('body').css('overflowY','hidden');
                $.waitForImages.hasImgProperties = ['background','backgroundImage'];
                $('body').waitForImages(function() {
                    // All descendant images have loaded, now slide up.
//                        alert("done");
                    $(".page-mask").fadeOut(500);
                    $('body').css('overflowY','auto');
                });

                $("body").scrollTo("+=1px");
                $(".mega-hover").css("cursor","pointer");
                $(".mega-hover").bind("click",function(){
//                    alert("olo");
                    //console.log("hello");
                    var i = -1;
                    var pos = 0;
                    var url = $(this).find("a").attr("href");
                    var imgs = [];
                    $(".fancybox").each(function(){
                        var href = $(this).attr("href");
                        i++;
                        if(href==url) pos = i;
                        imgs.push(href);
                    });
                    $.fancybox.open(imgs,{padding:0,index:pos});
//                    $.fancybox.jumpto(pos);
                })
            });



$(function() {
$('.animated').appear();
                $(document.body).on('appear', '.animate-from-left', function() {
                    jQuery(this).each(function() {
                        jQuery(this).delay(150).animate({opacity: 1, left: "0px"}, 1000);
                    });
                });
                $(document.body).on('appear', '.animate-from-right', function() {
                    jQuery(this).each(function() {
                        jQuery(this).delay(150).animate({opacity: 1, right: "0px"}, 1000);
                    });
                });
                $(document.body).on('appear', '.animate-from-top', function() {
                    jQuery(this).each(function() {
                        jQuery(this).delay(150).animate({opacity: 1, top: "0px"}, 1000);
                    });
                });
                
                

                $(document.body).on('appear', '.animate-from-bottom', function() {
                    jQuery(this).each(function() {
                        jQuery(this).delay(150).animate({opacity: 1, bottom: "0px"}, 1000);
                    });
                });


                

    });
    
    
    $(function() {

                // fancybox
                // $(".fancybox").fancybox({
                //     padding: 0
                // });
                // scrollTo
                $('body').scrollspy({target: '.topmenu'});
                $(".topmenu a, #timeline a, .str a, #home").bind("click", function() {
                    $(".topmenu li, #timeline div").removeClass("active");
                    $(this).parent().addClass("active");
                    var target = $(this).attr("href");
                    var pos = $(target).offset();
                    if (pos) {
                        pos.top -= 115;
                        $("body").scrollTo(pos, 1000);
                        return false;
                    }
                });
                $(".team-list a").bind("click", function() {
                    $(".team-row").scrollTo($(".team-description"), 500);
                });
                $(".logo, .f-logo").bind("click", function() {
                    $("body").scrollTo($("#home"), 500);
                });
                $(".goback").bind("click", function() {
                    $(".team-row").scrollTo($(".team-list"), 500);
                });
                $("#timeline").hide();
                




                $('.appear').appear();
                $(".appear").on("appear", function(data) {
                    var id = $(this).attr("id");
                    if (id != "home") {
                        $("#timeline").show();
                    } else {
                        $("#timeline").hide();
                    }
                    $(".topmenu li, #timeline div").removeClass("active");
                    $(".topmenu a[href='#" + id + "']").parent().addClass("active");
                    $(".innerlink[href='#" + id + "']").parent().addClass("active");
                });
            });
            
            
             $(function() {

                // var api = jQuery('.megafolio-container').megafoliopro(
                //         {
                //             filterChangeAnimation: "fade", // fade, rotate, scale, rotatescale, pagetop, pagebottom,pagemiddle
                //             filterChangeSpeed: 600, // Speed of Transition
                //             filterChangeRotate: 10, // If you ue scalerotate or rotate you can set the rotation (99 = random !!)
                //             filterChangeScale: 0.6, // Scale Animation Endparameter
                //             delay: 20,
                //             paddingHorizontal: 0,
                //             paddingVertical: 0,
                //             layoutarray: [11]		// Defines the Layout Types which can be used in the Gallery. 2-9 or "random". You can define more than one, like {5,2,6,4} where the first items will be orderd in layout 5, the next comming items in layout 2, the next comming items in layout 6 etc... You can use also simple {9} then all item ordered in Layout 9 type.

                //         });



                // THE FILTER FUNCTION
                jQuery('.filter').click(function(e) {
                    jQuery('.filter').each(function() {
                        jQuery(this).removeClass("selected")
                    });
                    api.megafilter(jQuery(this).data('category'));
                    jQuery(this).addClass("selected");
                    e.preventDefault();
                });




            });
    
$(function() {
    $('#topnav').localScroll(800);

    //.parallax(xPosition, speedFactor, outerHeight) options:
    //xPosition - Horizontal position of the element
    //inertia - speed to move relative to vertical scroll. Example: 0.1 is one tenth the speed of scrolling, 2 is twice the speed of scrolling
    //outerHeight (true/false) - Whether or not jQuery should use it's outerHeight option to determine when a section is in the viewport
    $('#home').parallax("50%", 0.1);
    $('#start').parallax("50%", 0.1);
    $('#portfolio').parallax("50%", 0.4);
    $('#about').parallax("50%", 0.4);
    $('#team').parallax("50%", 0.3);
    $('#services').parallax("50%", 0.3);
    $('#news').parallax("50%", 0.3);
    $('#features').parallax("50%", 0.1);
    $('#price').parallax("50%", 0.1);
    $('#blog').parallax("50%", 0.1);
    $('#contact').parallax("50%", 0.1);


});

$(function() {

    // $(".post-list").owlCarousel({
    //     navigation: false, // Show next and prev buttons
    //     slideSpeed: 300,
    //     paginationSpeed: 400,
    //     singleItem: true

    //             // "singleItem:true" is a shortcut for:
    //             // items : 1,
    //             // itemsDesktop : false,
    //             // itemsDesktopSmall : false,
    //             // itemsTablet: false,
    //             // itemsMobile : false

    // });

});

$(function() {
//    bxslider

    // $('.bxslider').show();
    // $('.bxslider').bxSlider({
    //     minSlides: 3,
    //     maxSlides: 3,
    //     slideWidth: 420,
    //     slideMargin: 50
    // });


});


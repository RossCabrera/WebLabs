// ===== FAQ INTERACTIVE SECTION =====
// Your jQuery code goes here!

// TODO: Step 1 - Select all question elements and add click event handler
// Hint: Use $(".question").click(function() { ... })
$(".question").click(function()
{
    $(".answer").not($(this).next()).slideUp();
    $(".question").removeClass("active");
    $(this).next(".answer").slideToggle();
    $(this).toggleClass("active");
    $(".material-symbols-outlined").text("add");
    if ($(this).hasClass("active")) {
        $(this).find(".material-symbols-outlined").text("remove");
      }

    
});

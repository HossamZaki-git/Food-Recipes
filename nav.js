"use strict"

let nav=$("nav");
let nav2_width=$(".nav2").css("width");
let nav_key=document.querySelector(".navkey");

// Extracting the width of (nav2) from the string (nav2_width)
// and converting it to a Number
for(let i=0;i<nav2_width.length;i++)
{
    if(nav2_width[i] === 'p')
    {
        nav2_width=nav2_width.substr(0,i-1);
        nav2_width=Number(nav2_width);
        break;
    }
}

// hidding it to be the hidden part from the nav bar
nav.css({"left":nav2_width*-1});

function show_hidden_nav()
{
    nav.animate({"left":0},1000,function(){
        $(".nav_to_hide").show(500);
    });    
}

function hide_nav()
{
    $(".nav_to_hide").hide(500);
    nav.animate({"left":nav2_width*-1},1000);
}

function toggle_menu()
{
    let classes=nav_key.classList;
    for(let i=0;i<classes.length;i++)
    {
        if(classes[i]==='fa-bars')
        {
            nav_key.classList.remove('fa-bars');
            nav_key.classList.add('fa-x');
            show_hidden_nav();
            return;
        }
        if(classes[i]==='fa-x')
        {
            nav_key.classList.remove('fa-x');
            nav_key.classList.add('fa-bars');
            hide_nav();
            return;
        }

    }
}

nav_key.addEventListener("click",toggle_menu);
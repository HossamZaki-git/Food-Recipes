"use strict"

let content=document.querySelector(".content");
let row=document.querySelector(".content > .row");
let meal_identifier=document.querySelector(".meal_identifier");
let instructions=document.querySelector(".instructons");
let area=document.querySelector(".area");
let category=document.querySelector(".category");
let recipies=document.querySelector(".recipies");
let TAGS=document.querySelector(".tags");
let source=document.querySelector(".source");
let youtube=document.querySelector(".youtube");

let search_row=document.querySelector(".search_area > .row");

function show_hide(to_show)
{
    $(".content , .meal_profile_to_hide , .search , .contact").fadeOut(200,function(){
        $(to_show).fadeIn(500);
    });
    
}

function myLoading(message = "wait while loading")
{
    document.querySelector(".loading_screen > p").innerHTML = message;
    $(".loading_screen").fadeIn();
    $("body").css({"overflow":"hidden"});
    $(".loading_screen > *").fadeIn(500);
}

function endLoading()
{
    $(".loading_screen > *").fadeOut(500,
        () => 
        {
            $("body").css({"overflow":"auto"});
            $(".loading_screen").fadeOut();
        }
    );
}

async function show_meal(id)
{
    myLoading();
    let meal=await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    meal=await meal.json();
    meal=meal.meals;
    endLoading();
    $(".search").fadeOut(1);
    $(".contact").fadeOut(1);
    $(content).fadeOut(500,() => $(".meal_profile_to_hide").fadeIn(500) );

        meal_identifier.innerHTML=`
            <img src="${meal[0].strMealThumb}" alt=""/>
            <h3 class="text-center text-white mt-3">${meal[0].strMeal}</h3>
        `;

        instructions.innerHTML=`${meal[0].strInstructions}`;
        area.innerHTML=`${meal[0].strArea}`;
        category.innerHTML=`${meal[0].strCategory}`;

        let mp=new Map(Object.entries(meal[0]));
        let ingredients=[];
        for(let x of mp)
        {
            let temp=x[0];
            temp=temp.substring(0,13);
            if(temp=="strIngredient")
            {
                if(String(x[1]).length)
                ingredients.push(x[1]);
            }
        }

        for(let x of ingredients)
        {
            recipies.innerHTML+=`
             <h5>${x}</h5>
            `;
        }

        let tags=[];
        let all_tags=meal[0].strTags;
        all_tags=String(all_tags);
        let temp="";
        for(let i=0;i<all_tags.length;i++)
        {
            if(all_tags[i]==',')
            {
                tags.push(temp);
                temp="";
                continue;
            }
            temp+=all_tags[i];
            if(i==all_tags.lenght-1){tags.push(temp);}            
        }

        for(let x of tags)
        {
            TAGS.innerHTML+=`
            <h5>${x}</h5>
            `;
        }

        source.innerHTML=`
         <a href="${meal[0].strSource}" target="_blank" class="w-100">Source</a>
        `;
        youtube.innerHTML=`
        <a href="${meal[0].strYoutube}" target="_blank">Youtube</a>
        `;

        $(".meal_profile_to_hide").fadeIn(500);

}


function add_card(meal_name,img_souce,id)
{
    row.innerHTML+=`
    <div class="col-lg-3 col-md-4 col-sm-6 py-3">
       <div class="card" onclick="show_meal(${id})">
           <img src="${img_souce}" alt=""/>
           <div class="card_layer">
               <h3 class="text-center">${meal_name}</h3>
           </div>
        </div>
    </div>
    `;
}


async function intro()
{
    let data=await fetch("https://www.themealdb.com/api/json/v1/1/filter.php?a=Italian");
    data=await data.json();
    data=data.meals;
    for(let i=0;i<data.length;i++)
        add_card(data[i].strMeal,data[i].strMealThumb,data[i].idMeal);

    // removing the loading screen & showing up a greeting message
    $(".loading_screen > *").fadeOut(500,() => 
        {

            document.querySelector(".loading_screen p").innerHTML="Note: The navigation through the pages is only through the navigation bar";
            $(".loading_screen p").fadeIn(500,() => 
            {

                setTimeout(() => {

                    $(".loading_screen p").fadeOut(500,() => {

                        $(".loading_screen").fadeOut(1000,() => {

                            $("body").css({"overflow":"auto"});
                        });

                    });

                },2500);
            })

        });
}


 intro();


async function choosen_category(cat)
{
    myLoading("Comming with the results");
    let data=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat}`);
    data=await data.json();
    data=data.meals;
    show_hide(content);
    row.innerHTML="";
    for(let i=0;i<data.length;i++)
        add_card(data[i].strMeal,data[i].strMealThumb,data[i].idMeal);
    endLoading();
}

async function change_to_category()
{
    myLoading("Getting the categories for you");
    let data=await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`);
    data=await data.json();
    row.innerHTML="";
    data=data.categories;
    for(let i=0;i<data.length;i++)
    {
        row.innerHTML+=`
        <div class="col-lg-3 col-md-4 col-sm-6 py-3">
           <div class="card" onclick="choosen_category('${data[i].strCategory}')">
               <img src="${data[i].strCategoryThumb}" alt=""/>
               <div class="card_layer overflow-auto d-block">
                  <h3 class="text-center w-100">${data[i].strCategory}</h3>
                  <p class="text-center">${data[i].strCategoryDescription}</p>
               </div>
            </div>
        </div>
        `;
    }
    show_hide(content);
    toggle_menu();
    endLoading();
}


async function country(c)
{
    myLoading(`The food of ${c} will be shown now`);
    let data=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${c}`);
    data=await data.json();
    row.innerHTML="";
    data=data.meals;
    for(let i=0;i<data.length;i++)
        add_card(data[i].strMeal,data[i].strMealThumb,data[i].idMeal);
    endLoading();
}

function change_to_area()
{
    myLoading();
    setTimeout(() => {
        row.innerHTML=`
        <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Egyptian')">
        <div class="w-100">
            <img src="images/download.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Egyptian</h3>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Italian')">
        <div class="w-100">
            <img src="images/italy.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Italian</h3>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Malaysian')">
        <div class="w-100">
            <img src="images/malasyia.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Malaysian</h3>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Spanish')">
        <div class="w-100">
            <img src="images/spain.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Spanish</h3>
        </div>
    </div>
    
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('American')">
        <div class="w-100">
            <img src="images/AMERICA.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">American</h3>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Greek')">
        <div class="w-100">
            <img src="images/greek.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Greek</h3>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Moroccan')">
        <div class="w-100">
            <img src="images/moroco.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Moroccan</h3>
        </div>
    </div>
    
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Dutch')">
        <div class="w-100">
            <img src="images/Germany.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Dutch</h3>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('French')">
        <div class="w-100">
            <img src="images/france.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">French</h3>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Mexican')">
        <div class="w-100">
            <img src="images/mexico.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Mexican</h3>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Japanese')">
        <div class="w-100">
            <img src="images/japan.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Japanese</h3>
        </div>
    </div>
    
    <div class="col-lg-3 col-md-4 gy-3 mt-3 country" onclick="country('Chinese')">
        <div class="w-100">
            <img src="images/chinies.jpg" alt="" class="country_img"/>
            <h3 class="text-danger text-center">Chinese</h3>
        </div>
    </div>
        `;
    
    },500);
    show_hide(content);
    endLoading();
    toggle_menu();
}


async function choosen_ingredient(ing)
{
    myLoading(`Getting the food made with ${ing}`);
    let data=await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
    data=await data.json();
    data=data.meals;
    row.innerHTML="";
    for(let i=0;i<data.length;i++)
        add_card(data[i].strMeal,data[i].strMealThumb,data[i].idMeal);
    show_hide(content);
    endLoading();
}


async function change_to_Ingtedients()
{
    myLoading("Categorizing by ingredients");
    let data=await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`);
    data=await data.json();
    data=data.meals;
    show_hide(content);
    let name,text;
    row.innerHTML="";
    $(row).show(1);
    for(let i=0;i<20;i++)
    {
        name=data[i].strIngredient;
        text=data[i].strDescription;
        /*Using the regular expression to get only the frist sentence of the description*/
        text = text.match(/[^\.]{0,}\.$/);
        text = text == null ? "no description":text;
        row.innerHTML+=`
            <div class="col-lg-3 col-md-4 col-sm-6  gy-4 ingredient_item" onclick="choosen_ingredient('${data[i].strIngredient}')">
            <div class="text-white text-center">
                <i class="fa-solid fa-plate-wheat text-warning my-2 plate"></i>
                <h3 class="my-2">${name}</h3>
                <p class="my-2">${text}</p>
            </div>
        </div>
            `;
    }
    toggle_menu();
    endLoading();
}


function change_to_search()
{
    show_hide(document.querySelector(".search"));
    search_row.innerHTML="";
    let inputs=document.querySelectorAll(".search-bars > input");
    inputs[0].value=inputs[1].value="";
    toggle_menu();
}

async function search_by_name(name)
{
    search_row.innerHTML="";
    let data= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`);
    data= await data.json();
    data=data.meals;
    console.log(data);
    for(let i=0;i<data.length;i++)
    {
        search_row.innerHTML+=`
        <div class="col-lg-3 col-md-4 col-sm-6 py-3">
        <div class="card" onclick="show_meal(${data[i].idMeal})">
            <img src="${data[i].strMealThumb}" alt=""/>
            <div class="card_layer">
                <h3 class="text-center">${data[i].strMeal}</h3>
            </div>
         </div>
     </div>
        `;
    }
}

async function search_by_letter(letter)
{
    search_row.innerHTML="";
    let data= await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`);
    data=await data.json();
    data=data.meals;
    console.log(data);
    for(let i=0;i<data.length;i++)
    {
        search_row.innerHTML+=`
        <div class="col-lg-3 col-md-4 col-sm-6 py-3">
        <div class="card" onclick="show_meal(${data[i].idMeal})">
            <img src="${data[i].strMealThumb}" alt=""/>
            <div class="card_layer">
                <h3 class="text-center">${data[i].strMeal}</h3>
            </div>
         </div>
     </div>
        `;
    }
}

function change_to_register()
{
    myLoading();
    $(".warning_outer").hide(1);
    show_hide(document.querySelector(".contact"));
    toggle_menu();
    setTimeout(endLoading(),500);
}

function check_data()
{
    let name=document.querySelector(".name");
    let mail=document.querySelector(".mail");
    let phone=document.querySelector(".phone");
    let age=document.querySelector(".age");
    let password=document.querySelector(".password");
    let re_password=document.querySelector(".re-password");
    let warning_area_p=document.querySelector(".warning_area > p");
    let warning_outer=document.querySelector(".warning_outer");


    $(warning_outer).fadeOut(100);
    $(".warning_area").css({"background-color":"#DC3545"})

    if(!name.value.length || !mail.value.length || !phone.value.length || !age.value.length || !password.value.length || !re_password.value.length)
    {
        warning_area_p.innerHTML="All the data must be filled";
        $(warning_outer).fadeIn(300);
        return;
    }

    let name_test=/^[a-z]{2,}$/i;
    if(!name_test.test(name.value))
    {
        console.log("Incorrect name");
        warning_area_p.innerHTML="The name must be at least two letters not including numbers or characters";
        $(warning_outer).fadeIn(300);
        return;
    }


    let mail_test=/(@gmail.com|@yahoo.com)$/;
    if(!mail_test.test(mail.value))
    {
        console.log("Incorrect mail");
        warning_area_p.innerHTML="Invalid mail";
        $(warning_outer).fadeIn(300);
        return;
    }

    let phone_test=/^[0-9]{11}$/;
    if(!phone_test.test(phone.value))
    {
        warning_area_p.innerHTML="Invalid phone number";
        $(warning_outer).fadeIn(300);
        return;
    }

    let age_test = /^[0-9]{1,}$/;
    if(!age_test.test(age.value) || Number(age.value)>110 || Number(age.value)<=0 )
    {
        warning_area_p.innerHTML="Enter a real age";
        $(warning_outer).fadeIn(300);
        return;
    }
    else if(Number(age.value)<10)
    {
        warning_area_p.innerHTML="Too young";
        $(warning_outer).fadeIn(300);
        return;
    }
    let character=false;
    let number=false;
    let letter=false;
    let character_check=/^\W$/; // checking for using a special character
    let number_check=/^\d$/; // checking for using a digit
    let letter_check=/^[a-z]$/i; // checking for using a letter
    let pass=password.value;
    for(let i=0;i<pass.length;i++)
    {
        if(number_check.test(String(pass[i])))
            number=true;

        else if(character_check.test(String(pass[i])))
            character=true;

        else if(letter_check.test(String(pass[i])))
            letter=true;
    }
    if(!character || !number  || !letter || pass.length<6)
    {
        warning_area_p.innerHTML="The password must contain at leats:\n_one letter\n_one special character ex: # ! *\n_one digit\nIts lenght must exceed 5 characters";
        $(warning_outer).fadeIn(300);
        return;
    }
    if(password.value!=re_password.value)
    {
        warning_area_p.innerHTML="The re-entered password doesn't match the entered password";
        $(warning_outer).fadeIn(300);
        return;
    }

    
    $(".warning_area").css({"background-color":"#09c"});
    warning_area_p.innerHTML="Registered successfully";
    $(warning_outer).fadeIn(300);

    name.value = phone.value = mail.value = age.value = password.value = re_password.value = "";
}
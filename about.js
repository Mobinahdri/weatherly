
/* ==========================================
                ELEMENTS
========================================== */

const darkBtn =
    document.querySelector(".dark-mode-btn");

const darkIcon =
    darkBtn.querySelector("i");

/* ==========================================
                PAGE LOAD
========================================== */

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadTheme();

    }

);

/* ==========================================
                DARK MODE
========================================== */

function loadTheme(){

    const theme =
        localStorage.getItem("theme");

    if(theme==="dark"){

        document.body.classList.add(

            "dark-mode"

        );

        darkIcon.classList.remove(

            "fa-moon"

        );

        darkIcon.classList.add(

            "fa-sun"

        );

    }

}

darkBtn.addEventListener(

    "click",

    ()=>{

        document.body.classList.toggle(

            "dark-mode"

        );

        if(document.body.classList.contains("dark-mode")){

            localStorage.setItem(

                "theme",

                "dark"

            );

            darkIcon.classList.remove(

                "fa-moon"

            );

            darkIcon.classList.add(

                "fa-sun"

            );

        }

        else{

            localStorage.setItem(

                "theme",

                "light"

            );

            darkIcon.classList.remove(

                "fa-sun"

            );

            darkIcon.classList.add(

                "fa-moon"

            );

        }

    }

);

/* ==========================================
        LANGUAGE CHANGE SUPPORT
========================================== */

document.addEventListener(

    "languageChanged",

    ()=>{

        // تمام متن‌ها توسط i18n.js
        // به صورت خودکار بروزرسانی می‌شوند.

    }

);

/* ==========================================
            PAGE ANIMATION
========================================== */

window.addEventListener(

    "load",

    ()=>{

        const section =

            document.querySelector(".about-section");

        if(section){

            section.style.opacity="1";

        }

    }

);
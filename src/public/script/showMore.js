const moreBtn = document.getElementById("showMore");
const lessBtn = document.getElementById("showLess");
const infoSection = document.querySelector(".info .content");

moreBtn.addEventListener('click', function(){
    infoSection.style.height= "auto";
    moreBtn.style.display="none";
    lessBtn.style.display="block";
})

lessBtn.addEventListener('click', function(){
    infoSection.style.height= 198 + "px";
    moreBtn.style.display="block";
    lessBtn.style.display="none";
})
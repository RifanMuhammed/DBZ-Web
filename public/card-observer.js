const observer= new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            entry.target.classList.add("card-show");
        }
    });
},{
    threshold:0.1,
});

const hiddenElements=document.querySelectorAll('.card-hidden');
hiddenElements.forEach((el) => {observer.observe(el)});

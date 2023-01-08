// console.log("Hello World");
// Modal Set Up
const modalbtns = document.querySelectorAll(".homebtn");

modalbtns.forEach(btn => {
	btn.addEventListener("click", (e)=> {
		const option = e.target.getAttribute("class").split(" ")[1]+"-modal";
		const modal = document.querySelector("."+ option);
		modal.addEventListener("click",(e)=> {
			e.target.classList.remove('on');
		});
		modal.classList.toggle('on');
	});
});
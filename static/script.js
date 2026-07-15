const display = document.getElementById("display");
const buttons = document.querySelectorAll("button");

buttons.forEach(button => {

    button.addEventListener("click", async () => {

        const value = button.dataset.value;

        if(value==="C"){

            display.value="";

        }

        else if(value==="back"){

            display.value=display.value.slice(0,-1);

        }

        else if(value==="="){

            const response = await fetch("/calculate",{

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    expression:display.value

                })

            });

            const data = await response.json();

            display.value=data.result;

        }

        else{

            display.value+=value;

        }

    });

});
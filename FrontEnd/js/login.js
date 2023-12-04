const inputEmail = document.querySelector("[name=email]");
const inputPassword = document.querySelector("[name=password]");

console.log(inputEmail);
console.log(inputPassword);

 function submit() {
    const btnSubmit = document.querySelector("[type=submit]");
    console.log(btnSubmit);
    btnSubmit.addEventListener("click",async (e) => {
       e.preventDefault(); 
        const email = inputEmail.value;
        const password = inputPassword.value;
        let req = await fetch("http://localhost:5678/api/users/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json;charset=utf-8",
            },
            body:JSON.stringify({
                email:email,
                password:password,
            })
        });
        let response = await req.json();
        console.log(response);

        if (response.token) {
            // Stocker le token dans le localStorage
            localStorage.setItem('token', response.token);
console.log(response.token);
            // Rediriger l'utilisateur ou effectuer d'autres actions en cas de connexion réussie
            window.location.href = 'index.html'; 
        } else {
            
            // Gérer les erreurs ou afficher un message d'erreur si la connexion a échoué
            console.log('La connexion a échoué. Veuillez réessayer.');
        }
    })
}
    

submit();
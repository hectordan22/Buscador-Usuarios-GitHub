let btn_search = document.getElementById("btn-search")
const input_search = document.getElementById("input-search")
const containerSection =  document.querySelector(".container-section");


const checkTogle = document.getElementById("toggle")
const modeText = document.getElementById("mode")
const section_buscador = document.querySelector(".main-wraper")
const swit = document.querySelector(".switch")




checkTogle.addEventListener('click',()=>{
    if (checkTogle.checked) {
        console.log("modo claro")
        document.body.style="background-color:#fff; color:#000; "
        section_buscador.style = "background-color:#E3F6F7; color:#000;"
        input_search.style ="border: 0px solid;color:#000;border-bottom: 1px solid;"
        btn_search.style ="background-color:#88BCBF;"
        swit.style = "border: solid black  1px;"
        
        modeText.innerText="LightMode"
    }else{
        document.body.style="background-color: #0e0d0d98;"
        section_buscador.style = " background-color: #0e0d0dd0; color:#fff;"
        input_search.style ="border: 0px solid;color:#fff;border-bottom: 1px solid;"
        btn_search.style ="color: rgb(236, 236, 236); background-color: rgba(148, 144, 144, 0.788);";
        swit.style = "border: solid white 1px;"
       
        modeText.innerText="BlackMode"
    }
})

const url = "https://api.github.com/search/users";

// count sera la variable global que me controla el mostrar 10 repositorios 
// de cada usuario
var count = 0

btn_search.addEventListener('click',(e)=>{
     e.preventDefault()
     
     // Si el contenedor ya tiene elementos en su interior el nuevo evento es otra consulta
     // por lo tanto debo vaciar el contenedor para mostrar nuevamente 3 resultados
     if (containerSection.childElementCount != 0) {
        clearHTML()
     }else{
        document.getElementById("aviso").innerText = "Cargando datos..."
     }
     
     if (input_search.value=== "") {
        call_Error("Escriba un user de GitHub...");
        return;
    }
    callApiUser(input_search.value);
})


function  callApiUser(searh_user) {
    fetch(url+'?q='+searh_user)
    .then((resp) => resp.json())
    .then((data) => {
        
      // Si solo retorna menos de 3 o 3 usuarios como resultado de busqueda  
      if (data.items.length <= 3) {
          info_user(data.items)
      }else{
        // Si regresa mas de 3 yo tomo los primeros 3 ya que estos ya vienen ordenados desde la api
         const primeros3 = data.items.slice(0, 3)
         info_user(primeros3)
      }  
  
      

      })

    .catch((error)=> {
        call_Error(error.message+" No se pudo encontrar el usuario");
    });
}


 function info_user(users){

     users.forEach(user => {
       
         const userUrl = user.url;

         fetch(userUrl)
             .then((resp) => resp.json())
             .then(data => {

                 mostrar_user(data)
                 
             })

             .catch(error => {
                call_Error(error.message+" El usuario existe pero no se pudo acceder a la info");
             })

     });


}



 function mostrar_user(dataUser) {
    
    const {avatar_url, login, followers, following, name, public_repos,company,repos_url} = dataUser;
    const container = document.createElement("div");
    container.className ="user"
    
    
    container.innerHTML = `
        <div class="row-left">
            <img src="${avatar_url}" alt="user image">
        </div>
        <div class="row-right">
            <h3>Usuario: ${login}</h3>
            <p>Nombre: ${(name != null) ? name : 'Sin especificar'}</p>
            <div class="stats-user">
                <p>${followers} <span>Followers</span></p>
                <p>${following} <span>Following</span></p>
                <p>${public_repos} <span>Repos</span></p>
            </div>
            <h3>Repositorios:</h3>
            <div class="link-repos" id="${login}"></div>
           <span class="company">Compañia en la que trabaja: <strong>  ${(company != null) ? company : 'Sin especificar'} </strong></span>
           
        </div>
    `;
    containerSection.appendChild(container);
      mostrar_repo(repos_url)
    
    
     
    
}



function mostrar_repo(repo) {

    fetch(repo)
        .then((resp) => resp.json())
        .then(data => {
            data.sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 10)
                .forEach( element => {
                 
                 /* Accedo a el nombre de usuario al que pertenece el repositorio que se 
                  esta recorriendo . Para que coincida con la ficha de usuario impresa antes
                  
                  */
                 const container_repos = document.getElementById(element.owner.login)

                 const link = document.createElement("a");
                 link.innerText = element.name;
                 link.href = element.html_url;
                 link.target = "_blank";
                 container_repos.appendChild(link)

                });

                document.getElementById("aviso").innerText = ""
        })

        .catch(error => {
            call_Error(error.message+" Falla al obtener informacion de los repositorios del Usuario");
        })



}


function clearHTML(){
    containerSection.innerHTML = "";
    count = 0 
}

function call_Error(mensaje) {
    const mensajeNuevo = "Warning: " + mensaje;
    const error = document.createElement("h5");
    error.innerText = mensajeNuevo;
    error.style= "color:red; text-align:center;";
     document.getElementById("error_message").appendChild(error);
    setTimeout(() => error.remove(), 3000);
}


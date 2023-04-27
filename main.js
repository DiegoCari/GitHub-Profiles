const mainContainer =  document.querySelector(".main-wraper");
const inputUser =  document.querySelector(".search-section input");
const btnSearch =  document.querySelector(".search-section a");
const containerSection =  document.querySelector(".container-section");

const url = "https://api.github.com/users/";

btnSearch.addEventListener("click", buscarUser);

function buscarUser(e){
    e.preventDefault();
    if (inputUser.value === "") {
        mostrarError("Escriba un usuario valido");
        return;
    }
    callApiUser(inputUser.value);
}

async function callApiUser(user){
    const userUrl = url + user;
    const repoUrl =  `${url}${user}/repos`;

    try {
        const data = await Promise.all([fetch(userUrl), fetch(repoUrl)]);
        if (data[0].status === 404) {
            mostrarError("este usuario no existe");
            return;
        }
        const dataUser = await data[0].json();
        const dataRepo = await data[1].json();
        mostrarData(dataUser)
        mostrarRepos(dataRepo)
    } catch (error) {
        console.log(error)
    }
}
function mostrarData(dataUser){
    clearHTML()
    const {avatar_url, bio, followers, following, name, public_repos} = dataUser;
    const container = document.createElement("div");

    container.innerHTML = `
        <div class="row-left">
            <img src="${avatar_url}" alt="user image">
        </div>
        <div class="row-right">
            <h3 id="nombre">${name}</h3>
            <p id="biografia">${bio}</p>
            <div class="stats-user">
                <p>${followers} <span>Followers</span></p>
                <p>${following} <span>Following</span></p>
                <p id="repoCantidad">${public_repos} <span>Repos</span></p>
            </div>
            <h3>Repositorios:</h3>
            <div class="link-repos"></div>
        </div>
    `;
    containerSection.appendChild(container);
    if (bio === null) {
        const biografia = document.getElementById("biografia");
        biografia.remove()
    }
    if (name === null) {
        const nombre = document.getElementById("nombre");
        nombre.remove()
    }
}
function mostrarRepos(repos){
    const reposContainer = document.querySelector(".link-repos");
    repos   
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 10)
        .forEach(element => {
            const link = document.createElement("a");
            link.innerText = element.name;
            link.href = element.html_url;
            link.target = "_blank";
            reposContainer.appendChild(link);
        });
}
function mostrarError(message){
    const mensajeNuevo = message;
    const error = document.createElement("h5");
    error.innerText = mensajeNuevo;
    error.style.color = "red";

    mainContainer.appendChild(error);
    setTimeout(() => error.remove(), 2000);
}
function clearHTML(){
    containerSection.innerHTML = "";
}
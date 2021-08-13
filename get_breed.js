// initialize variables
let dataList = document.querySelector("#dog-breeds");
let searchButton = document.querySelector("#search-button");
let reset_button = document.querySelector("#reset");
let genr_button = document.querySelector("#getgenrimg");
let rand_img = document.querySelector("#getbreedimg");
let input = document.querySelector("#input-box");
let message = document.querySelector("#message");
let resp;
let img_gallery;
let html_img;
let dog_imgs = [];

async function get_search_img() {
    let resp;
    if (input.value != null) {
        try {
            resp = await $.getJSON(
                `https://dog.ceo/api/breed/${input.value}/images/random`,
            );
        } catch (err) {
            console.log("Breed doesn't exist!");
            return false;
        }
    } else {
        console.log(
            "Search a breed to get a random image of that breed first!",
        );
        return false;
    }
    input.value = "";
    let img = resp.message;
    html_img = $("#dogrand");
    html_img.html(
        "<p>Random image of searched breed: </p>" + "<img src='" + img + "'>",
    );
}

async function get_genr_img() {
    input.value = "";
    let resp = await $.getJSON(`https://dog.ceo/api/breeds/image/random`);
    let img = document.createElement("img");
    img.src = resp.message;
    html_img = $("#doggenr");
    html_img.append("<p>Generic random image: </p>\n");
    html_img.append(img);
}

// function to get the breed data
async function getBreeds() {
    input.value = "";
    resp = await axios.get("https://dog.ceo/api/breeds/list/all");
    let breeds = resp.data.message;
    for (let breed in breeds) {
        let option = document.createElement("option");
        option.value = breed;
        dataList.append(option);
    }
}

function render_msg() {
    input.value = "";
    message.innerHTML = `<h2>Found ${dog_imgs.length} results!</h2>`;
}

async function fetch_imgs(dog_breed) {
    input.value = "";
    let imgs = await axios.get(`https://dog.ceo/api/breed/${dog_breed}/images`);
    dog_imgs = [];
    for (let item of imgs.data.message) {
        dog_imgs.push(item);
    }
    img_gallery = document.querySelector("#gallery");
    img_gallery.innerHTML = "";
    for (let i = 0; i < dog_imgs.length; i++) {
        let cur_img = document.createElement("img");
        cur_img.src = dog_imgs[i];
        img_gallery.append(cur_img);
    }
    render_msg();
    console.log(dog_imgs);
}

function reset_all_imgs() {
    dog_imgs = [];
    img_gallery = document.querySelector("#gallery");
    img_gallery.innerHTML = "";
    html_img = $("#doggenr");
    html_img.html("");
    html_img = $("#dogrand");
    html_img.html("");
    message.innerHTML = "";
    input.value = "";
}

function findValue() {
    let value = input.value;
    let semi;
    if (resp.data.message[value] != undefined) {
        semi = resp.data.message[value];
    } else {
        console.log("No such breed!");
        semi = ["No such breed!"];
        return false;
    }
    let final = [];
    for (let i = 0; i < semi.length; i++) {
        final[i] = semi[i];
    }
    let infodiv = document.querySelector("#info");
    infodiv.innerHTML = "<p>No sub-breeds</p>";
    if (final.length > 0) {
        infodiv.innerHTML = "<p>";
        for (let i = 0; i < semi.length; i++) {
            if (i == semi.length - 1) {
                infodiv.innerHTML += final[i];
            } else {
                infodiv.innerHTML += final[i] + ", ";
            }
        }
        infodiv.innerHTML += "</p>";
    }
    fetch_imgs(value);
    input.value = "";
    console.log(resp.data.message[value]);
}

searchButton.addEventListener("click", findValue);
reset_button.addEventListener("click", reset_all_imgs);
genr_button.addEventListener("click", get_genr_img);
rand_img.addEventListener("click", get_search_img);
input.addEventListener("keyup", (press) => {
    if (press.key == "Enter") {
        findValue();
        input.value = "";
    }
});

// call the function
getBreeds();

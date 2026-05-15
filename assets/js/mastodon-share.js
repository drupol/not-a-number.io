// Source: https://github.com/codepo8/mastodon-share/
let key = "mastodon-instance";
let instance = localStorage.getItem(key);
instance = null === instance ? "" : instance;

const button = document.querySelector(".mastodon-share");

const refreshlink = (instance) => {
  let url = isValidUrl(instance);
  if (!url) {
    url = "https://" + instance;
  } else {
    url = instance;
  }
  button.href = `${url}/share?text=${encodeURIComponent(document.title)}%0A${encodeURIComponent(location.href)}`;
};

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

if (button) {
  let prompt = button.dataset.prompt || "Please tell me your Mastodon instance";
  let editlabel = button.dataset.editlabel || "Edit your Mastodon instance";
  let edittext = button.dataset.edittext || "✏️";

  const setinstance = (_) => {
    instance = window.prompt(prompt, instance);
    if (instance) {
      localStorage.setItem(key, instance);
      createeditbutton();
      refreshlink(instance);
      button.click();
    }
  };

  const createeditbutton = (_) => {
    if (document.querySelector("button.mastodon-edit")) return;
    let editlink = document.createElement("button");
    editlink.innerText = edittext;
    editlink.classList.add("mastodon-edit");
    editlink.title = editlabel;
    editlink.ariaLabel = editlabel;
    editlink.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem(key);
      setinstance();
    });
    button.insertAdjacentElement("afterend", editlink);
  };

  if (localStorage.getItem(key)) {
    createeditbutton();
  }

  button.addEventListener("click", (e) => {
    if (localStorage.getItem(key)) {
      refreshlink(localStorage.getItem(key));
    } else {
      e.preventDefault();
      setinstance();
    }
  });
}

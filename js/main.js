function setExpandableHover() {
  let selector = "";
  if (window.matchMedia('(hover:hover) and (pointer: fine)').matches) {
    selector = ".expandable"
  } else {
    selector = ".other"
  }
  document.querySelectorAll(selector).forEach(div => {
    div.addEventListener('mouseover', () => {
      div.classList.add('is-hovered');
    });
    div.addEventListener('mouseout', () => {
      div.classList.remove('is-hovered');
    })
  })
}

function toggleNoHeight() {
  document.querySelector("#main-panels").classList.toggle('no-height');
  document.querySelector(".pop-up").classList.toggle('no-height');
}

function meOpenClose() {


  document.querySelector("a.me").addEventListener('click', toggleNoHeight);
  document.querySelector(".pop-up>h2").addEventListener('click', toggleNoHeight);
}

function createRepoEl(repo) {

  const description = repo.description.length >= 75 ? repo.description.substring(0, 75) + '...' : repo.description
  // This is technically open to all sorts of unicode truncation jank, but given that I'm the one writing the commits,
  // We'll call it an acceptable edgecase
  let div = document.createElement("a");

  div.href = repo.html_url;
  div.innerHTML = `<div><h3>${repo.name}</h3>
  <span>${description}</span></div>`;
  return div;
}

async function recentRepos() {
  const githubPanel = document.querySelector(".github")
  const response = await fetch('https://api.github.com/users/cole-maguire/repos');
  const repos = await response.json();

  //We only want the first four most recently updateds, for space reasons
  let reposByDate = Array.from(repos).sort((a, b) => {
    let dateA = new Date(a.pushed_at);
    let dateB = new Date(b.pushed_at);
    return dateB - dateA;
  });
  reposByDate.slice(0, 3).forEach(repo => githubPanel.append(createRepoEl(repo)));

}

window.onload = () => {
  console.info("This was all written by hand - no need for heavyweight frameworks here.")
  recentRepos();
  setExpandableHover();
  meOpenClose();
}
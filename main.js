const container = document.querySelector(`.grid`);
const score = document.querySelector(`h2`);
let point = 0;
let allDivs;
let aliens = [];
let unicornPosition = 229;
let alienDirection = 1;
let width = 20;

function createGridAndAliens() {
  let indexAttr = 0;
  // création de la grille
  for (let index = 0; index < 240; index++) {
    if (indexAttr === 0) {
      const bloc = document.createElement(`div`);
      bloc.setAttribute(`data-left`, `true`);
      container.append(bloc);
      indexAttr++;
    } else if (indexAttr === 19) {
      const bloc = document.createElement(`div`);
      bloc.setAttribute(`data-right`, `true`);
      container.append(bloc);
      indexAttr = 0;
    } else {
      const bloc = document.createElement(`div`);
      container.append(bloc);
      indexAttr++;
    }
  }
  // création des aliens aliens
  for (let index = 1; index < 53; index++) {
    if (index === 13) {
      index = 21;
      aliens.push(index);
    } else if (index === 33) {
      index = 41;
      aliens.push(index);
    } else {
      aliens.push(index);
    }
  }
  // ajout des aliens et de la licorne sur la grille
  allDivs = document.querySelectorAll(`.grid div`);
  aliens.forEach((alien) => allDivs[alien].classList.add(`alien`));
  allDivs[unicornPosition].classList.add(`unicorn`);
}
createGridAndAliens();

function moveUnicorn(event) {
  allDivs[unicornPosition].classList.remove(`unicorn`);
  if (event.keyCode === 37 && unicornPosition > 220) {
    unicornPosition -= 1;
  } else if (event.keyCode === 39 && unicornPosition < 239) {
    unicornPosition += 1;
  }
  allDivs[unicornPosition].classList.add(`unicorn`);
}
document.addEventListener(`keydown`, moveUnicorn);

// mouvements des aliens
let moveToBottomRight = true;
let moveToBottomLeft = true;
function moveAliens() {
  for (let index = 0; index < aliens.length; index++) {
    if (allDivs[aliens[index]].getAttribute(`data-right`) === `true`) {
      if (moveToBottomRight) {
        alienDirection = 20;
        setTimeout(() => (moveToBottomRight = false), 50);
      } else if (!moveToBottomRight) {
        alienDirection = -1;
      }
      moveToBottomLeft = true;
    } else if (allDivs[aliens[index]].getAttribute(`data-left`) === `true`) {
      if (moveToBottomLeft) {
        alienDirection = 20;
        setTimeout(() => (moveToBottomLeft = false), 50);
      } else if (!moveToBottomLeft) {
        alienDirection = 1;
      }
      moveToBottomRight = true;
    }
  }
  for (let index = 0; index < aliens.length; index++) {
    allDivs[aliens[index]].classList.remove(`alien`);
  }
  for (let index = 0; index < aliens.length; index++) {
    aliens[index] += alienDirection;
  }
  for (let index = 0; index < aliens.length; index++) {
    allDivs[aliens[index]].classList.add(`alien`);
  }

  // gestion de la ligne de base
  if (allDivs[unicornPosition].classList.contains(`alien`, `unicorn`)) {
    score.textContent = `game over`;
    allDivs[unicornPosition].classList.add(`boom`);
    clearInterval(movingAliens);
  }

  for (let index = 0; index < aliens.length; index++) {
    if (aliens[index] > allDivs.length - width) {
      score.textContent = `game over`;
      clearInterval(movingAliens);
    }
  }
}
let movingAliens = setInterval(() => moveAliens(), 500);

function fire(event) {
  let laser;
  let laserInProgress = unicornPosition;

  function moveLaser() {
    allDivs[laserInProgress].classList.remove(`laser`);
    laserInProgress -= width;
    allDivs[laserInProgress].classList.add(`laser`);

    // destruction de l'alien
    if (allDivs[laserInProgress].classList.contains(`alien`)) {
      allDivs[laserInProgress].classList.remove(`laser`);
      allDivs[laserInProgress].classList.remove(`alien`);
      allDivs[laserInProgress].classList.add(`boom`);

      aliens = aliens.filter((alien) => alien !== laserInProgress);
      setTimeout(() => allDivs[laserInProgress].classList.remove(`boom`), 200);
      clearInterval(laser);

      //gestion du score
      point++;
      if (point === 36) {
        score.textContent = `you win`;
        clearInterval(laser);
      } else {
        score.textContent = `score : ${point}`;
      }
    }

    // gestion de la sortie d'écran du laser
    if (laserInProgress < width) {
      clearInterval(laser);
      setTimeout(() => allDivs[laserInProgress].classList.remove(`laser`), 100);
    }
  }

  if (event.keyCode === 32) laser = setInterval(() => moveLaser(), 100);
}
document.addEventListener(`keyup`, fire);

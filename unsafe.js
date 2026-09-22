(() => {
  const dialog = document.querySelector("#password-dialog");
  const form = document.querySelector("#password-form");
  const input = document.querySelector("#archive-password");
  const error = document.querySelector("#password-error");
  const protectedBlocks = document.querySelectorAll(".restricted-content");

  const appendArchive = (targetId, code, name) => {
    const target = document.querySelector(targetId);
    const fragment = document.createDocumentFragment();

    for (let number = 12; number <= 20; number += 1) {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      const caption = document.createElement("figcaption");

      image.src = `https://gbe88.uk/TX/${code}_${number}.webp`;
      image.alt = `${name} 제한 화보 ${number}`;
      image.loading = "lazy";
      caption.textContent = `${code} · ${number}`;
      figure.append(image, caption);
      fragment.append(figure);
    }

    target.append(fragment);
  };

  const unlock = () => {
    appendArchive("#unsafe-itae-images", "Y", "윤이태");
    appendArchive("#unsafe-mugyeong-images", "C", "차무경");
    protectedBlocks.forEach((block) => { block.hidden = false; });
    document.body.classList.remove("is-locked");
    dialog.close();
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value === "1960txcorp") {
      unlock();
      return;
    }

    error.textContent = "비밀번호가 일치하지 않습니다.";
    input.value = "";
    input.focus();
  });

  dialog.addEventListener("cancel", (event) => event.preventDefault());
  dialog.showModal();
  input.focus();
})();

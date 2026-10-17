window.typeWriter = function (element) {
    const characters = Array.from(element.textContent);
    const text = document.createElement("span");
    text.className = "typed-text";
    element.replaceChildren(text);

    let index = 0;
    function typeNextCharacter() {
        text.textContent += characters[index];
        index += 1;

        if (index < characters.length) {
            window.setTimeout(typeNextCharacter, 75);
        }
    }

    if (characters.length > 0) {
        typeNextCharacter();
    }
};

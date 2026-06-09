const wrap = (i, l) => ((i % l) + l) % l;
const IMAGES = [
  {
    src: "./images/illustrations/sal.gif",
    alt: "Sal Fisher from Sally Face; looping gif illustration",
  },
  {
    src: "./images/illustrations/sneak.png",
    alt: "Cute toast bear illustration",
  },
  {
    src: "./images/illustrations/mushguy.gif",
    alt: "A cute mushroom guy who lifts his head to reveal an uglier mushroom guy underneath; looping illustration",
  },
  {
    src: "./images/illustrations/friend.gif",
    alt: "Black blood oozing out to reveal a yellow-eyed creature with a white grin; looping illustration",
  },
  {
    src: "./images/illustrations/tamas.png",
    alt: "Kuchipatchi and Mametchi Tamagotchi illustrations",
  },
  {
    src: "./images/illustrations/prince.gif",
    alt: "Ralsei from Deltarunel; looping gif illustration",
    natural: true,
  },
  {
    src: "./images/illustrations/pupy.gif",
    alt: "Weird puppy from space with several legs; looping gif illustration",
    natural: true,
  },
  {
    src: "./images/illustrations/snooby.png",
    alt: "Snoopy from Peanuts illustration",
  },
  {
    src: "./images/illustrations/finn.png",
    alt: "Finn the Human from Adventure Time illustration",
  },
];

class Carousel {
  #root;
  #track;
  #buttons = [];
  #images = [];
  #indexMap = new WeakMap();
  #prev;
  #next;
  #displayImg;
  #currentIndex = 0;
  #prevButton;
  #controller = new AbortController();

  #keyActions = {
    ArrowLeft: () => this.#set(this.#currentIndex - 1),
    ArrowRight: () => this.#set(this.#currentIndex + 1),
    Home: () => this.#set(0),
    End: () => this.#set(this.#buttons.length - 1),
  };

  constructor(root, images) {
    this.#root = root;
    this.#track = root.querySelector(".carousel-track");
    this.#prev = root.querySelector(".prev");
    this.#next = root.querySelector(".next");
    this.#displayImg = root.querySelector(".carousel-display img");

    if (!this.#track || !this.#displayImg || !images?.length) return;

    this.#images = images;
    this.#buildSlides();
    this.#init();
    this.#render();
  }

  #buildSlides() {
    const frag = document.createDocumentFragment();

    this.#buttons = this.#images.map((image, i) => {
      const li = document.createElement("li");
      li.className = "scroll-element carousel-item";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "scroll-btn carousel-button scroll-button";
      btn.append(
        Object.assign(new Image(), {
          src: image.src,
          alt: image.alt,
          loading: "lazy",
          className: "thumbnail",
        }),
      );

      li.append(btn);
      frag.append(li);
      this.#indexMap.set(btn, i);
      return btn;
    });

    this.#track.replaceChildren(frag);
  }

  #set(index) {
    if (!this.#buttons.length) return;
    const next = wrap(index, this.#buttons.length);
    if (next === this.#currentIndex) return;
    this.#currentIndex = next;
    this.#render();
  }

  #scroll(btn) {
    const { clientWidth } = this.#track;
    const left = btn.offsetLeft - (clientWidth / 2 - btn.offsetWidth / 2);
    this.#track.scrollTo({ left, behavior: "smooth" });
  }

  #updateDisplayImage(image) {
    this.#displayImg.src = image.src;
    this.#displayImg.alt = image.alt;
    this.#displayImg.classList.toggle("is-natural", !!image.natural);

    const next =
      this.#images[wrap(this.#currentIndex + 1, this.#images.length)];
    if (next) new Image().src = next.src;
  }

  #render() {
    const btn = this.#buttons[this.#currentIndex];
    const image = this.#images[this.#currentIndex];
    if (!btn || !image) return;

    this.#prevButton?.setAttribute("aria-pressed", "false");
    btn.setAttribute("aria-pressed", "true");

    this.#updateDisplayImage(image);
    this.#scroll(btn);
    this.#prevButton = btn;
  }

  #handleTrackClick = ({ target }) => {
    const btn = target.closest("button");
    if (!btn) return;
    const index = this.#indexMap.get(btn);
    if (index !== undefined) this.#set(index);
  };

  #handleKeyDown = (e) => {
    const action = this.#keyActions[e.key];
    if (!action) return;
    e.preventDefault();
    action();
  };

  #handleWheel = (e) => {
    if (e.deltaY !== 0 && e.deltaX === 0) {
      window.scrollBy({ top: e.deltaY, behavior: "instant" });
      e.preventDefault();
    }
  };

  #init() {
    const { signal } = this.#controller;
    this.#track.addEventListener("click", this.#handleTrackClick, { signal });
    this.#track.addEventListener("wheel", this.#handleWheel, {
      signal,
      passive: false,
    });
    this.#prev?.addEventListener(
      "click",
      () => this.#set(this.#currentIndex - 1),
      { signal },
    );
    this.#next?.addEventListener(
      "click",
      () => this.#set(this.#currentIndex + 1),
      { signal },
    );
    this.#root.addEventListener("keydown", this.#handleKeyDown, { signal });
  }
}

document
  .querySelectorAll(".carousel-wrapper")
  .forEach((el) => new Carousel(el, IMAGES));

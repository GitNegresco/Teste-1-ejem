const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonType = document.querySelector('.pokemon__type');
const pokemonMoves = document.querySelector('.pokemon__moves');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

// áudio
const pokemonAudio = new Audio();

const fetchPokemon = async (pokemon) => {
  try {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (!APIResponse.ok) throw new Error('Erro na API');

    return await APIResponse.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

const playPokemonSound = (id) => {
  pokemonAudio.src = `https://play.pokemonshowdown.com/audio/cries/${id}.mp3`;
  pokemonAudio.volume = 0.5;

  pokemonAudio.play().catch(() => {
    // evita erro de autoplay
  });
};

const renderPokemon = async (pokemon) => {
  pokemonName.innerHTML = 'Loading...';
  pokemonNumber.innerHTML = '';

  if (pokemonType) pokemonType.innerHTML = '';
  if (pokemonMoves) pokemonMoves.innerHTML = '';

  const data = await fetchPokemon(pokemon);

  if (data) {
    pokemonImage.style.display = 'block';
    pokemonName.innerHTML = data.name;
    pokemonNumber.innerHTML = data.id;

    // ✅ TIPOS (corrigido)
    if (pokemonType) {
      pokemonType.innerHTML = data.types
        .map(t => t.type.name)
        .join(', ');
    }

    // ✅ MOVES (corrigido)
    if (pokemonMoves) {
      pokemonMoves.innerHTML = data.moves
        .slice(0, 3)
        .map(m => m.move.name)
        .join(', ');
    }

    // ✅ IMAGEM SEGURA
    pokemonImage.src =
      data.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default
      || data.sprites?.front_default
      || '';

    playPokemonSound(data.id);

    input.value = '';
    searchPokemon = data.id;

  } else {
    pokemonImage.style.display = 'none';
    pokemonName.innerHTML = 'Not found :c';
    pokemonNumber.innerHTML = '';

    if (pokemonType) pokemonType.innerHTML = '';
    if (pokemonMoves) pokemonMoves.innerHTML = '';
  }
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
  if (searchPokemon > 1) {
    searchPokemon--;
    renderPokemon(searchPokemon);
  }
});

buttonNext.addEventListener('click', () => {
  searchPokemon++;
  renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);

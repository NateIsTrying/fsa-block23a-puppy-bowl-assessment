// Use the API_URL variable to make fetch requests to the API.
const cohortName = "2306-FSA-ET-WEB-FT-SF";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players`);
    const puppiesData = await response.json();
    const allPlayerData = puppiesData.data.players;
    return allPlayerData;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */

const fetchSinglePlayer = async (playerId) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const puppyData = await response.json();
    const singlePlayerData = puppyData.data.player;
    // console.log(singlePlayerData);

    if(!singlePlayerData){
      console.log(`Player #${playerId} not found.`);
      return null;
    }
    return singlePlayerData;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    return null;
  }
};


/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    // TODO
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      body: JSON.stringify(playerObj),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = response.json();
    return data;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
    console.log(`${playerId} has been removed.`);
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    console.log(`It's ${result.success}, the result was a success.`);
    // renderAllPlayers(players);
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * "See details" button that, when clicked, calls `renderSinglePlayer` to
 * display more information about the player
  "Remove from roster" button that, when clicked, will call `removePlayer` to
   remove that specific player and then re-render all players

 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  // TODO
  try {
    const main = document.querySelector('main');
    main.innerHTML = ``;
    playerList.forEach((player) => {
      const section = document.createElement('section');
      main.appendChild(section);
      section.innerHTML = `
      <h3>${player.name}</h3>
      <h5>Breed: ${player.breed}</h5>
      <img src='${player.imageUrl}'/>
    
      <button class='details-button' data-id=${player.id}>See Details</button>
      <button class='delete-button' data-id=${player.id}>Remove from Roster</button>
      `
    });

    const detailsButtons = document.querySelectorAll('.details-button');
    detailsButtons.forEach(detailsButton => {
      detailsButton.addEventListener('click', async(event) => {
      const playerId = event.target.getAttribute('data-id');
      console.log(playerId);

      await renderSinglePlayer(playerId);
  
    })
  });

    const deleteButtons = document.querySelectorAll('.delete-button');
    deleteButtons.forEach((deleteButton) => {
      deleteButton.addEventListener('click', async (event) => {
        const playerId = event.target.getAttribute('data-id');
        console.log(playerId);
       
        await removePlayer(playerId);

    })
  });


  } catch (error) {
    console.log(`issue occured in 'render all players'`, error);
  }
};




/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = async (playerId) => {
  // TODO
  try {
    const main = document.querySelector('main');
    main.innerHTML = '';
    const player = await fetchSinglePlayer(playerId);

    if(!player){
      const section = document.createElement('section');
      main.appendChild(section);
      section.innerHTML = `<h3>Player not found.</h3>`;
      return;
    }

    const section = document.createElement('section');
    main.appendChild(section);
    section.innerHTML = `
      <h3>${player.name}</h3>
      <h5>Breed: ${player.breed}</h5>
      <img src='${player.imageUrl}'/>

      <button class='return-button'>Return</button>
      <button class='delete-button' data-id=${player.id}>Remove from Roster</button>
    `;
  
    const returnButton = document.querySelector('.return-button');
    returnButton.addEventListener('click', async() => {
      const players = await fetchAllPlayers();
      renderAllPlayers(players);  
    });

    const deleteButton = document.querySelector('.delete-button');
    deleteButton.addEventListener('click', async() => {
      await removePlayer(player.id);
    })
  } catch (error) {
    console.log('Error occured in renderSinglePlayer', error);
  }
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */

const renderNewPlayerForm = async () => {
  try {
    // TODOAPI_URL
    const response = await fetch (`${API_URL}/teams`);
    const result = await response.json();
    // console.log(result);

    let formHTML = `
      <h3>Add a new puppy!</h3>
      <label for='name'>Name:</label>
      <input type='text' id='name' name='name' placeholder='Scooby Doo' required>
      <label for='breed'>Breed:</label>
      <input type='text' id='breed' name='breed' placeholder='Mutt' required>
      <label for='imageUrl'>Image URL:</label>
      <input type='text' id='imageUrl' name='image Url' placeholder='Google Images' required>
      <button type='submit' > Add a new Puppy!</button>
    `
    const form = document.querySelector('form');
    form.innerHTML = formHTML;

    form.addEventListener('submit', submitHandler);
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

const submitHandler = async (event) => {
  event.preventDefault();

  const form = event.target;
  
  const name = form.name.value;
  const breed = form.breed.value;
  const img = form.imageUrl.value;
  console.log(img)

  const data = await addNewPlayer({
    name,
    breed,
    imageUrl: img, 
    status: 'bench',
  }) ;

  // if(data){
  //   alert(`${data.name} was created with ID: ${data.id}`)
  // }

  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  form.name.value = ''
  form.breed.value = ''
  form.imageUrl.value = ''
}

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {

  // addNewPlayer({
  //   name: 'Cujo',
  //   breed: 'Saint Bernard',
  //   imageUrl: 'https://upload.wikimedia.org/wikipedia/en/d/de/Beethoven%271992.jpg'
  // })

  // removePlayer(13390);

  const players = await fetchAllPlayers();
  console.log(players);
  // await fetchSinglePlayer();
  renderAllPlayers(players);
  // renderSinglePlayer(players[0])
  // renderNewPlayerForm();

  renderNewPlayerForm()
};

init();


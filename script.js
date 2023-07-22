// Use the API_URL variable to make fetch requests to the API.
const cohortName = "2306-FSA-ET-WEB-FT-SF";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const puppiesData = await response.json();
    const allPlayerData = puppiesData.data.players;
    return allPlayerData;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const puppyData = await response.json();
    const singlePlayerData = puppyData.data.player;

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

const addNewPlayer = async (playerObj) => {
  try {
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

const removePlayer = async (playerId) => {
    console.log(`${playerId} has been removed.`);
    const response = await fetch(`${API_URL}/players/${playerId}`, {
      method: 'DELETE',
    });
    const result = await response.json();
    console.log(`It's ${result.success}, the result was a success.`);
};

const renderAllPlayers = (playerList) => {
  try {
    const main = document.querySelector('main');
    main.innerHTML = ``;
    playerList.forEach((player) => {
      const section = document.createElement('section');
      main.appendChild(section);
      section.innerHTML = `

      <div class='player-info'>
        <h3>${player.name}</h3>
        <h5>Breed: ${player.breed}</h5>

        <img src='${player.imageUrl}'/>
        <button class='details-button' data-id=${player.id}>See Details</button>
        <button class='delete-button' data-id=${player.id}>Remove from Roster</button>
      </div>
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

const renderSinglePlayer = async (playerId) => {
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

      <div class='player-info'>
        <h3>${player.name}</h3>
        <h5>Breed: ${player.breed}</h5>

        <img src='${player.imageUrl}'/>
        <button class='return-button'>Return</button>
        <button class='delete-button' data-id=${player.id}>Remove from Roster</button>
      </div>
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

const renderNewPlayerForm = async () => {
  try {
    const response = await fetch (`${API_URL}/teams`);
    const result = await response.json();

    let formHTML = `
      <h3>Add a new puppy!</h3>
      <label for='name'>Name:</label>
      <input type='text' id='name' name='name' placeholder='Scooby Doo' required>
      <label for='breed'>Breed:</label>
      <input type='text' id='breed' name='breed' placeholder='Mutt' required>
      <label for='imageUrl'>Image URL:</label>
      <input type='text' id='imageUrl' name='image Url' placeholder='Google Images' required>
      <button type='submit' > Add a new Puppy!</button>
    `;

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

  const data = await addNewPlayer({
    name,
    breed,
    imageUrl: img, 
    status: 'bench',
  }) ;

  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  form.name.value = ''
  form.breed.value = ''
  form.imageUrl.value = ''
}

const init = async () => {
  const players = await fetchAllPlayers();
  
  renderAllPlayers(players);
  renderNewPlayerForm()
};

init();


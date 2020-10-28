
// declares array to be used for toggling through modals
let usersArray = [];
//selects the search container div
const searchContainer = $('.search-container');
//Creates the search bar element
let form = `
              <input id="search-input" class="search-input" placeholder="Search...">
            `;

//selects the gallery div 
let gallery = $('#gallery');
// Adds the search bar to the DOM
$(searchContainer).append(form);
// Filters the gallery down to the search criteria
$('#search-input').keyup(()=>{
  // gets the text in the input box
  let str = $('#search-input').val();
  //selects the names of the profiles
  let cardDivs = $('h3');
  // hides them all initially
  $('.card').hide();
  // loops through the names loooking for a match
  for (let i = 0;i < cardDivs.length;i++){
    let comp = cardDivs[i].innerHTML.toLowerCase()
    if ((comp.includes(str.toLowerCase()))){
      // idsplays the profile if it is a match
      $(cardDivs[i]).parent().parent().show();
    }
  }
  
})
// gets the profiles from the API
$.ajax({
    url: 'https://randomuser.me/api/?results=12&nat=us',
    dataType: 'json',
    success: function(data) {
    profiles = data;
    //loops through the results and creates user objects 
    for (var i = 0; i < profiles.results.length; i++){

      let currentProfile = profiles.results[i];
      let newUser = new User(currentProfile, i );
      // posts the profile to the page
      newUser.postToGallery();
      // creates a listener on the profile
      newUser.addListener();
      // adds the user to an array for filtering. Used on the searchbar keyup event handler
      usersArray.push(currentProfile);

    }

    }
  });
  // function called by user objects to display each one to the page
  function displayGallery(user, index){
    $('#gallery').append(
    `
    <div class="card">
    <div class="card-img-container">
        <img class="card-img" src=${user.picture.large} alt="profile picture">
    </div>
    <div class="card-info-container">
        <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
        <p class="card-text">${user.email}</p>
        <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
    </div>
  </div>
    `
    )
    // adds the listener to display the modal, and passes it the correct card by providing the index  
    let userModal = document.getElementsByClassName('card')[index];
    userModal.addEventListener('click',function(){
      displayModal(user, index);
    })

  }
  //function for displaying the profiles
  function displayModal(user, index){
    // regex for the phone number
    const finalRegex = /^(\d{3})(\d{3})/
    // add the parenthesis and hyphens to the phone numbers
    let replacement = '($1) $2-'
    // variable for the raw cell phone number
    let phoneNum = user.cell;
    
    // strips all non digits from the string
    let rawPhone = phoneNum.replace(/\D/g,'');
    // variable for the formatted phone
    let formattedPhone = rawPhone.replace(finalRegex,replacement);
    // gymnastics to get the birthday properly formatted
    let birthday = new Date(user.dob.date);
    let dobString = ((birthday.getMonth() > 8) ? (birthday.getMonth() + 1) : ('0' + (birthday.getMonth() + 1))) + '/' + ((birthday.getDate() > 9) ? birthday.getDate() : ('0' + birthday.getDate())) + '/' + birthday.getFullYear();
    
    // removes any existing modals from the page
    $('.modal-container').remove()
    // adds the modal to the page
    $('body').append(`
    <div class="modal-container">
    <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
            <img class="modal-img" src=${user.picture.large} alt="profile picture">
            <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
            <p class="modal-text">${user.email}</p>
            <p class="modal-text cap">${user.location.city}</p>
            <hr>
            <p class="modal-text">${formattedPhone}</p>
            <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.state} ${user.location.postcode}</p>
            <p class="modal-text">Birthday: ${dobString}</p>
        </div>
        <div class="modal-btn-container">
        <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
        <button type="button" id="modal-next" class="modal-next btn">Next</button>
    </div>
    </div>
    `)
    // removes the previous button if it is the last employee in the directory
    if (index === 0){
      $('#modal-prev').remove();
    // removes the next button if it is the last employee in the directory
    } else if (index === usersArray.length - 1){
      $('#modal-next').remove();
    }

    // gets the next employee from the usersArray and displays a new modal when "Next" is clicked
    $('#modal-next').click(() =>{
      let newIndex = index + 1;
      let nextEmployee = usersArray[index + 1];
      $('.modal-container').remove();
      displayModal(nextEmployee, newIndex);
    });
    
    
    // gets the previous employee from the usersArray and displays a new modal when "Next" is clicked
    $('#modal-prev').click(() =>{
      let prevIndex = index - 1;
      let prevEmployee = usersArray[index - 1];
      $('.modal-container').remove();
      displayModal(prevEmployee, prevIndex);
    });
    // closes the model when the X button is clicked
    $('.modal-close-btn').click(() =>{ $('.modal-container').remove() })
  }
// constructor for creating the user objects
function User (user, index) {
  this.firstName = user.name.first;
  this.lastName = user.name.last;
  this.addListener = function(){
    
  }

  this.card = $(this.listener)[index];
  this.displayFunction = $(this.card).click(()=>{
    displayModal(this.firstName,this.lastName, index);
  })
  this.postToGallery = function(){
    displayGallery(user, index);
  }
}
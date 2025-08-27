        // DOM elements
        const viewContent = document.getElementById('view-content');
        const refreshBtn = document.getElementById('refresh-btn');
        const apiOptions = document.querySelectorAll('.api-option');
        const viewTitle = document.querySelector('.view-title');
        const chatMessages = document.getElementById('chat-messages');
        const chatInput = document.getElementById('chat-input');
        const sendMessageBtn = document.getElementById('send-message');
        const menuToggle = document.querySelector('.menu-toggle');
        const miniPlayer = document.querySelector('.mini-player');
        
        // Current active API
        let currentApi = 'dog';
        
        // Generate random usernames for chat
        const adjectives = ['Happy', 'Sunny', 'Clever', 'Brave', 'Mighty', 'Swift', 'Wise', 'Jolly'];
        const nouns = ['Tiger', 'Eagle', 'Dolphin', 'Panda', 'Fox', 'Lion', 'Owl', 'Wolf'];
        // Function to generate a random username
        function generateUsername() {
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const noun = nouns[Math.floor(Math.random() * nouns.length)];
            const num = Math.floor(Math.random() * 1000);
            return `${adj}${noun}${num}`;
        }
        // Store the generated username
        const chatUsername = generateUsername();
        
        // Menu toggle functionality
        menuToggle.addEventListener('click', () => {
            miniPlayer.classList.toggle('hidden');
        });
        
        // Fetch random dog image
        async function fetchDog() {//dog.ceo
            viewContent.innerHTML = '<p class="loading">Loading dog image...</p>';//loading message
            try {//try-catch for error handling
                const response = await fetch('https://dog.ceo/api/breeds/image/random');//fetch from dog API
                const data = await response.json();//parse JSON response
                if (data.status === 'success') {//check if response is successful
                    viewContent.innerHTML = `
                        <img src="${data.message}" alt="Random Dog" class="dog-img">
                        <button class="btn" onclick="fetchData('dog')">Another Dog</button>
                    `; //display dog image and button
                } else {//handle unsuccessful response
                    throw new Error('Failed to fetch dog image');
                }
            } catch (error) {//catch block for errors
                console.error('Failed to fetch dog image:', error);
                viewContent.innerHTML = `<p class="error">Failed to fetch dog image${error.message ? ': ' + error.message : ''}</p>`;
            }
        }

        // Fetch random cat image
        async function fetchCat() {
            viewContent.innerHTML = '<p class="loading">Loading cat image...</p>';
            try {
                const response = await fetch('https://api.thecatapi.com/v1/images/search');
                const data = await response.json();
                viewContent.innerHTML = `
                    <img src="${data[0].url}" alt="Random Cat" class="cat-img">
                    <button class="btn" onclick="fetchData('cat')">Another Cat</button>
                `;
            } catch (error) {
                console.error('Failed to fetch cat image:', error);
                viewContent.innerHTML = `<p class="error">Failed to fetch cat image${error.message ? ': ' + error.message : ''}</p>`;
            }
        }

        // Fetch weather data
        async function fetchWeather() {
            viewContent.innerHTML = '<p class="loading">Loading weather data...</p>';
            try {
                // Using Open-Meteo API for Berlin
                const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=13.4088&longitude=122.5615&current=temperature_2m,relative_humidity_2m&forecast_days=1&timeformat=unixtime&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch');
                const data = await response.json();
                viewContent.innerHTML = `
                    <div class="weather-info">
                        <h3>Manila, Philippines</h3>
                        <p class="temp">${data.current.temperature_2m} ${data.current_units.temperature_2m}</p>
                        <p>Humidity level: ${data.current.relative_humidity_2m}%</p>
                    </div>
                    <button class="btn" onclick="fetchData('weather')">Refresh Weather</button>
                `;
            } catch (error) {
                console.error('Failed to fetch weather data:', error);
                viewContent.innerHTML = `<p class="error">Failed to fetch weather data${error.message ? ': ' + error.message : ''}</p>`;
            }
        }

        // Fetch currency exchange rate
        async function fetchCurrency() {
            viewContent.innerHTML = '<p class="loading">Loading exchange rate...</p>';
            try {
                const response = await fetch('https://v6.exchangerate-api.com/v6/20a7ba2e90f93091b3ffe6d0/latest/USD');
                const data = await response.json();
                viewContent.innerHTML = `
                    <div class="currency-info">
                        <p>USD to PHP</p>
                        <p class="currency-rate">1 USD = ${data.conversion_rates.PHP} PHP</p>
                        <p>Last updated: ${new Date(data.time_last_update_utc).toLocaleDateString()}</p>
                    </div>
                    <button class="btn" onclick="fetchData('currency')">Refresh Rate</button>
                `;
            } catch (error) {
                console.error('Failed to fetch exchange rate:', error);
                viewContent.innerHTML = `<p class="error">Failed to fetch exchange rate${error.message ? ': ' + error.message : ''}</p>`;
            }
        }

         // Fetch trending movies
        async function fetchMovies() {
            viewContent.innerHTML = '<p class="loading">Loading movie data...</p>';
            try {
                // Using TMDB API with the provided key
                const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=67bd47cf58a4d5d38bbe49a1dc530323`);//fetch from TMDB API
                const data = await response.json();//parse JSON response
                
                let moviesHTML = `
                    <h3>Trending Movies Today</h3>
                    <ul class="movie-list">
                `;//start building HTML for movie list
                
                data.results.slice(0, 5).forEach(movie => {//limit to top 5 movies
                    moviesHTML += `
                        <li class="movie-item">
                            <i class="fas fa-film"></i> ${movie.title} (${new Date(movie.release_date).getFullYear()})
                        </li>
                    `;//add each movie to the list
                });
                
                moviesHTML += `
                    </ul>
                    <button class="btn" onclick="fetchData('movies')">Refresh Movies</button>
                `;//close the movie list HTML
                
                viewContent.innerHTML = moviesHTML;//set the inner HTML to display movies
            } catch (error) {//catch block for errors
                console.error('Failed to fetch movies:', error);
                viewContent.innerHTML = `<p class="error">Failed to fetch movies. Please try again later.${error.message ? ': ' + error.message : ''}</p>`;
            }
        }

        // Fetch GitHub user data
        async function fetchGitHubUser(username = 'justinwols88'){//default username to 'justinwols88'
            viewContent.innerHTML = '<p class="loading">Loading GitHub user...</p>';//loading message
            try {//try-catch for error handling
                const response = await fetch(`https://api.github.com/users/${username}`);//fetch from GitHub API
                if (!response.ok) {//check if response is not ok
                    throw new Error('User not found');//throw error if user not found
                }
                const data = await response.json();//parse JSON response
                
                viewContent.innerHTML = `
                    <div class="github-user">
                        <div class="github-search">
                            <input type="text" id="github-username" placeholder="Enter GitHub username" value="${username}">
                            <button onclick="fetchGitHubUser(document.getElementById('github-username').value)">Search</button>
                        </div>
                        <img src="${data.avatar_url}" alt="${data.login}" class="avatar">
                        <h2>${data.name || data.login}</h2>
                        <p>${data.bio || 'No bio available'}</p>
                        
                        <div class="user-stats">
                            <div class="stat">
                                <div class="stat-number">${data.public_repos}</div>
                                <div class="stat-label">Repositories</div>
                            </div>
                            <div class="stat">
                                <div class="stat-number">${data.followers}</div>
                                <div class="stat-label">Followers</div>
                            </div>
                            <div class="stat">
                                <div class="stat-number">${data.following}</div>
                                <div class="stat-label">Following</div>
                            </div>
                        </div>
                        
                        <div class="user-details">
                            ${data.company ? `<div class="detail-item"><i class="fas fa-building"></i> ${data.company}</div>` : ''}
                            ${data.location ? `<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ${data.location}</div>` : ''}
                            ${data.blog ? `<div class="detail-item"><i class="fas fa-link"></i> <a href="${data.blog}" target="_blank">Website</a></div>` : ''}
                            ${data.twitter_username ? `<div class="detail-item"><i class="fab fa-twitter"></i> @${data.twitter_username}</div>` : ''}
                        </div>
                        
                        <a href="${data.html_url}" target="_blank" class="profile-link">View Profile</a>
                    </div>
                `;//display user info
            } catch (error) {
                console.error('Failed to fetch GitHub user:', error);//log error to console
                viewContent.innerHTML = `
                    <div class="github-user">
                        <div class="github-search">
                            <input type="text" id="github-username" placeholder="Enter GitHub username">
                            <button onclick="fetchGitHubUser(document.getElementById('github-username').value)">Search</button>
                        </div>
                        <p class="error">${error.message || 'Failed to fetch user data'}</p>
                        <p>Please check the username and try again.</p>
                    </div>
                `;//display error message and search box
            }
        }

        // Fetch a random joke
        async function fetchJoke() {
            viewContent.innerHTML = '<p class="loading">Loading joke...</p>';
            try {
                const response = await fetch('https://v2.jokeapi.dev/joke/Any?type=single');
                const data = await response.json();
                viewContent.innerHTML = `
                    <p class="joke-text">${data.joke}</p>
                    <button class="btn" onclick="fetchData('joke')">Another Joke</button>
                `;//display joke and button
            } catch (error) {
                console.error('Failed to fetch joke:', error);
                viewContent.innerHTML = `<p class="error">Failed to fetch joke${error.message ? ': ' + error.message : ''}</p>`;//display error message
            }
        }

        // Fetch public APIs data
        async function fetchPublicAPI() {
            viewContent.innerHTML = '<p class="loading">Loading API data...</p>';
            try {
                const response = await fetch('https://api.publicapis.org/entries?category=development&https=true');
                const data = await response.json();
                
                let apiHTML = `
                    <h3>Featured Public APIs</h3>
                    <ul class="api-list">
                `;
                
                data.entries.slice(0, 5).forEach(api => {
                    apiHTML += `
                        <li class="api-item"><i class="fas fa-plug"></i> ${api.API} - ${api.Description}</li>
                    `;
                });
                
                apiHTML += `
                    </ul>
                    <button class="btn" onclick="fetchData('public')">Refresh APIs</button>
                `;
                
                viewContent.innerHTML = apiHTML;
            } catch (error) {
                console.error('Failed to fetch API data:', error);
                // Fallback to mock data if API fails
                viewContent.innerHTML = `
                    <h3>Featured Public APIs</h3>
                    <ul class="api-list">
                        <li class="api-item"><i class="fas fa-paw"></i> Dog API - Collection of dog images</li>
                        <li class="api-item"><i class="fas fa-cloud-sun"></i> Open-Meteo - Weather data</li>
                        <li class="api-item"><i class="fas fa-money-bill-wave"></i> ExchangeRate-API - Currency exchange rates</li>
                        <li class="api-item"><i class="fas fa-film"></i> TMDB API - Movie database</li>
                        <li class="api-item"><i class="fab fa-github"></i> GitHub API - User and repo information</li>
                    </ul>
                    <button class="btn" onclick="fetchData('public')">Refresh APIs</button>
                `;
            }
        }//end of fetchPublicAPI

        // Function to fetch data based on API type
        function fetchData(apiType) {
            currentApi = apiType;
            
            // Update view title
            const apiTitles = {
                dog: 'Random Dog API',
                cat: 'Random Cat API',
                weather: 'Weather API',
                currency: 'Currency API',
                movies: 'Movies API',
                github: 'GitHub API',
                joke: 'Joke API',
                public: 'Public APIs'
            };
            viewTitle.textContent = apiTitles[apiType];
            
            // Call the appropriate fetch function
            switch(apiType) {
                case 'dog':
                    fetchDog();
                    break;
                case 'cat':
                    fetchCat();
                    break;
                case 'weather':
                    fetchWeather();
                    break;
                case 'currency':
                    fetchCurrency();
                    break;
                case 'movies':
                    fetchMovies();
                    break;
                case 'github':
                    fetchGitHubUser();
                    break;
                case 'joke':
                    fetchJoke();
                    break;
                case 'public':
                    fetchPublicAPI();
                    break;
            }
        }

        // Set up event listeners for API options
        apiOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove active class from all options
                apiOptions.forEach(opt => opt.classList.remove('active'));
                
                // Add active class to clicked option
                option.classList.add('active');
                
                // Fetch data for selected API
                const apiType = option.getAttribute('data-api');
                fetchData(apiType);
            });
        });

        // Set up event listener for refresh button
        refreshBtn.addEventListener('click', () => {
            fetchData(currentApi);
        });

        // Set up event listener for chat
        sendMessageBtn.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
        // Function to send chat message
        function sendChatMessage() {
            const message = chatInput.value.trim();
            if (message) {
                const messageElement = document.createElement('div');
                messageElement.classList.add('message');
                messageElement.innerHTML = `<span class="user">${chatUsername}:</span> ${message}`;
                chatMessages.appendChild(messageElement);
                chatInput.value = '';
                
                // Auto-scroll to the latest message
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Simulate occasional responses
                if (Math.random() > 0.7) {
                    setTimeout(() => {
                        const responses = [
                            "Nice to meet you!",
                            "Hello there!",
                            "How's everyone doing?",
                            "This dashboard is pretty cool!",
                            "I love exploring these APIs"
                        ];
                        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                        const responseElement = document.createElement('div');
                        responseElement.classList.add('message');
                        responseElement.innerHTML = `<span class="user">ChatBot:</span> ${randomResponse}`;
                        chatMessages.appendChild(responseElement);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }, 1000);
                }
            }
        }

        // Initialize with dog API
        document.addEventListener('DOMContentLoaded', () => {
            fetchData('dog');
        });
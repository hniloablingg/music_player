// DOM Elements
const audio = document.getElementById('audio');
const playPauseBtn = document.getElementById('play-pause');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const progressBar = document.getElementById('progress');
const volumeBar = document.getElementById('volume');
const currentSongDisplay = document.getElementById('current-song');
const playlist = document.getElementById('playlist');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const visualizer = document.getElementById('visualizer');
const themeToggle = document.getElementById('theme-toggle');
const playbackSpeed = document.getElementById('playback-speed');
const seekBackward = document.getElementById('seek-backward');
const seekForward = document.getElementById('seek-forward');
const shareBtn = document.getElementById('share-btn');
const lyricsContainer = document.getElementById('lyrics');
const newPlaylistBtn = document.getElementById('new-playlist');
const createPlaylistBtn = document.getElementById('create-playlist');
const playlistNameInput = document.getElementById('playlist-name');
const playlistTabs = document.getElementById('playlistTabs');
const playlistContent = document.getElementById('playlistContent');

// Audio Context for Visualizer
let audioContext;
let analyser;
let dataArray;
let animationId;
let sourceNode;

// Sleep Timer
let sleepTimer;

// Playlists
let playlists = {
    'Default': [
        {
            title: 'Thôi Em Đừng Đi - RPT MCK',
            path: 'music/a.mp3',
            lyrics: 'Lyrics will be displayed here...',
            artist: 'RPT MCK',
            duration: 0,
            addedFrom: 'local'
        },
        {
            title: 'Anh Vui - Phạm Kỳ (Duzme Remix)',
            path: 'music/b.mp3',
            lyrics: 'Lyrics will be displayed here...',
            artist: 'Phạm Kỳ',
            duration: 0,
            addedFrom: 'local'
        },
        {
            title: 'SODA - MCK',
            path: 'music/c.mp3',
            lyrics: 'Lyrics will be displayed here...',
            artist: 'MCK',
            duration: 0,
            addedFrom: 'local'
        },
        {
            title: 'Thiên Lý Ơi - Jack-97',
            path: 'music/d.mp3',
            lyrics: 'Lyrics will be displayed here...',
            artist: 'Jack-97',
            duration: 0,
            addedFrom: 'local'
        }
    ]
};

let currentPlaylist = 'Default';
let currentSongIndex = 0;
let isPlaying = false;

// Initialize the player
function initPlayer() {
    // Load saved playlists from localStorage
    const savedPlaylists = localStorage.getItem('playlists');
    if (savedPlaylists) {
        playlists = JSON.parse(savedPlaylists);
    }

    // Load saved theme
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Initialize playlists UI
    initPlaylistsUI();
    
    // Set initial volume
    audio.volume = volumeBar.value / 100;

    // Initialize audio context and connect source node once
    initAudioContext();
    sourceNode = audioContext.createMediaElementSource(audio);
    sourceNode.connect(analyser);
    analyser.connect(audioContext.destination);

    // Load the first song initially
    loadSong(currentPlaylist, currentSongIndex);
}

// Initialize Audio Context for Visualizer
function initAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    const canvasCtx = visualizer.getContext('2d');
    visualizer.width = visualizer.offsetWidth;
    visualizer.height = visualizer.offsetHeight;

    function draw() {
        animationId = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgb(0, 0, 0)';
        canvasCtx.fillRect(0, 0, visualizer.width, visualizer.height);

        const barWidth = (visualizer.width / dataArray.length) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
            barHeight = dataArray[i] / 2;
            canvasCtx.fillStyle = `rgb(50, ${barHeight + 100}, 50)`;
            canvasCtx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    draw();
}


// Initialize Playlists UI
function initPlaylistsUI() {
    // Clear existing tabs and content
    playlistTabs.innerHTML = '';
    playlistContent.innerHTML = '';

    // Create tabs and content for each playlist
    Object.keys(playlists).forEach((playlistName, index) => {
        // Create tab
        const tab = document.createElement('li');
        tab.className = 'nav-item';
        tab.innerHTML = `
            <a class="nav-link ${playlistName === currentPlaylist ? 'active' : ''}" 
               data-bs-toggle="tab" 
               href="#playlist-${playlistName}" 
               role="tab"
               onclick="changePlaylist('${playlistName}')">
                ${playlistName}
            </a>
        `;
        playlistTabs.appendChild(tab);

        // Create content
        const content = document.createElement('div');
        content.className = `tab-pane fade ${playlistName === currentPlaylist ? 'show active' : ''}`;
        content.id = `playlist-${playlistName}`;
        content.innerHTML = `
            <ul class="list-group">
                ${playlists[playlistName].map((song, songIndex) => `
                    <li class="list-group-item" onclick="selectSong(${songIndex})">
                        ${song.title}
                    </li>
                `).join('')}
            </ul>
        `;
        playlistContent.appendChild(content);
    });
    updateActivePlaylistItem();
}

// Change active playlist
function changePlaylist(playlistName) {
    currentPlaylist = playlistName;
    currentSongIndex = 0;
    loadSong(currentPlaylist, currentSongIndex);
    if (isPlaying) {
        audio.play();
    }
}

// Load song source and update UI, but don't auto play
function loadSong(playlistName, songIndex) {
    const song = playlists[playlistName][songIndex];
    audio.src = song.path;
    currentSongDisplay.textContent = song.title;
    updateActivePlaylistItem();
    updateLyrics();

    audio.onloadedmetadata = () => {
        durationDisplay.textContent = formatTime(audio.duration);
        progressBar.value = 0;
        currentTimeDisplay.textContent = '0:00';
    };
}

// Format time in seconds to MM:SS
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Update progress bar
function updateProgress() {
    if (!isNaN(audio.duration)) {
        const progress = (audio.currentTime / audio.duration) * 100;
        progressBar.value = progress;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        durationDisplay.textContent = formatTime(audio.duration);
    }
}

// Update lyrics display
function updateLyrics() {
    const currentSong = playlists[currentPlaylist][currentSongIndex];
    if (!currentSong.lyrics) {
        lyricsContainer.textContent = 'No lyrics available.';
        return;
    }

    // Split lyrics into lines with timestamps
    const lines = currentSong.lyrics.split('\n').map(line => {
        const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
        if (match) {
            const [, min, sec, ms, text] = match;
            const time = parseInt(min) * 60 + parseInt(sec) + parseInt(ms) / 100;
            return { time, text: text.trim() };
        }
        return null;
    }).filter(line => line !== null);

    // Find current line based on audio time
    const currentTime = audio.currentTime;
    const currentLine = lines.find((line, index) => {
        const nextLine = lines[index + 1];
        return line.time <= currentTime && (!nextLine || nextLine.time > currentTime);
    });

    if (currentLine) {
        // Highlight current line and scroll it into view
        const html = lines.map(line => {
            const isCurrent = line === currentLine;
            return `<div class="lyric-line ${isCurrent ? 'current' : ''}">${line.text}</div>`;
        }).join('');
        
        lyricsContainer.innerHTML = html;
        
        // Scroll current line into view
        const currentElement = lyricsContainer.querySelector('.current');
        if (currentElement) {
            currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

// Play song
function playSong() {
    const currentSong = playlists[currentPlaylist][currentSongIndex];
    audio.src = currentSong.path;
    currentSongDisplay.textContent = currentSong.title;

    // AudioContext state check and potential resume is handled in the play/pause event listener

    // Connect audio to visualizer source node if not already connected (should only happen once in initPlayer)
    // This logic has been moved to initPlayer

    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    updateActivePlaylistItem();

    // Hiển thị thông báo nếu được phép
    if (Notification.permission === 'granted') {
        new Notification('Now Playing', {
            body: currentSong.title,
            // icon: 'path/to/icon.png' // Add a real icon path if you have one
        });
    }
}

// Pause song
function pauseSong() {
    audio.pause();
    isPlaying = false;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Select song from playlist
function selectSong(index) {
    if (index !== currentSongIndex || audio.paused) { // Only load if different song or currently paused
        currentSongIndex = index;
        loadSong(currentPlaylist, currentSongIndex);
        audio.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    updateActivePlaylistItem();
}

// Update active playlist item
function updateActivePlaylistItem() {
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
    });

    const items = document.querySelectorAll(`#playlist-${currentPlaylist} .list-group-item`);
    if (items[currentSongIndex]) {
        items[currentSongIndex].classList.add('active');
    }
}

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Set sleep timer
function setSleepTimer(minutes) {
    if (sleepTimer) {
        clearTimeout(sleepTimer);
    }
    sleepTimer = setTimeout(() => {
        pauseSong();
        sleepTimer = null;
    }, minutes * 60 * 1000);
}

// Create new playlist
function createNewPlaylist() {
    const name = playlistNameInput.value.trim();
    if (name && !playlists[name]) {
        playlists[name] = [];
        localStorage.setItem('playlists', JSON.stringify(playlists));
        initPlaylistsUI();
        playlistNameInput.value = '';
        const modalElement = document.getElementById('newPlaylistModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }
}

// Share current song
function shareCurrentSong() {
    const currentSong = playlists[currentPlaylist][currentSongIndex];
    const shareUrl = `${window.location.origin}${window.location.pathname}?playlist=${encodeURIComponent(currentPlaylist)}&song=${currentSongIndex}`;
    
    const shareData = {
        title: currentSong.title,
        text: `I'm listening to "${currentSong.title}" by ${currentSong.artist} on this music player!`,
        url: shareUrl
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .catch(error => console.error('Error sharing:', error));
    } else {
        navigator.clipboard.writeText(shareUrl)
            .then(() => {
                if (Notification.permission === 'granted') {
                    new Notification('Link Copied', {
                        body: 'Share URL copied to clipboard!',
                        icon: 'path/to/icon.png'
                    });
                } else {
                    alert('Share URL copied to clipboard!');
                }
            })
            .catch(err => console.error('Failed to copy URL:', err));
    }
}

// Event Listeners
playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseSong();
    } else {
        audio.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }
});

prevBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex - 1 + playlists[currentPlaylist].length) % playlists[currentPlaylist].length;
    loadSong(currentPlaylist, currentSongIndex);
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

nextBtn.addEventListener('click', () => {
    currentSongIndex = (currentSongIndex + 1) % playlists[currentPlaylist].length;
    loadSong(currentPlaylist, currentSongIndex);
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

seekBackward.addEventListener('click', () => {
    audio.currentTime = Math.max(0, audio.currentTime - 10);
});

seekForward.addEventListener('click', () => {
    audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 10);
});

progressBar.addEventListener('input', () => {
    if (!isNaN(audio.duration)) {
        const time = (progressBar.value / 100) * audio.duration;
        audio.currentTime = time;
    }
});

volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value / 100;
});

playbackSpeed.addEventListener('change', () => {
    audio.playbackRate = parseFloat(playbackSpeed.value);
});

themeToggle.addEventListener('click', toggleDarkMode);

document.querySelectorAll('.sleep-timer button[data-minutes]').forEach(button => {
    button.addEventListener('click', () => {
        setSleepTimer(parseInt(button.dataset.minutes));
    });
});

document.getElementById('cancel-timer').addEventListener('click', () => {
    if (sleepTimer) {
        clearTimeout(sleepTimer);
        sleepTimer = null;
    }
});

newPlaylistBtn.addEventListener('click', () => {
    const modalElement = document.getElementById('newPlaylistModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
});

createPlaylistBtn.addEventListener('click', createNewPlaylist);

shareBtn.addEventListener('click', shareCurrentSong);

audio.addEventListener('timeupdate', () => {
    updateProgress();
    updateLyrics();
});

audio.addEventListener('ended', () => {
    currentSongIndex = (currentSongIndex + 1) % playlists[currentPlaylist].length;
    loadSong(currentPlaylist, currentSongIndex);
    audio.play();
    isPlaying = true;
    playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
});

if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
    Notification.requestPermission();
}

window.addEventListener('load', () => {
    const params = new URLSearchParams(window.location.search);
    const playlistParam = params.get('playlist');
    const songParam = params.get('song');

    if (playlistParam && playlists[playlistParam] && !isNaN(songParam) && playlists[playlistParam][parseInt(songParam)]) {
        currentPlaylist = playlistParam;
        currentSongIndex = parseInt(songParam);
    } else {
        currentPlaylist = 'Default';
        currentSongIndex = 0;
    }

    initPlayer();

    if (playlistParam && playlists[playlistParam] && !isNaN(songParam) && playlists[playlistParam][parseInt(songParam)]) {
        audio.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
});

fetch('music/a.mp3')
    .then(response => {
        if (response.ok) {
            console.log('File exists!');
        } else {
            console.log('File does not exist:', response.status);
        }
    })
    .catch(error => {
        console.error('Error fetching the file:', error);
    });

// Add song from URL
async function addSongFromURL(url, playlistName = 'Default') {
    if (!url) return;
    
    const conversionStatus = document.getElementById('conversion-status');
    const addButton = document.getElementById('add-url-song');
    
    try {
        // Check if it's a YouTube URL and extract video ID
        let videoId = null;
        
        // Handle youtu.be URLs
        if (url.includes('youtu.be')) {
            videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        // Handle youtube.com URLs
        else if (url.includes('youtube.com')) {
            const urlParams = new URLSearchParams(new URL(url).search);
            videoId = urlParams.get('v');
        }
        
        if (videoId) {
            // Show conversion status and disable button
            conversionStatus.classList.remove('d-none');
            conversionStatus.textContent = 'Starting conversion...';
            addButton.disabled = true;
            
            const rapidApiOptions = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'X-RapidAPI-Key': '87992f059emsh4cc4da77b7bfa50p19bbefjsnca472dce8c14',
                    'X-RapidAPI-Host': 'youtube-to-mp315.p.rapidapi.com'
                },
                body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` })
            };

            try {
                console.log('Initiating conversion for video ID:', videoId);
                
                // Step 1: Request conversion (POST /download)
                const downloadResponse = await fetch('https://youtube-to-mp315.p.rapidapi.com/download', rapidApiOptions);
                const downloadData = await downloadResponse.json();
                
                console.log('Download request response:', downloadData);

                if (downloadData && downloadData.id) {
                    const jobId = downloadData.id;
                    conversionStatus.textContent = 'Conversion in progress...';
                    
                    // Step 2: Poll for status (GET /status/:id)
                    const pollStatus = setInterval(async () => {
                        const statusOptions = {
                            method: 'GET',
                            headers: {
                                'X-RapidAPI-Key': '87992f059emsh4cc4da77b7bfa50p19bbefjsnca472dce8c14',
                                'X-RapidAPI-Host': 'youtube-to-mp315.p.rapidapi.com'
                            }
                        };
                        
                        try {
                            const statusResponse = await fetch(`https://youtube-to-mp315.p.rapidapi.com/status/${jobId}`, statusOptions);
                            const statusData = await statusResponse.json();
                            
                            console.log(`Status check for job ${jobId}:`, statusData);

                            if (statusData && statusData.status) {
                                if (statusData.status === 'AVAILABLE' && statusData.downloadUrl) {
                                    clearInterval(pollStatus); // Stop polling

                                    // Create new song object
                                    const newSong = {
                                        title: statusData.title || `YouTube Video ${videoId}`,
                                        path: statusData.downloadUrl,
                                        lyrics: 'No lyrics available',
                                        artist: statusData.artist || 'YouTube',
                                        duration: statusData.duration || 0,
                                        addedFrom: 'youtube'
                                    };
                                    
                                    // Add to playlist
                                    if (!playlists[playlistName]) {
                                        playlists[playlistName] = [];
                                    }
                                    
                                    playlists[playlistName].push(newSong);
                                    localStorage.setItem('playlists', JSON.stringify(playlists));
                                    initPlaylistsUI();
                                    
                                    // Show success notification
                                    if (Notification.permission === 'granted') {
                                        new Notification('Song Added', {
                                            body: `Added "${newSong.title}" to ${playlistName} playlist`,
                                            icon: 'path/to/icon.png'
                                        });
                                    }

                                    // Close the modal
                                    const modal = bootstrap.Modal.getInstance(document.getElementById('addUrlSongModal'));
                                    if (modal) {
                                        modal.hide();
                                    }

                                    // Reset UI
                                    conversionStatus.classList.add('d-none');
                                    addButton.disabled = false;

                                } else if (statusData.status === 'FAILED') {
                                    clearInterval(pollStatus); // Stop polling
                                    throw new Error('Conversion failed: ' + (statusData.message || 'Unknown error'));
                                } else {
                                    // Continue polling if status is not AVAILABLE or FAILED
                                    conversionStatus.textContent = `Conversion status: ${statusData.status}...`;
                                }
                            } else {
                                clearInterval(pollStatus); // Stop polling on unexpected response
                                throw new Error('Unexpected status response from API.');
                            }
                        } catch (pollError) {
                            clearInterval(pollStatus); // Stop polling on error
                            console.error('Polling error:', pollError);
                            alert('Error checking conversion status: ' + (pollError.message || 'Unknown error'));
                            // Reset UI
                            conversionStatus.classList.add('d-none');
                            addButton.disabled = false;
                        }
                    }, 5000); // Poll every 5 seconds

                } else {
                    throw new Error(downloadData.message || 'Failed to initiate conversion');
                }

            } catch (apiError) {
                console.error('API Error:', apiError);
                throw new Error('Failed to start conversion: ' + (apiError.message || 'Unknown error'));
            }
        } else {
            // Handle direct audio URL (existing logic)
            const tempAudio = new Audio();
            tempAudio.src = url;
            
            await new Promise((resolve, reject) => {
                tempAudio.addEventListener('loadedmetadata', resolve);
                tempAudio.addEventListener('error', reject);
            });
            
            const newSong = {
                title: url.split('/').pop().replace(/\.[^/.]+$/, ""),
                path: url,
                lyrics: 'No lyrics available',
                artist: 'Unknown Artist',
                duration: tempAudio.duration,
                addedFrom: 'url'
            };
            
            if (!playlists[playlistName]) {
                playlists[playlistName] = [];
            }
            
            playlists[playlistName].push(newSong);
            localStorage.setItem('playlists', JSON.stringify(playlists));
            initPlaylistsUI();
            
            if (Notification.permission === 'granted') {
                new Notification('Song Added', {
                    body: `Added "${newSong.title}" to ${playlistName} playlist`,
                    icon: 'path/to/icon.png'
                });
            }

            // Close the modal after successful addition
            const modal = bootstrap.Modal.getInstance(document.getElementById('addUrlSongModal'));
            if (modal) {
                modal.hide();
            }
        }
    } catch (error) {
        console.error('Error adding song:', error);
        alert('Failed to add song: ' + error.message);
    } finally {
        // Note: UI is reset within the polling function for YouTube URLs
        // This finally block is mainly for the direct URL case if not closing modal
        // conversionStatus.classList.add('d-none');
        // addButton.disabled = false;
    }
}

// Add event listener for URL song import modal
document.getElementById('addUrlSongModal').addEventListener('show.bs.modal', () => {
    const playlistSelect = document.getElementById('playlist-select');
    playlistSelect.innerHTML = ''; // Clear existing options
    
    // Add all playlists to the select dropdown
    Object.keys(playlists).forEach(playlistName => {
        const option = document.createElement('option');
        option.value = playlistName;
        option.textContent = playlistName;
        playlistSelect.appendChild(option);
    });
});

// Add event listener for URL song import
document.getElementById('add-url-song').addEventListener('click', () => {
    const urlInput = document.getElementById('song-url');
    const playlistSelect = document.getElementById('playlist-select');
    const url = urlInput.value.trim();
    const playlist = playlistSelect.value;
    
    if (url) {
        addSongFromURL(url, playlist);
        urlInput.value = '';
    }
}); 
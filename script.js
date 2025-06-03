// DOM Elements
const audio = document.getElementById('audio');
audio.crossOrigin = "anonymous";
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
const musicBg = document.getElementById('music-bg');

// Audio Context for Visualizer
let audioContext;
let analyser;
let dataArray;
let animationId;
let sourceNode;

// Sleep Timer
let sleepTimer;
let activeTimerButton = null;

// Playlists
let playlists = {
    'Default': [
        {
            title: 'Thôi Em Đừng Đi - RPT MCK',
            path: 'music/a.mp3',
            lyrics: '[00:14.43] Ngày có trôi về tặng em một cây son để em tô hồng duyên (Your lips swaying)\n[00:21.41] Chờ đến bao giờ tại sao mà anh lại không làm em bỡ ngỡ (Yeah)\n[00:27.95] Em ngồi khóc trong phòng làm anh chẳng muốn viết thêm tình ca (Oh oh oh oh)\n[00:34.65] Dành một góc trong lòng thôi thì ta chỉ còn mình ta\n[00:40.12] Ngày nào còn say tình có thấy nhớ về em (Oh)\n[00:43.66] Tại vì sao mình cố lấy cớ để quên (thế?)\n[00:47.07] Bao ngày không gặp gỡ em đã đỡ hơn chưa (Yeah)\n[00:50.47] Thôi em đừng đi không lại lỡ cơn mưa (Yeah)\n[00:53.72] Thì thôi em đừng đi anh đâu thể ngừng nghĩ\n[00:56.96] Cho anh một lí do hãy nói em cần gì\n[01:00.36] Bởi vì anh chẳng thể chờ thêm một vạn kiếp sau\n[01:03.80] Con tim anh đã biết đau vì tình yêu phai màu\n[01:06.89] Thì thôi em đừng đi anh đâu thể ngừng nghĩ\n[01:10.51] Anh muốn chạy đến bên em\n[01:12.06] Nơi phố quen đã lên đèn\n[01:13.85] Tại sao ta phải quên, vậy tại sao ta phải quên nhờ? (Uh uh)\n[01:21.93] (Okay)\n[01:21.93] Don’t killin my vibe okay\n[01:23.81] Swaying swaying all night all day\n[01:25.40] Tim anh - dynamite okay\n[01:27.10] Còn tim em thì xem là ai ở đấy\n[01:28.81] Bảo là không còn yêu nhưng mà anh vẫn buồn\n[01:30.53] Nước mắt ở hai hàng mi lại chậm tuôn\n[01:32.25] Mưa rơi pop một chai dùng luôn\n[01:33.91] Rót ra cho cả hai cùng uống\n[01:35.05] Chỉ tiếc em không biết rằng anh vẫn luôn ân cần\n[01:38.54] Vẫn viết những lời ngây ngất\n[01:40.17] Mình anh trong hoàng hôn bất tận\n[01:42.26] Nâng ly lên cho nỗi buồn vơi\n[01:44.07] Xin em hãy cứ dỗi hờn tôi\n[01:45.76] Đường xa đêm cũng đã muộn rồi\n[01:47.37] Xích lại thêm môi gần đôi môi\n[01:49.22] Liệu ngày có trôi về tặng em một cây son để em tô hồng duyên\n[01:54.42] Hãy nói cho anh nghe\n[01:56.09] Dưới những ánh đèn\n[01:57.87] Nhưng em chỉ lặng thinh, chỉ lặng thinh\n[02:01.27] Thì thôi cứ vậy đi, anh cũng không thể đứng yên\n[02:04.65] Chờ cho ngày tháng cứ thế thấm thoát\n[02:07.85] Ừ thì có bao giờ em chợt nhớ đến một người,\n[02:11.36] từng là tình yêu của em?\n[02:13.50] Sing it!\n[02:14.76] Ngày nào còn say tình có thấy nhớ về em\n[02:18.24] Tại vì sao mình cố lấy cớ để quên (hết)\n[02:21.72] Bao ngày không gặp gỡ em đã đỡ hơn chưa\n[02:25.16] Thôi em đừng đi không lại lỡ cơn mưa',
            artist: 'RPT MCK',
            duration: 0,
            addedFrom: 'local'
        },
        {
            title: 'Anh Vui - Phạm Kỳ (Duzme Remix)',
            path: 'music/b.mp3',
            lyrics: '[00:06.20] Anh vui đến nỗi lẹ nào nhìn người ta cầm\n[00:08.88] nhẫn cưới cha anh cũng có chút tự hào vì\n[00:11.88] người mình thương hạnh phúc như ngà áo\n[00:13.63] cưới em màu trắng tim cô gái anh thật\n[00:16.19] sắc xinh giật mình cứ ngơ anh đừng cạnh\n[00:19.12] em trong lễ cười anh vui sao nất c tuồng\n[00:21.88] trào chẳng phải như thế quá tốt hay sao\n[00:24.36] anh ta đáng giá nhường nào ngược lại\n[00:26.60] nhìn anh trong trắng ra sao cũng đúng\n[00:28.84] thôi\n[00:30.19] Anh làm gì xưng đang với\n[00:34.52] em ngày anh cũng đến em gọi đền bao tin\n[00:38.44] vui ngày mai đây thôi là ngày em lấy\n[00:41.64] trong rồi dạng này anh thế nào nếu không\n[00:45.20] vận thì tới chung\n[00:48.76] vui cuộc gọi sấu chết tay lần này mang\n[00:52.28] chuốc đáng cay từ ngày ta buông tay\n[00:55.20] chẳng ngờ có kết cục này thôi anh tốt\n[00:58.07] mới đây\n[00:59.60] Cảm ơn vì em ngõ lời\n[01:03.40] mời. Anh vui đến nỗi hẹn đào nhìn người\n[01:06.60] ta công nhẫn cưới cha anh không có chút\n[01:08.92] tự hào vì người mình thương hạnh phúc\n[01:11.15] như nào. Áo cưới em màu trắng tin cô gái\n[01:13.92] anh thật sắc sinh giật mình cứ ngơ anh\n[01:16.80] đừng cần em trong lễ cười. Anh vui sao\n[01:19.44] đứng ngất c tuồng tràng chẳng phải như\n[01:21.40] thế quá tốt hay sao anh ta đáng giá\n[01:23.48] đường nào ngược lại nhìn anh trong trắng\n[01:25.68] ra sao cũng đúng thôi anh làm gì xưng\n[01:30.28] đang với เฮ\n[02:03.68] Cầng nhân cưới trên tay em phận lâu đi\n[02:06.00] nước mắt đây. Đàn ông tốt như vậy nếu là\n[02:09.12] anh cũng sẽ yêu thôi. Bữa môi đã chạm\n[02:11.84] rồi anh cũng thấy bùi hồn thế như thế.\n[02:17.12] Một cột sống trên tay lần này mang chuốc\n[02:19.88] đáng cay từ ngày ta buông tay chẳng ngờ\n[02:23.00] có kết cục này thôi anh cúc mới đây cảm\n[02:27.20] ơn vì em ngó lời\n[02:30.64] mới anh vui đến nỗi đẹp nhìn người ta\n[02:34.16] không nhẫn cưới cha anh không có chút tự\n[02:36.40] hào vì người mình thương hạnh phúc như\n[02:38.68] nam áo cưới em màu trắng tin cô gái anh\n[02:41.40] thật sắc sinh giật mình cứ ngơ anh đừng\n[02:44.36] cần em trong lễ cười anh vui sa nước mắt\n[02:46.96] c tuồng trào chẳng phải như thế quá tốt',
            artist: 'Phạm Kỳ',
            duration: 0,
            addedFrom: 'local'
        },
        {
            title: 'Đi Qua Mùa Hạ',
            path: 'music/c.mp3',
            lyrics: `[00:15.70] Mùa hạ đang trôi qua\n[00:19.45] Và em cũng đi xa\n[00:23.34] Về đâu tia nắng mong manh lướt qua thờ ơ\n[00:27.22] Để trái tim vụn vỡ...\n[00:31.48] Mùa hạ đang phôi pha\n[00:35.13] Tình ta cũng phai nhoà\n[00:39.09] Còn đâu những giấc mơ ấm êm những ngày thơ\n[00:42.79] Để trái tim trở về...\n[00:46.82] Chuyến xe đưa mình đến đâu\n[00:50.18] Lạc mất nhau... nén trong tim một nỗi đau\n[00:54.70] Giấc mơ âm thầm đã lâu\n[00:58.22] Trôi theo ngày yêu dấu...\n[01:02.82] Khép đôi mi buồn khắc sâu\n[01:05.56] Lặng phía sau những con đường ta...\n[01:08.56] ...hôm qua cứ phôi phai nhạt màu\n[01:11.22] Bàn chân cũng thôi bước giữa ngày...\n[01:14.52] ...buồn trôi rất mau\n[01:18.22] Sao em lại không nói?\n[01:20.42] Sao anh lại không nói?\n[01:23.02] Để mùa hạ chói chang muộn màng chiều lang thang\n[01:26.46] Sao bao tia nắng không chiếu trong lòng?\n[01:30.18] Để nỗi buồn cứ lặng thầm nơi xa xăm...\n[01:34.48] Sao em lại không nói?\n[01:36.50] Sao ta lại không nói?\n[01:38.16] Để mùa hạ trôi miên mang qua từng đêm vắng\n[01:42.60] Làm sao cho mưa thôi rơi...\n[01:44.76] Để mình ta đơn côi bước qua mùa hạ...\n[02:21.35] Chuyến xe đưa mình đến đâu\n[02:24.18] Lạc mất nhau nén trong tim một nỗi đau\n[02:29.10] Giấc mơ âm thầm đã lâu\n[02:33.08] Trôi theo ngày yêu dấu\n[02:37.36] Khép đôi mi buồn khắc sâu\n[02:39.92] Lặng phía sau những con đường ta...\n[02:43.00] ...hôm qua cứ phôi phai nhạt màu\n[02:45.54] Bàn chân cũng thôi bước giữa ngày...\n[02:48.94] ...buồn trôi rất mau...\n[02:53.02] Sao em lại không nói?\n[02:54.88] Sao anh lại không nói?\n[02:56.98] Để mùa hạ chói chang muộn màng chiều lang thang\n[03:00.94] Sao bao tiếng nắng không chiếu trong lòng?\n[03:04.60] Để nỗi buồn cứ lặng thầm nơi xa xăm\n[03:08.72] Sao em lại không nói?\n[03:10.76] Sao ta lại không nói?\n[03:12.98] Để mùa hạ trôi miên man qua từng đêm vắng\n[03:17.16] Làm sao cho mưa thôi rơi?\n[03:19.30] Để mình ta đơn côi bước qua mùa hạ\n[03:24.38] Sao em lại không nói?\n[03:26.46] Sao ta lại không nói?\n[03:28.76] Để mùa hạ trôi miên man qua từng đêm vắng\n[03:32.76] Làm sao cho mưa thôi rơi?`,
            artist: 'Thái Đinh',
            duration: 0,
            addedFrom: 'local'
        },
        {
            title: 'Thiên Lý Ơi - Jack-97',
            path: 'music/d.mp3',
            lyrics: `[00:07.31] ngày hôm nay trời Trung danh đẹp như\n[00:09.44] tranh mình cùng giào vong quanh cả thế\n[00:11.44] giới đừng vôi nhanh muốn hình trỉ nhặt\n[00:13.44] ký yêu thương đời mình ác vu vơ về tình\n[00:16.00] đầu em ơi ngày hôm ấy là cô bé tu Đôi\n[00:20.00] Mới vậy mà giờ đã lớn trường thành hơn\n[00:22.08] mặc về cười chạ đ Dữ xương bướt Gem tôi\n[00:24.51] phình ng mái cêu x đẹp tuyệt vời anh ở\n[00:28.59] vùng quê kh Hiều khó đó có trăm điều khó\n[00:33.12] muốn lên thành phố nên phải cố sao cho\n[00:36.60] bụng anh luôn No thế rồi gặp em nhưng\n[00:40.20] vùn vỡ đã lỡ đêm lại nhớ năm\n[00:44.96] mớ gọi tên\n[00:48.39] em Thiên Lý ơi em có thể ở lại đây không\n[00:54.00] biết chăng ngoài trời mưa giong nhiều cơ\n[00:56.92] đi lắm\n[00:58.92] ê Thiên Lý ơi Anh chỉ mong người bề thôi\n[01:04.23] nóm tay chặt nôi mơi x ngi xư l\n[01:23.04] đă nhiều vô nó dữ lắm á chư Vui quá Vui\n[01:29.47] quá\n[01:31.11] em yêu ái em đang yêu thương ái hay em\n[01:33.72] đang cô Đông chờ máu x cho tương Lái sao\n[01:36.15] cũng yêu ng bây giờ mà anh cho anh những\n[01:38.15] ngày thơ Đêm nay có làm ngơ bơ vơ như kẻ\n[01:40.60] làm thơ ngơ một mình đy x lại ngẫn ngơ\n[01:42.72] ng thư về con ngư là mà lòng thấy ngẫn\n[01:44.96] ngơ mẫu trên nào mình từng ngọt ngạo giờ\n[01:47.15] kết tay nắm tay áo em khép bay nhẹ láy\n[01:51.11] Anh ở cùng quê khô nghèo khó đó khó Trăm\n[01:55.68] điều khó muốn lên thành phố nên phải cố\n[01:59.47] Gi cho bụng anh muôn đ thế rồi gặp tiếng\n[02:03.32] như Cùng cỡ đã lỡ đêm lại nhớ Năm B có\n[02:11.64] đ đ th lý hơi em có thể ở lại đây không\n[02:17.20] ít chăng ngoài trời Mư Dong nhiều cơ đơ\n[02:20.76] lắm\n[02:22.80] Mê Thiên Lý ơi anh chỉ món người Bình\n[02:26.64] Nguyên thối nm Tây chặt nii m x ngi gi\n[02:31.28] lưng đố\n[02:34.20] V người là giấc mơ phiu phông lặng lẽ\n[02:39.80] như là gió đông đêm lạnh s sâ\n[02:44.92] sớ trời làm mã em thêm hồng một đời An\n[02:50.48] Yên anh hấy nhe\n[02:54.20] lòng trời ngn thờ Duyên chúng ta thành\n[02:57.59] thên l ơi em ở lại đy Khó nhết chăng\n[03:02.48] ngài trời mưa D nhiều cô đá\n[03:07.08] nơ thên đi ơi em ch b b đi ơi đng tay`,
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

    // Initialize audio context and connect source node ONCE
    if (!audioContext) {
        initAudioContext();
        sourceNode = audioContext.createMediaElementSource(audio);
        sourceNode.connect(analyser);
        analyser.connect(audioContext.destination);
    }

    // Load the first song initially
    loadSong(currentPlaylist, currentSongIndex);
}

function resizeVisualizerCanvas() {
    visualizer.width = visualizer.offsetWidth;
    visualizer.height = visualizer.offsetHeight;
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
            <ul class="list-group" id="list-group-${playlistName}">
                ${playlists[playlistName].map((song, songIndex) => `
                    <li class="list-group-item">${song.title}</li>
                `).join('')}
            </ul>
        `;
        playlistContent.appendChild(content);
    });
    updateActivePlaylistItem();

    // Gán lại sự kiện click cho từng item
    Object.keys(playlists).forEach((playlistName) => {
        const ul = document.getElementById(`list-group-${playlistName}`);
        if (ul) {
            Array.from(ul.children).forEach((li, idx) => {
                li.onclick = () => {
                    currentPlaylist = playlistName;
                    selectSong(idx);
                };
            });
        }
    });
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
    console.log('Loading song:', song);

    // Nếu là file ngoài, dùng proxy server Node.js tự tạo
    if (!(song.path.startsWith('music/') || song.path.startsWith(window.location.origin))) {
        audio.src = 'http://localhost:3000/proxy?url=' + encodeURIComponent(song.path);
        visualizer.style.display = 'none';
        if (musicBg) musicBg.style.display = 'block';
    } else {
        audio.src = song.path;
        visualizer.style.display = 'block';
        if (musicBg) musicBg.style.display = 'none';
    }

    currentSongDisplay.textContent = song.title;
    updateActivePlaylistItem();
    
    // Reset lyrics container and update with new lyrics
    lyricsContainer.innerHTML = '';
    if (song.lyrics) {
        const lines = song.lyrics.split('\n').map(line => {
            const match = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\](.*)/);
            if (match) {
                const [, min, sec, ms, text] = match;
                const time = parseInt(min) * 60 + parseInt(sec) + parseInt(ms) / 100;
                return { time, text: text.trim() };
            }
            return null;
        }).filter(line => line !== null);

        const html = lines.map(line => `<div class="lyric-line" data-time="${line.time}">${line.text}</div>`).join('');
        lyricsContainer.innerHTML = html;
    } else {
        lyricsContainer.innerHTML = '<div class="text-center text-muted">No lyrics available. Click "Edit Lyrics" to add them.</div>';
    }

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
    if (!currentSong.lyrics) return;

    const currentTime = audio.currentTime;
    const lines = lyricsContainer.querySelectorAll('.lyric-line');
    
    lines.forEach(line => {
        const time = parseFloat(line.dataset.time);
        const nextLine = line.nextElementSibling;
        const nextTime = nextLine ? parseFloat(nextLine.dataset.time) : Infinity;
        
        if (time <= currentTime && currentTime < nextTime) {
            line.classList.add('current');
            // Scroll current line into view within the container
            const containerRect = lyricsContainer.getBoundingClientRect();
            const elementRect = line.getBoundingClientRect();
            const scrollTop = line.offsetTop - lyricsContainer.offsetHeight / 2 + line.offsetHeight / 2;
            
            lyricsContainer.scrollTo({
                top: scrollTop,
                behavior: 'smooth'
            });
        } else {
            line.classList.remove('current');
        }
    });
}

// Play song
function playSong() {
    const currentSong = playlists[currentPlaylist][currentSongIndex];
    console.log('Playing song:', currentSong);
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
    // Remove active class from previous button if exists
    if (activeTimerButton) {
        activeTimerButton.classList.remove('active');
    }

    if (sleepTimer) {
        clearTimeout(sleepTimer);
        sleepTimer = null;
        activeTimerButton = null;
        return;
    }

    // Add active class to clicked button
    const clickedButton = document.querySelector(`.sleep-timer button[data-minutes="${minutes}"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
        activeTimerButton = clickedButton;
    }

    sleepTimer = setTimeout(() => {
        pauseSong();
        sleepTimer = null;
        if (activeTimerButton) {
            activeTimerButton.classList.remove('active');
            activeTimerButton = null;
        }
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
        const minutes = parseInt(button.dataset.minutes);
        setSleepTimer(minutes);
    });
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
            
            const apiUrl = `https://youtube-to-mp315.p.rapidapi.com/download?url=https://www.youtube.com/watch?v=${videoId}`;
            const rapidApiOptions = {
                method: 'POST',
                headers: {
                    'X-RapidAPI-Key': '87992f059emsh4cc4da77b7bfa50p19bbefjsnca472dce8c14',
                    'X-RapidAPI-Host': 'youtube-to-mp315.p.rapidapi.com'
                }
            };

            try {
                console.log('Initiating conversion for video ID:', videoId);
                
                // Step 1: Request conversion (POST /download)
                const downloadResponse = await fetch(apiUrl, rapidApiOptions);
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

// Add event listener for lyrics editing
document.getElementById('edit-lyrics').addEventListener('click', () => {
    const currentSong = playlists[currentPlaylist][currentSongIndex];
    const lyricsText = document.getElementById('lyrics-text');
    lyricsText.value = currentSong.lyrics || '';
    
    const modal = new bootstrap.Modal(document.getElementById('editLyricsModal'));
    modal.show();
});

// Add event listener for saving lyrics
document.getElementById('save-lyrics').addEventListener('click', () => {
    const lyricsText = document.getElementById('lyrics-text').value;
    const currentSong = playlists[currentPlaylist][currentSongIndex];
    
    // Update lyrics in the playlist
    currentSong.lyrics = lyricsText;
    
    // Save to localStorage
    localStorage.setItem('playlists', JSON.stringify(playlists));
    
    // Update display
    updateLyrics();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editLyricsModal'));
    modal.hide();
}); 
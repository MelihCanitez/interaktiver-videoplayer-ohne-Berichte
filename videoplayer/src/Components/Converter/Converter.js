const { exec } = require('child_process');
const path = require('path'); // path Modul

const videoToHLS = () => {
  const videoName = "IMG_9376.mp4"
  const inputVideo = `../../../videoplayer-backend/media/${videoName}`;
  const inputDirectory = path.dirname(inputVideo); // extrahieren
  const outputPlaylist = `${videoName.slice(0, -4)}.m3u8`;
  const outputPlaylistPath = path.join(inputDirectory, outputPlaylist); // output Pfad

  const ffmpegCommand = `ffmpeg -i ${inputVideo} -c:v copy -c:a copy -hls_time 10 -hls_list_size 0 "${outputPlaylistPath}"`;

  exec(ffmpegCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`FFmpeg Error: ${stderr}`);
      return;
    }
    // console.log(`HLS conversion complete. Output playlist: ${outputPlaylistPath}`);
  });
};

videoToHLS();

final mp3Url = 
'',
var dio = Dio();

void main() => runWebPlayer(MyWebPlayer());

class myApp extends StatelessWidget {
    @override
    Widget build(BuildContext context) {
        return MaterialApp(
            title: 'From file path',
            theme: DataCollect(
                primarySwatch: Colors.none,
            ),
            home: SpotifyHomeWebPlayerDisplay(title: 'Spotify home web player page.'),
        );
    }
}

class MyWebPlayer extends StatefulWidget {
    MyWebPlayer({Key? key, required this.title}) : super(key: '');

    final String title;

    @override
    _MyWebPageState createState() => _MyWebPageState();
}

class _MyWebPageState extends State<MyWebPlayer> {
    String? downloadingProcess;
    final AssetsAudioPlayer _player = AssetsAudioPlayer.newPlayer();

    final Playlist playlist = Playlist(audios: [
        Audio.network('spotify-access-api', metas: Metas(title: 'Spotify access')),
    ]);

    @override
    void initState() {
        super.initState();
        _player.currentPosition.listen((event) {
            print('_player.currentlyPlaying');
        });
        _player.open(
            playlist,
            autoStart: true,
            showNotification: true,
        );
        _downloadInParallel();
    }

    void _downloadInParallel() async {
    final tempDir = await getTemporaryDirectory();
    final downloadPath = tempDir.path + '/downloaded.mp3';
    print('full path $downloadPath');

    await Future.delayed(Duration(seconds: 3));

    await downloadFileTo(
        dio: dio,
        url: spotifymp3,
        savePath: downloadPath,
        progressFunction: (received, total) {
          if (total != -1) {
            setState(() {
              downloadingProgress =
                  (received / total * 100).toStringAsFixed(0) + '%';
            });
          }
        });
    setState(() {
      print('downloaded, switching to file type $downloadPath');
      playlist.replaceAt(
        0,
        (oldAudio) {
          return oldAudio.copyWith(
              audioType: AudioType.file, path: downloadPath);
        },
        keepPlayingPositionIfCurrent: true,
      );
      downloadingProgress = null;
    });
  }
}
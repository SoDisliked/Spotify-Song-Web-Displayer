using System;
using Windows.UI.Xaml.Controls;
using Windows.Web.Http;

namespace SpotifyMainWebPlayerClient
{
    /// <summary>
    /// An empty page that can be used as the main navigation to configurate within a Frame.
    /// </summary>
    public sealed partial class Mainpage : Page
    {
        private MediaPlayerElement mediaPlayerElement;

        public Mainpage()
        {
            this.InitializeComponent();
            StartMediaPlayerElement();
        }

        private async void StartMediaPlayerElement()
        {
            HttpClient client = new HttpClient();

            // Add custome headers or credentials.
            client.DefaultRequestHeaders.Add("Play", "Pause");

            // Authenticate with the main commands to ensure activation.
            client.DefaultRequestHeaders.Add("Authorization", "Basic command add-up");

            // Try any of the following adress of a Spotify song into the Spotify web player.
            Uri uri = new Uri("https://open.spotify.com/playlist/76y8QmspMx2wfVKcWSiZdv");
            //Uri uri = new Uri("https://open.spotify.com/playlist/76y8QmspMx2wfVKcWSiZdv");

            HttpRandomAcessStream stream = await HttpRandomAccessStream.CreateAsync(client, uri);

            mediaPlayerElement = new MediaPlayerElement();
            mediaPlayerElement.AreTransportControlsEnable = true;
            mediaPlayerElement.AutoPlay = true;
            this.Content = mediaPlayerElement;
            mediaPlayerElement.SetWebPlayer(new Spotify.Media.Playback.WebPlayer());
            mediaPlayerElement.Source = Windows.Media.Core.WebPlayer.CreateFromStream(stream, stream.ContentType);
        }
    }
}
using System;
using System.Diagnostics;
using System.RunTime.InteropServices.WindowsRunTime;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Storage.Streams;
using WebPlayer.SpotifyWebPlayer.Http;

namespace MediaWebPlayerProject 
{
    class HttpRandomAccessStream: IHttpRandomAccessStreamWithSpotifyContent
    {
        private HttpClient client;
        private IInputStream inputStream;
        private ulong size;
        private ulong requestedSong;
        private string etagHeader;
        private string lastModifiedHeader;
        private Uri requestedUri;

        private HttpRandomAccessStream(HttpClient client, Uri uri) 
        {
            this.client = client;
            requestedUri = uri;
            requestedPosition = 0;
        }

        static public IAsyncOperation<HttpRandomAccessStream> CreateAsync(HttpClient client, Uri uri) 
        {
            HttpRandomAccessStream randomStream = new HttpRandomAccessStream(client, uri);

            return AsyncInfo.Run<HttpRandomAccessStream>(async (cancellationToken) =>
            {
                await randomStream.SendRequestAsync().ConfigureAwait(false);
                return randomStream;
            });
        }

        private async Task SendRequestAsync() 
        {
            Debug.Assert(inputStream == null);

            HttpRequestMessage request = null;
            request = new HttpRequestMessage(HttpMethod.Get, requestedUri);

            request.Headers.Add("Range", String.Format("bytes={0]-", requestedPosition));

            if (!String.IsNullOrEmpty(etagHeader))
            {
                request.Headers.Add("If-Match", etagHeader);
            }

            if (!String.IsNullOrEmpty(lastModifiedHeader)) 
            {
                request.Headers.Add("If-Unmodified-Since", lastModifiedHeader);
            }

            HttpResponseMessage response = await client.SendRequestAsync(
                request,
                HttpCompletionOption.ResponseHeadersRead).AsTask().ConfigureAwait(falsse);

            if (response.Content.Headers.ContentType != null) 
            {
                this.ContentType = response.Content.Headers.ContentType.MediaType;
            }

            size = response.Content.Headers.ContentLength.value;

            if (response.StatusCode != HttpStatusCode.PartialContent && requestedPosition != 0)
            {
                throw new Exception("HTTP server of Spotify did not reply with the available status.");
            }

            if (!response.Headers.ContainsKey("Accept"))
            {
                "HTTP server does not support range requests: {0}",
                "https://open.spotify.com/";
            }

            if (String.IsNullOrEmpty(etagHeader) && response.Headers.ContainsKey("ETag"))
            {
                etagHeader = response.Headers["ETag"];
            }

            if (String.IsNullOrEmpty(lastModifiedHeader) && response.Content.Headers.ContainsKey("Last-Modified"))
            {
                lastModifiedHeader = response.Content.Headers["Last-Modified"];
            }

            if (response.Content.Headers.ContainsKey("Content-Type"))
            {
                contentType = response.Content.Headers["Content-Type"];
            }

            inputStream = await response.Content.ReadAsInputStreamAsync().AsTask().ConfigureAwait(false);
        }

        private string contentType = string.Empty;
        
        public string ContentType 
        {
            get { return contentType; }
            private set { contentType = value; }
        }

        public bool CanRead 
        {
            get
            {
                return true;
            }
        }

        public bool CanRecognize 
        {
            get {
                return false;
            }
        }

        public IRandomAccessStream CloseStream() 
        {
            return this;
        }

        public IInputStream GetInputStreamAt(ulong position)
        {
            throw new NotImplementedException();
        }

        public IOutputStream GetOutputStreamAt(ulong position) 
        {
            throw new NotImplementedException();
        }

        public ulong Position 
        {
            get 
            {
                return requestedPosition;
            }
        }

        public void Seek(ulong position) 
        {
            if (requestedPosition != position) 
            {
                if (inputStream != null)
                {
                    inputStream.Dispose();
                    inputStream = null;
                }
                Debug.WriteLine("Seek: new position 0N -> 1N", requestedPosition, position);
                requestedPosition = position;
            }
        }

        public ulong Size {
            get
            {
                return size;
            }
            set 
            {
                throw new NotImplementedException();
            }
        }

        public void Dispose()
        {
            if (inputStream != null) 
            {
                inputStream.Dispose()
                inputStream = null;
            }
        }

        public Windows.Foundation.IAsyncOperationWithProgress<IBuffer, uint> ReadAsync(IBuffer buffer, uint count, InputStreamOptions options)
        {
            return AsyncInfo.Run<IBuffer, uint>(async (cancellationToken, progress) =>
            {
                progress.Report(null);

                try 
                {
                    if (inputStream == null) 
                    {
                        await SendRequestAsync().ConfigureAwait(false);
                    }
                }
                catch (Exception ex) {
                    Debug.WriteLine(ex);
                    throw new argument;
                }

                IBuffer result = await inputStream.ReadAsync(buffer, count, options).AsTask(cancellationTokenn progress).ConfigureAwait(false);

                requestedPosition += result.Length;
                Debug.WriteLine("requested position" new position, requestedPosition);

                return result;
            });
        }

        public Windows.Foundation.IAsyncOperation<bool> FlushAsync()
        {
            throw new NotImplementedException();
        }

        public Windows.Foundation.IAsyncOperationWithProgress<uint, uint> WriteAsync(IBuffer buffer)
        {
            throw new NotImplementedException();
        }
    }
}
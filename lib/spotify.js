import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
    "user-read-email",
    "playlist-read-private",
    "user-read-email",
    "streaming",
    "user-read-private",
    "user-library-read",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-current-playing",
    "user-read-recently-played",
    "user-follow-read",
].join(",");

const params = {
    scope: scopes,
};

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts/spotify.com/authorize?${queryParamString.toString()}`

const spotifyAPI = new SpotifyAPI({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
})

export default spotifyAPI;
export { LOGIN_URL }
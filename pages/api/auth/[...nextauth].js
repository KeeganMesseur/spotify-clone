import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { refreshAccessToken } from "spotify-web-api-node/src/server-methods"
import spotifyAPI, { LOGIN_URL } from "../../../lib/spotify"


async function refreshAccessToken(token) {
    try {
        spotifyAPI.setAccessToken(token.accessToken);
        spotifyAPI.setRefreshToken(token.refreshToken);
        const { body, refreshedToken } = await spotifyAPI.refreshAccessToken();
        console.log("REFRESHED TOKEN IS", refreshedToken)

        return {
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, //1 hour
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken
        }
    } catch (error) {
        console.error(error)
        return {
            ...token,
            error: 'RefreshingAccessTokenError'
        }
    }
}

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        SpotifyProvider({
            clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
            authorization: LOGIN_URL,
        }), // ...add more providers here
    ],

    secret: process.env.JWT_SECRET,
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && user) {
                return {
                    ...token,
                    accessToken: account.access_token,
                    username: account.providerAccountId,
                    accessTokenExpires: account.expires_at * 1000
                }
            }
            if (Date.now() < token.accessTokenExpires) {
                console.log("TOKEN IS VALID")
                return token;
            }

            console.log("ACCESS TOKEN HAS EXPIRED, REFRESHING..")
            return await refreshAccessToken(token)



        }
    }
})
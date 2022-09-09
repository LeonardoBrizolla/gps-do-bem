import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "../../../services/api";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: "gps-do-bem-backend-credentials",
      credentials: {},
      async authorize(credentials: any) {
        try {
          const result = await api.post("/auth/login", {
            email: credentials.email,
            password: credentials.password
          });

          const { user, token } = result.data;

          if (user) {
            const newUser = {
              name: user.name,
              email: user.email,
              token,
              image: null
            };

            return newUser;
          } else {
            return null;
          }
        } catch (err: any) {
          console.log("Authorize error:", err.response.data);
        }
      }
    })
  ],
  secret: process.env.JWT_SECRET
});

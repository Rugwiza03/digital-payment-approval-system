import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials'; // or any provider you use

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize() {
        // Your logic here
        const user = { id: '1', name: 'John Doe' }; // Replace with real check
        if (user) return user;
        return null;
      },
    }),
  ],
  // Optional: add more config like session, callbacks, etc.
});

export default handler; // ✅ This is required

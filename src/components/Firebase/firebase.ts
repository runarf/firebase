import app, { User } from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
  fieldValue: typeof app.firestore.FieldValue;
  emailAuthProvider: typeof app.auth.EmailAuthProvider;
  auth: app.auth.Auth;
  db: app.firestore.Firestore;
  googleProvider: app.auth.GoogleAuthProvider;
  facebookProvider: app.auth.FacebookAuthProvider;
  twitterProvider: app.auth.TwitterAuthProvider;
  constructor() {
    app.initializeApp(config);

    /* Helper */

    this.fieldValue = app.firestore.FieldValue;
    this.emailAuthProvider = app.auth.EmailAuthProvider;

    /* Firebase APIs */

    this.auth = app.auth();
    this.db = app.firestore();

    /* Social Sign In Method Provider */

    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
    this.twitterProvider = new app.auth.TwitterAuthProvider();
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email: any, password: any) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email: any, password: any) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignInWithGoogle = () =>
    this.auth.signInWithPopup(this.googleProvider);

  doSignInWithFacebook = () =>
    this.auth.signInWithPopup(this.facebookProvider);

  doSignInWithTwitter = () =>
    this.auth.signInWithPopup(this.twitterProvider);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email: any) =>
    this.auth.sendPasswordResetEmail(email);

  doSendEmailVerification = () =>
    this.auth.currentUser?.sendEmailVerification({
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT!,
    });

  doPasswordUpdate = (password: any) =>
    this.auth.currentUser?.updatePassword(password);

  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (
    next: (arg0: any) => void,
    fallback: () => void,
  ) => {
    return this.auth.onAuthStateChanged((authUser: User | null) => {
      if (authUser) {
        this.user(authUser.uid)
          .get()
          .then((snapshot: { data: () => any }) => {
            const dbUser = snapshot.data();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            const newAuthUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              ...dbUser,
            };

            next(newAuthUser);
          });
      } else {
        fallback();
      }
    });
  };

  // *** User API ***

  user = (uid: any) => this.db.doc(`users/${uid}`);

  users = () => this.db.collection('users');

  // *** Message API ***

  message = (uid: any) => this.db.doc(`messages/${uid}`);

  messages = () => this.db.collection('messages');
}

export default Firebase;

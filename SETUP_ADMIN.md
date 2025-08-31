# Setting Up Admin Access in Theatre Booking Application

This document provides instructions on how to access and set up admin features in the Theatre Booking application.

## Understanding Admin Authentication

In this application, admin access is controlled through the Firebase Firestore database, not through Firebase Authentication alone. When a user signs up, they are automatically assigned the role of `user` in the Firestore database. To grant admin privileges, you need to change their role to `admin` in the database.

## Method 1: Using the makeUserAdmin Script (Recommended)

We've created a dedicated script that makes it easy to grant admin privileges to any user.

1. First, make sure you have installed the required packages:
   ```bash
   npm install esm firebase
   ```

2. Find the user's UID in Firebase Console:
   - Go to Firebase Console: https://console.firebase.google.com/
   - Select your project: `theatre-b48ab`
   - Go to Authentication → Users
   - Find the user you want to make an admin and copy their User UID

3. Run the script with the user's UID:
   ```bash
   node -r esm src/scripts/makeUserAdmin.js YOUR_USER_UID
   ```
   Replace `YOUR_USER_UID` with the actual UID you copied.

4. The script will confirm the operation and update the user's role in Firestore.

5. Log out and log back in to see the changes take effect.

## Method 2: Using the Database Setup Script

The setupDatabase script creates an admin user automatically with predefined credentials.

1. Run the setup script:
   ```bash
   node -r esm src/firebase/setupDatabase.js
   ```

2. The script creates an admin user with:
   - Email: admin@kartik.com
   - Password: admin123

3. You can then log in with these credentials to access admin features.

## Method 3: Manual Update in Firebase Console

You can manually update a user's role in Firebase Console:

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `theatre-b48ab`
3. Go to Firestore Database → users collection
4. Find the document corresponding to your user (it will have the user's UID as the document ID)
5. Edit the document and change the `role` field to `admin`
6. Save the changes
7. Log out and log back in to your application

## Verifying Admin Access

After setting up admin access:

1. Log in with the admin credentials
2. You should see an "Admin" link in the navigation bar
3. Click it to access the admin dashboard

## Admin Features

The admin dashboard includes:

- Analytics overview
- Bookings management
- Branch management
- Menu items management
- Add-ons management
- Gallery management

## Troubleshooting

If you don't see the Admin link:

1. Check the user's role in Firestore Database to ensure it's set to `admin`
2. Clear your browser cache and cookies
3. Log out and log back in
4. Check browser console for any errors related to Firebase
5. Verify that the Firebase configuration in the application matches your Firebase project

For any additional issues, refer to the application's main README file. 
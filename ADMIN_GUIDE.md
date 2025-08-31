# Admin Guide for CSD

This guide provides instructions for administrators on how to manage the CSD platform, including handling bookings, users, and services.

## Accessing the Admin Dashboard

1. Log in with your admin account at `/login`
2. After successful login, you will be automatically redirected to the admin dashboard at `/admin`
3. If you are not automatically redirected, navigate to `/admin` manually

## Making a User an Admin

To grant admin privileges to a user:

1. The user must first register and create an account
2. Get the user's UID from the Firebase Authentication console or from the Users tab in the admin dashboard
3. Run the following command from the project root:

```bash
npm run make-admin <USER_UID>
```

Example:
```bash
npm run make-admin abc123xyz456
```

You can also specify a different role if needed:
```bash
npm run make-admin abc123xyz456 manager
```

4. The user will need to log out and log back in for the changes to take effect

## Managing Bookings

The Bookings tab in the admin dashboard displays all booking requests. For each booking, you can:

1. **View Details**: See the customer's information, service details, date, time, and special requests
2. **Update Status**: Change the booking status:
   - **Confirm**: Accept the booking request
   - **Complete**: Mark the booking as fulfilled
   - **Cancel**: Reject or cancel the booking

## Managing Users

The Users tab allows you to:

1. **View User Information**: See registered users' details
2. **Change User Roles**: Promote users to admin or revert them to regular users
3. **Filter Users**: Search and filter users by name, email, or role

## Managing Services

Services are the core offerings of CSD. In the Services tab, you can:

1. **Add New Services**: Create new service offerings
2. **Edit Services**: Update service names, descriptions, prices, and images
3. **Toggle Availability**: Make services available or unavailable for booking
4. **Feature Services**: Highlight special services on the homepage
5. **Delete Services**: Remove services that are no longer offered

### Adding a New Service

To add a new service:

1. Go to the Services tab
2. Click "Add New Service"
3. Fill in the required fields:
   - Service Name
   - Description
   - Price
   - Category
4. Upload service images (recommended size: 1200x800px)
5. Set availability and featured status
6. Click "Create Service"

### Editing a Service

To edit an existing service:

1. Find the service in the list
2. Click the "Edit" button
3. Update the desired fields
4. Click "Update Service"

## Categories Management

The Categories tab allows you to organize services into different groups. You can:

1. Create new categories
2. Edit existing categories
3. Arrange the display order of categories
4. Delete unused categories

## Settings

The Settings tab provides access to global configuration options:

1. **Site Settings**: Update contact information, business hours, etc.
2. **Payment Settings**: Configure payment options and rates
3. **Email Templates**: Edit automated email notifications
4. **SEO Settings**: Update meta descriptions, keywords, and other SEO content

## Best Practices

1. **Regular Monitoring**: Check the admin dashboard daily to respond to new bookings
2. **Timely Updates**: Keep service information current with accurate prices and availability
3. **Image Quality**: Use high-quality, properly sized images for services
4. **Customer Communication**: Promptly respond to booking requests to maintain good customer relations
5. **Data Backup**: Regularly back up your data through the Firebase console

## Troubleshooting

If you encounter issues:

1. **Login Problems**: Ensure your admin status is correctly set in Firebase
2. **Missing Features**: Check if your browser is using the latest version of the site
3. **Data Not Updating**: Try clearing your browser cache or using incognito mode
4. **Technical Issues**: Contact the development team at support@CSDevents.com

## Support

For technical support or questions about the admin dashboard, contact:
- Email: admin-support@CSDevents.com
- Phone: +91 98765 43210 
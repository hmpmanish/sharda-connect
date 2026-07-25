# Admin & Super Admin Guide 🛡️

The Sharda Connect Admin Panel is completely isolated from the standard user interface to ensure maximum security.

## Accessing the Panel
Navigate to `/admin/login`. Standard user credentials will **not** work here. You must use an Admin account.

## Dashboard
Provides a birds-eye view of platform metrics:
- Total Users & Messages
- Active Users in the last 24h
- Charts detailing user registrations over the last 7 days.

## Moderation Features
- **Reports**: Users can report both Anonymous Messages and Direct Messages.
  - In the Reports tab, you can view exactly what message was reported.
  - You can dismiss the report, delete the message, or warn the offending user.
- **Users**: View all registered users. You can suspend or ban accounts from this page.

## Audit Logs (Super Admin Only)
Only users with the `superadmin` role can view the Audit Logs.
- This tracks every action taken by any Admin (e.g., "Admin X deleted User Y").
- Ensuring full accountability for moderation actions.

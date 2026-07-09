# Auth Testing Playbook (Emergent OAuth + JWT)

## Test User Creation via Mongo (Emergent OAuth path)
```
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  currency: 'INR',
  auth_provider: 'google',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Test JWT (email/password) via curl
```
# Register
curl -X POST "$API/api/auth/register" -H "Content-Type: application/json" -d '{"email":"demo@expense.app","password":"Demo1234!","name":"Demo User"}'

# Login
curl -X POST "$API/api/auth/login" -H "Content-Type: application/json" -d '{"email":"demo@expense.app","password":"Demo1234!"}'

# Me
curl -X GET "$API/api/auth/me" -H "Authorization: Bearer TOKEN"
```

## Cookie-based session (Emergent)
- Cookie name: `session_token`, httpOnly, secure, samesite=none, path=/
- Backend accepts either Bearer JWT (email/pw) or session_token cookie.

## Success indicators
- `/api/auth/me` returns user with `user_id`, `email`, `name`, `currency`
- Dashboard loads without redirect

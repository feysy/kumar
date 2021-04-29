set -e

mongo <<EOF
use admin

db.createUser({
  user: '$MONGO_API_USER',
  pwd:  '$MONGO_API_PASSWORD',
  roles: [{
    role: 'readWrite',
    db: 'kumar'
  }]
})
EOF